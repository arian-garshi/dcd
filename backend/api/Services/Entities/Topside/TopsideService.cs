using System.Linq.Expressions;

using api.Context;
using api.Dtos;
using api.Exceptions;
using api.Models;
using api.Repositories;

using AutoMapper;

using Microsoft.EntityFrameworkCore;

namespace api.Services;

public class TopsideService : ITopsideService
{
    private readonly DcdDbContext _context;
    private readonly IProjectService _projectService;
    private readonly IProjectAccessService _projectAccessService;
    private readonly ILogger<TopsideService> _logger;
    private readonly IMapper _mapper;
    private readonly ITopsideRepository _repository;
    private readonly ICaseRepository _caseRepository;
    private readonly IMapperService _mapperService;

    public TopsideService(
        DcdDbContext context,
        IProjectService projectService,
        ILoggerFactory loggerFactory,
        IMapper mapper,
        ITopsideRepository repository,
        ICaseRepository caseRepository,
        IMapperService mapperService,
        IProjectAccessService projectAccessService
        )
    {
        _context = context;
        _projectService = projectService;
        _logger = loggerFactory.CreateLogger<TopsideService>();
        _mapper = mapper;
        _repository = repository;
        _caseRepository = caseRepository;
        _mapperService = mapperService;
        _projectAccessService = projectAccessService;
    }

    public async Task<Topside> CreateTopside(Guid projectId, Guid sourceCaseId, CreateTopsideDto topsideDto)
    {
        var topside = _mapper.Map<Topside>(topsideDto);
        if (topside == null)
        {
            throw new ArgumentNullException(nameof(topside));
        }
        var project = await _projectService.GetProjectWithCasesAndAssets(projectId);
        topside.Project = project;
        topside.LastChangedDate = DateTimeOffset.UtcNow;
        var createdTopside = _context.Topsides!.Add(topside);
        SetCaseLink(topside, sourceCaseId, project);
        await _context.SaveChangesAsync();

        return createdTopside.Entity;
    }

    private static void SetCaseLink(Topside topside, Guid sourceCaseId, Project project)
    {
        var case_ = project.Cases!.FirstOrDefault(o => o.Id == sourceCaseId);
        if (case_ == null)
        {
            throw new NotFoundInDBException(string.Format("Case {0} not found in database.", sourceCaseId));
        }
        case_.TopsideLink = topside.Id;
    }

    public async Task<Topside> GetTopside(Guid topsideId)
    {
        var topside = await _context.Topsides!
            .Include(c => c.Project)
            .Include(c => c.CostProfile)
            .Include(c => c.CostProfileOverride)
            .Include(c => c.CessationCostProfile)
            .FirstOrDefaultAsync(o => o.Id == topsideId);
        if (topside == null)
        {
            throw new ArgumentException(string.Format("Topside {0} not found.", topsideId));
        }
        return topside;
    }

    public async Task<Topside> GetTopsideWithIncludes(Guid topsideId, params Expression<Func<Topside, object>>[] includes)
    {
        return await _repository.GetTopsideWithIncludes(topsideId, includes)
            ?? throw new NotFoundInDBException($"Topside with id {topsideId} not found.");
    }

    public async Task<TopsideDto> UpdateTopside<TDto>(
        Guid projectId,
        Guid caseId,
        Guid topsideId,
        TDto updatedTopsideDto
    )
        where TDto : BaseUpdateTopsideDto
    {
        // Need to verify that the project from the URL is the same as the project of the resource
        await _projectAccessService.ProjectExists<Topside>(projectId, topsideId);

        var existingTopside = await _repository.GetTopside(topsideId)
            ?? throw new NotFoundInDBException($"Topside with id {topsideId} not found.");

        _mapperService.MapToEntity(updatedTopsideDto, existingTopside, topsideId);
        existingTopside.LastChangedDate = DateTimeOffset.UtcNow;

        try
        {
            await _caseRepository.UpdateModifyTime(caseId);
            await _repository.SaveChangesAndRecalculateAsync(caseId);
        }
        catch (DbUpdateException ex)
        {
            _logger.LogError(ex, "Failed to update topside with id {topsideId} for case id {caseId}.", topsideId, caseId);
            throw;
        }

        var dto = _mapperService.MapToDto<Topside, TopsideDto>(existingTopside, topsideId);
        return dto;
    }
}
