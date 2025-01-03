using api.Context;
using api.Exceptions;
using api.Features.CaseProfiles.Repositories;
using api.Features.Images.Dto;
using api.Models;

using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;

using Microsoft.EntityFrameworkCore;

namespace api.Features.Images.Service;

public class BlobStorageService(BlobServiceClient blobServiceClient,
    ICaseRepository caseRepository,
    DcdDbContext context)
    : IBlobStorageService
{
    public static string ContainerName { get; set; } = null!;

    private static string SanitizeBlobName(string name)
    {
        return name.Replace(" ", "-").Replace("/", "-").Replace("\\", "-");
    }

    public async Task<ImageDto> SaveImage(Guid projectId, string projectName, IFormFile image, Guid? caseId = null)
    {
        var sanitizedProjectName = SanitizeBlobName(projectName);
        var containerClient = blobServiceClient.GetBlobContainerClient(ContainerName);

        var imageId = Guid.NewGuid();

        if (projectId == Guid.Empty || caseId == Guid.Empty)
        {
            throw new ArgumentException("ProjectId and/or CaseId cannot be empty.");
        }

        var blobName = caseId.HasValue
            ? $"{sanitizedProjectName}/cases/{caseId}/{imageId}"
            : $"{sanitizedProjectName}/projects/{projectId}/{imageId}";

        var blobClient = containerClient.GetBlobClient(blobName);

        await using var stream = image.OpenReadStream();
        await blobClient.UploadAsync(stream, new BlobHttpHeaders { ContentType = image.ContentType });

        var imageUrl = blobClient.Uri.ToString();
        var createTime = DateTimeOffset.UtcNow;

        var imageEntity = new Image
        {
            Id = imageId,
            Url = imageUrl,
            CreateTime = createTime,
            CaseId = caseId,
            ProjectId = projectId,
            ProjectName = sanitizedProjectName
        };

        context.Images.Add(imageEntity);

        if (imageEntity.CaseId.HasValue)
        {
            await caseRepository.UpdateModifyTime((Guid)imageEntity.CaseId);
        }

        await context.SaveChangesAsync();

        return MapToDto(imageEntity);
    }

    public async Task<List<ImageDto>> GetCaseImages(Guid caseId)
    {
        var images = await context.Images
            .Where(img => img.CaseId == caseId)
            .ToListAsync();

        return images.Select(MapToDto).ToList();
    }

    public async Task<List<ImageDto>> GetProjectImages(Guid projectId)
    {
        var images = await context.Images
            .Where(img => img.ProjectId == projectId && img.CaseId == null)
            .ToListAsync();

        return images.Select(MapToDto).ToList();
    }

    public async Task DeleteImage(Guid imageId)
    {
        var image = await context.Images.FindAsync(imageId);
        if (image == null)
        {
            throw new NotFoundInDBException("Image not found.");
        }

        var containerClient = blobServiceClient.GetBlobContainerClient(ContainerName);

        var sanitizedProjectName = SanitizeBlobName(image.ProjectName);
        var blobName = image.CaseId.HasValue
            ? $"{sanitizedProjectName}/cases/{image.CaseId}/{image.Id}"
            : $"{sanitizedProjectName}/projects/{image.ProjectId}/{image.Id}";

        var blobClient = containerClient.GetBlobClient(blobName);

        await blobClient.DeleteIfExistsAsync();

        context.Images.Remove(image);
        await context.SaveChangesAsync();
    }

    private static ImageDto MapToDto(Image imageEntity)
    {
        return new ImageDto
        {
            Id = imageEntity.Id,
            Url = imageEntity.Url,
            CreateTime = imageEntity.CreateTime,
            Description = imageEntity.Description,
            CaseId = imageEntity.CaseId,
            ProjectName = imageEntity.ProjectName,
            ProjectId = imageEntity.ProjectId
        };
    }
}
