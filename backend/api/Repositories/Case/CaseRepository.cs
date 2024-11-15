using System.Linq.Expressions;

using api.Context;
using api.Enums;
using api.Models;

using Microsoft.EntityFrameworkCore;

namespace api.Repositories;

public class CaseRepository(DcdDbContext context) : BaseRepository(context), ICaseRepository
{
    public async Task<Case> AddCase(Case caseItem)
    {
        Context.Cases.Add(caseItem);
        await Context.SaveChangesAsync();

        return caseItem;
    }

    public async Task<Case?> GetCase(Guid caseId)
    {
        return await Get<Case>(caseId);
    }

    public async Task<Case?> GetCaseWithIncludes(Guid caseId, params Expression<Func<Case, object>>[] includes)
    {
        return await GetWithIncludes(caseId, includes);
    }

    public async Task<bool> CaseHasProfile(Guid caseId, CaseProfileNames profileType)
    {
        Expression<Func<Case, bool>> profileExistsExpression = profileType switch
        {
            CaseProfileNames.CessationWellsCostOverride => d => d.CessationWellsCostOverride != null,
            CaseProfileNames.CessationOffshoreFacilitiesCostOverride => d => d.CessationOffshoreFacilitiesCostOverride != null,
            CaseProfileNames.CessationOnshoreFacilitiesCostProfile => d => d.CessationOnshoreFacilitiesCostProfile != null,
            CaseProfileNames.TotalFeasibilityAndConceptStudiesOverride => d => d.TotalFeasibilityAndConceptStudiesOverride != null,
            CaseProfileNames.TotalFEEDStudiesOverride => d => d.TotalFEEDStudiesOverride != null,
            CaseProfileNames.TotalOtherStudiesCostProfile => d => d.TotalOtherStudiesCostProfile != null,
            CaseProfileNames.HistoricCostCostProfile => d => d.HistoricCostCostProfile != null,
            CaseProfileNames.WellInterventionCostProfileOverride => d => d.WellInterventionCostProfileOverride != null,
            CaseProfileNames.OffshoreFacilitiesOperationsCostProfileOverride => d => d.OffshoreFacilitiesOperationsCostProfileOverride != null,
            CaseProfileNames.OnshoreRelatedOPEXCostProfile => d => d.OnshoreRelatedOPEXCostProfile != null,
            CaseProfileNames.AdditionalOPEXCostProfile => d => d.AdditionalOPEXCostProfile != null,
            CaseProfileNames.CalculatedTotalIncomeCostProfile => d => d.CalculatedTotalIncomeCostProfile != null,
            CaseProfileNames.CalculatedTotalCostCostProfile => d => d.CalculatedTotalCostCostProfile != null,
        };

        bool hasProfile = await Context.Cases
            .Where(d => d.Id == caseId)
            .AnyAsync(profileExistsExpression);

        return hasProfile;
    }

    public Case UpdateCase(Case updatedCase)
    {
        return Update(updatedCase);
    }

    public async Task UpdateModifyTime(Guid caseId)
    {
        if (caseId == Guid.Empty)
        {
            throw new ArgumentException("The case id cannot be empty.", nameof(caseId));
        }

        var caseItem = await Context.Cases.SingleOrDefaultAsync(c => c.Id == caseId)
            ?? throw new KeyNotFoundException($"Case with id {caseId} not found.");

        caseItem.ModifyTime = DateTimeOffset.UtcNow;
    }

}
