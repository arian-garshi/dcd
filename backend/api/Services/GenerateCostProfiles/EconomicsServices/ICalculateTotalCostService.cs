using api.Dtos;

namespace api.Services.EconomicsServices;

public interface ICalculateTotalCostService
{
    Task CalculateTotalCost(Guid caseId);
}