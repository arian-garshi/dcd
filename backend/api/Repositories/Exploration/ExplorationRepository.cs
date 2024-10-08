using System.Linq.Expressions;

using api.Context;
using api.Enums;
using api.Models;

using Microsoft.EntityFrameworkCore;


namespace api.Repositories;

public class ExplorationRepository : BaseRepository, IExplorationRepository
{

    public ExplorationRepository(DcdDbContext context) : base(context)
    {
    }

    public async Task<Exploration?> GetExploration(Guid explorationId)
    {
        return await Get<Exploration>(explorationId);
    }

    public async Task<Exploration?> GetExplorationWithIncludes(Guid explorationId, params Expression<Func<Exploration, object>>[] includes)
    {
        return await GetWithIncludes(explorationId, includes);
    }

    public async Task<Well?> GetWell(Guid wellId)
    {
        return await Get<Well>(wellId);
    }

    public async Task<bool> ExplorationHasProfile(Guid ExplorationId, ExplorationProfileNames profileType)
    {
        Expression<Func<Exploration, bool>> profileExistsExpression = profileType switch
        {
            ExplorationProfileNames.GAndGAdminCostOverride => d => d.GAndGAdminCostOverride != null,
            ExplorationProfileNames.SeismicAcquisitionAndProcessing => d => d.SeismicAcquisitionAndProcessing != null,
            ExplorationProfileNames.CountryOfficeCost => d => d.CountryOfficeCost != null,
        };

        bool hasProfile = await _context.Explorations
            .Where(d => d.Id == ExplorationId)
            .AnyAsync(profileExistsExpression);

        return hasProfile;
    }

    public Exploration UpdateExploration(Exploration exploration)
    {
        return Update(exploration);
    }

    public async Task<ExplorationWell?> GetExplorationWell(Guid explorationId, Guid wellId)
    {
        return await _context.ExplorationWell.FindAsync(explorationId, wellId);
    }

    public async Task<DrillingSchedule?> GetExplorationWellDrillingSchedule(Guid drillingScheduleId)
    {
        return await Get<DrillingSchedule>(drillingScheduleId);
    }

    public async Task<Exploration?> GetExplorationWithDrillingSchedule(Guid drillingScheduleId)
    {
        var exploration = await _context.Explorations
            .Include(e => e.ExplorationWells)!
            .ThenInclude(w => w.DrillingSchedule)
            .FirstOrDefaultAsync(e => e.ExplorationWells != null && e.ExplorationWells.Any(w => w.DrillingScheduleId == drillingScheduleId));

        return exploration;
    }

    public DrillingSchedule UpdateExplorationWellDrillingSchedule(DrillingSchedule drillingSchedule)
    {
        return Update(drillingSchedule);
    }

    public ExplorationWell CreateExplorationWellDrillingSchedule(ExplorationWell explorationWellWithDrillingSchedule)
    {
        _context.ExplorationWell.Add(explorationWellWithDrillingSchedule);
        return explorationWellWithDrillingSchedule;
    }
}
