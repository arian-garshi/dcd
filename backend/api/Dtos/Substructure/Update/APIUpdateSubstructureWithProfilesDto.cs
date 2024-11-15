using api.Models;

namespace api.Dtos;

public class APIUpdateSubstructureWithProfilesDto : BaseUpdateSubstructureDto
{
    public UpdateSubstructureCostProfileOverrideDto? CostProfileOverride { get; set; }
    public Maturity Maturity { get; set; }
    public string ApprovedBy { get; set; } = string.Empty;
}


public class UpdateSubstructureCostProfileOverrideDto : UpdateTimeSeriesCostDto, ITimeSeriesOverrideDto
{
    public bool Override { get; set; }
}
