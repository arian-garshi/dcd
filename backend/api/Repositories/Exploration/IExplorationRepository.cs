using System.Linq.Expressions;

using api.Enums;
using api.Models;

namespace api.Repositories;

public interface IExplorationRepository : IBaseRepository
{
    Task<Exploration?> GetExploration(Guid explorationId);
    Task<Exploration?> GetExplorationWithIncludes(Guid caseId, params Expression<Func<Exploration, object>>[] includes);
    Task<Well?> GetWell(Guid wellId);
    Task<bool> ExplorationHasProfile(Guid explorationId, ExplorationProfileNames profileType);
    Exploration UpdateExploration(Exploration exploration);
    Task<DrillingSchedule?> GetExplorationWellDrillingSchedule(Guid drillingScheduleId);
    Task<Exploration?> GetExplorationWithDrillingSchedule(Guid drillingScheduleId);
    DrillingSchedule UpdateExplorationWellDrillingSchedule(DrillingSchedule drillingSchedule);
    ExplorationWell CreateExplorationWellDrillingSchedule(ExplorationWell explorationWellWithDrillingSchedule);
}
