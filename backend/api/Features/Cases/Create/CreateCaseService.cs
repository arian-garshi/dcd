using api.Context;
using api.Exceptions;
using api.Models;

using Microsoft.EntityFrameworkCore;

namespace api.Features.Cases.Create;

public class CreateCaseService(DcdDbContext context)
{
    public async Task CreateCase(Guid projectId, CreateCaseDto createCaseDto)
    {
        var project = await context.Projects
                          .FirstOrDefaultAsync(p => (p.Id == projectId || p.FusionProjectId == projectId) && !p.IsRevision)
                      ?? throw new NotFoundInDBException($"Project {projectId} does not exist");

        context.Cases.Add(new Case
        {
            ProjectId = projectId,
            Name = createCaseDto.Name,
            Description = createCaseDto.Description,
            ProductionStrategyOverview = createCaseDto.ProductionStrategyOverview,
            ProducerCount = createCaseDto.ProducerCount,
            GasInjectorCount = createCaseDto.GasInjectorCount,
            WaterInjectorCount = createCaseDto.WaterInjectorCount,
            DG4Date = createCaseDto.DG4Date == DateTimeOffset.MinValue ? new DateTime(2030, 1, 1) : createCaseDto.DG4Date,
            CapexFactorFeasibilityStudies = 0.015,
            CapexFactorFEEDStudies = 0.015,
            CreateTime = DateTimeOffset.UtcNow,
            DrainageStrategy = CreateDrainageStrategy(project),
            Topside = CreateTopside(project),
            Surf = CreateSurf(project),
            Substructure = CreateSubstructure(project),
            Transport = CreateTransport(project),
            Exploration = CreateExploration(project),
            WellProject = CreateWellProject(project)
        });

        await context.SaveChangesAsync();
    }

    private static DrainageStrategy CreateDrainageStrategy(Project project)
    {
        return new DrainageStrategy
        {
            Name = "Drainage Strategy",
            Description = "Drainage Strategy",
            Project = project
        };
    }

    private static Topside CreateTopside(Project project)
    {
        return new Topside
        {
            Name = "Topside",
            Project = project,
            CostProfileOverride = new TopsideCostProfileOverride
            {
                Override = true
            }
        };
    }

    private static Surf CreateSurf(Project project)
    {
        return new Surf
        {
            Name = "Surf",
            Project = project,
            CostProfileOverride = new SurfCostProfileOverride
            {
                Override = true
            }
        };
    }

    private static Substructure CreateSubstructure(Project project)
    {
        return new Substructure
        {
            Name = "Substructure",
            Project = project,
            CostProfileOverride = new SubstructureCostProfileOverride
            {
                Override = true
            }
        };
    }

    private static Transport CreateTransport(Project project)
    {
        return new Transport
        {
            Name = "Transport",
            Project = project,
            CostProfileOverride = new TransportCostProfileOverride
            {
                Override = true
            }
        };
    }

    private static Exploration CreateExploration(Project project)
    {
        return new Exploration
        {
            Name = "Exploration",
            Project = project
        };
    }

    private static WellProject CreateWellProject(Project project)
    {
        return new WellProject
        {
            Name = "Well Project",
            Project = project
        };
    }
}