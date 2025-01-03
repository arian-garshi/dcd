using System.ComponentModel.DataAnnotations;

namespace api.Features.Assets.ProjectAssets.ExplorationOperationalWellCosts.Dtos;

public class ExplorationOperationalWellCostsDto
{
    [Required] public Guid Id { get; set; }
    [Required] public Guid ProjectId { get; set; }
    [Required] public double ExplorationRigUpgrading { get; set; }
    [Required] public double ExplorationRigMobDemob { get; set; }
    [Required] public double ExplorationProjectDrillingCosts { get; set; }
    [Required] public double AppraisalRigMobDemob { get; set; }
    [Required] public double AppraisalProjectDrillingCosts { get; set; }
}
