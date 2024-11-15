using api.Models;

namespace api.Repositories;

public interface IProjectRepository : IBaseRepository
{
    Task<Project?> GetProject(Guid projectId);
    Task<Project?> GetProjectByIdOrExternalId(Guid id);
    Task<Project?> GetProjectWithMembersByIdOrExternalId(Guid id);
    Task<Project?> GetProjectByExternalId(Guid id);
    Task<Project?> GetProjectWithCases(Guid projectId);
    Project UpdateProject(Project updatedProject);
    Task<ExplorationOperationalWellCosts?> GetExplorationOperationalWellCosts(Guid id);
    Task<DevelopmentOperationalWellCosts?> GetDevelopmentOperationalWellCosts(Guid id);
    Task UpdateModifyTime(Guid projectId);
}
