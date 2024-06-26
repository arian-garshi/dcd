
using System.ComponentModel.DataAnnotations;

namespace api.Dtos;

public class ExplorationWellDto
{
    [Required]
    public DrillingScheduleDto DrillingSchedule { get; set; } = new DrillingScheduleDto();
    [Required]
    public Guid ExplorationId { get; set; } = Guid.Empty!;
    [Required]
    public Guid WellId { get; set; } = Guid.Empty!;
}
