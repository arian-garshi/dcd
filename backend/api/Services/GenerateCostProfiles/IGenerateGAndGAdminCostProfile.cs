namespace api.Services;

public interface IGenerateGAndGAdminCostProfile
{
    Task Generate(Guid caseId);
}
