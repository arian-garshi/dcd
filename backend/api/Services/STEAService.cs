using api.Adapters;
using api.Dtos;
using api.Models;

using AutoMapper;

namespace api.Services;

public class STEAService(
    ILogger<STEAService> logger,
    IProjectService projectService,
    IMapper mapper) : ISTEAService
{
    public async Task<STEAProjectDto> GetInputToSTEA(Guid projectId)
    {
        var project = await projectService.GetProjectWithCasesAndAssets(projectId);
        var sTEACaseDtos = new List<STEACaseDto>();
        var projectDto = mapper.Map<Project, ProjectWithAssetsDto>(project, opts => opts.Items["ConversionUnit"] = project.PhysicalUnit.ToString());
        foreach (Case c in project.Cases!)
        {
            if (c.Archived) { continue; }
            var caseDto = mapper.Map<CaseWithProfilesDto>(c);
            if (projectDto == null || caseDto == null)
            {
                logger.LogError("Failed to map project or case to dto");
                throw new Exception("Failed to map project or case to dto");
            }
            STEACaseDto sTEACaseDto = STEACaseDtoBuilder.Build(caseDto, projectDto);
            sTEACaseDtos.Add(sTEACaseDto);
        }

        if (projectDto == null)
        {
            logger.LogError("Failed to map project to dto");
            throw new Exception("Failed to map project to dto");
        }
        return STEAProjectDtoBuilder.Build(projectDto, sTEACaseDtos);
    }
}
