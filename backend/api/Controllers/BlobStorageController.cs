using api.Dtos;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Authorize]
[ApiController]
[Route("projects/{projectId}/cases/{caseId}/images")]
public class BlobStorageController : ControllerBase
{
    private readonly IBlobStorageService _blobStorageService;

    public BlobStorageController(IBlobStorageService blobStorageService)
    {
        _blobStorageService = blobStorageService;
    }

    [HttpPost]
    public async Task<ActionResult<ImageDto>> UploadImage(Guid projectId, [FromForm] string projectName, Guid caseId, [FromForm] IFormFile image)
    {
        const int maxFileSize = 5 * 1024 * 1024; // 5MB
        string[] permittedExtensions = { ".jpg", ".jpeg", ".png", ".gif" };

        if (image == null || image.Length == 0)
        {
            return BadRequest("No image provided or the file is empty.");
        }

        if (image.Length > maxFileSize)
        {
            return BadRequest($"File {image.FileName} exceeds the maximum allowed size of 5MB.");
        }

        var ext = Path.GetExtension(image.FileName).ToLowerInvariant();
        if (string.IsNullOrEmpty(ext) || !permittedExtensions.Contains(ext))
        {
            return BadRequest($"File {image.FileName} has an invalid extension. Only image files are allowed.");
        }

        var imageDto = await _blobStorageService.SaveImage(projectId, projectName, image, caseId);
        return Ok(imageDto);
    }

    [HttpGet]
    public async Task<ActionResult<List<ImageDto>>> GetImages(Guid projectId, Guid caseId)
    {
        try
        {
            var imageDtos = await _blobStorageService.GetCaseImages(caseId);
            return Ok(imageDtos);
        }
        catch (Exception)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while retrieving images.");
        }
    }

    [HttpDelete("{imageId}")]
    public async Task<ActionResult> DeleteImage(Guid projectId, Guid caseId, Guid imageId)
    {
        try
        {
            await _blobStorageService.DeleteImage(caseId, imageId);
            return NoContent();
        }
        catch (Exception)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while deleting the image.");
        }
    }
}

[Authorize]
[ApiController]
[Route("projects/{projectId}/images")]
public class ProjectImageController : ControllerBase
{
    private readonly IBlobStorageService _blobStorageService;

    public ProjectImageController(IBlobStorageService blobStorageService)
    {
        _blobStorageService = blobStorageService;
    }

    [HttpPost]
    public async Task<ActionResult<ImageDto>> UploadProjectImage(Guid projectId, [FromForm] string projectName, [FromForm] IFormFile image)
    {
        const int maxFileSize = 5 * 1024 * 1024; // 5MB
        string[] permittedExtensions = { ".jpg", ".jpeg", ".png", ".gif" };

        if (image == null || image.Length == 0)
        {
            return BadRequest("No image provided or the file is empty.");
        }

        if (image.Length > maxFileSize)
        {
            return BadRequest($"File {image.FileName} exceeds the maximum allowed size of 5MB.");
        }

        var ext = Path.GetExtension(image.FileName).ToLowerInvariant();
        if (string.IsNullOrEmpty(ext) || !permittedExtensions.Contains(ext))
        {
            return BadRequest($"File {image.FileName} has an invalid extension. Only image files are allowed.");
        }

        var imageDto = await _blobStorageService.SaveImage(projectId, projectName, image);
        return Ok(imageDto);
    }

    [HttpGet]
    public async Task<ActionResult<List<ImageDto>>> GetProjectImages(Guid projectId)
    {
        try
        {
            var imageDtos = await _blobStorageService.GetProjectImages(projectId);
            return Ok(imageDtos);
        }
        catch (Exception)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while retrieving images.");
        }
    }
}
