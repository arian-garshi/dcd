using api.Authorization;
using api.Dtos;
using api.Excel;
using api.Services;

using ClosedXML.Excel;

using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Web.Resource;

namespace api.Controllers;

[ApiController]
[Route("[controller]")]
[RequiredScope(RequiredScopesConfigurationKey = "AzureAd:Scopes")]
[RequiresApplicationRoles(
        ApplicationRole.Admin,
        ApplicationRole.ReadOnly,
        ApplicationRole.User

    )]
[ActionType(ActionType.Read)]
public class STEAController(ISTEAService sTeaService) : ControllerBase
{
    [HttpGet("{projectId}", Name = "GetInputToSTEA")]
    public async Task<STEAProjectDto> GetInputToSTEA(Guid projectId)
    {
        return await sTeaService.GetInputToSTEA(projectId);
    }

    [HttpPost("{projectId}", Name = "ExcelToSTEA")]
    public async Task<FileResult> ExcelToSTEA(Guid projectId)
    {
        var project = await GetInputToSTEA(projectId);
        List<BusinessCase> businessCases = ExportToStea.Export(project);
        string filename = project.Name + "ExportToSTEA.xlsx";
        return File(ExcelFile(businessCases, project.Name).ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", filename);
    }

    private static MemoryStream ExcelFile(List<BusinessCase> businessCases, string projectName)
    {
        var wb = new XLWorkbook();
        var ws = wb.Worksheets.Add("Input to STEA");
        ws.Cell("B2").Value = projectName;
        foreach (BusinessCase businessCase in businessCases)
        {
            foreach (ExcelTableCell etc in businessCase.Header)
            {
                ws.Cell(etc.CellNo).Value = etc.Value;
            }
            foreach (ExcelTableCell etc in businessCase.Exploration)
            {
                ws.Cell(etc.CellNo).Value = etc.Value;
            }
            foreach (ExcelTableCell etc in businessCase.Capex)
            {
                ws.Cell(etc.CellNo).Value = etc.Value;
            }
            foreach (ExcelTableCell etc in businessCase.Drilling)
            {
                ws.Cell(etc.CellNo).Value = etc.Value;
            }
            foreach (ExcelTableCell etc in businessCase.OffshoreFacilites)
            {
                ws.Cell(etc.CellNo).Value = etc.Value;
            }
            foreach (ExcelTableCell etc in businessCase.StudyCost)
            {
                ws.Cell(etc.CellNo).Value = etc.Value;
            }
            foreach (ExcelTableCell etc in businessCase.Opex)
            {
                ws.Cell(etc.CellNo).Value = etc.Value;
            }
            foreach (ExcelTableCell etc in businessCase.Cessation)
            {
                ws.Cell(etc.CellNo).Value = etc.Value;
            }
            ws.Cell(businessCase.ProductionAndSalesVolumes.CellNo).Value = businessCase.ProductionAndSalesVolumes.Value;
            foreach (ExcelTableCell etc in businessCase.TotalAndAnnualOil)
            {
                ws.Cell(etc.CellNo).Value = etc.Value;
            }
            foreach (ExcelTableCell etc in businessCase.AdditionalOil)
            {
                ws.Cell(etc.CellNo).Value = etc.Value;
            }
            foreach (ExcelTableCell etc in businessCase.AdditionalGas)
            {
                ws.Cell(etc.CellNo).Value = etc.Value;
            }
            foreach (ExcelTableCell etc in businessCase.NetSalesGas)
            {
                ws.Cell(etc.CellNo).Value = etc.Value;
            }
            foreach (ExcelTableCell etc in businessCase.Co2Emissions)
            {
                ws.Cell(etc.CellNo).Value = etc.Value;
            }
            foreach (ExcelTableCell etc in businessCase.ImportedElectricity)
            {
                ws.Cell(etc.CellNo).Value = etc.Value;
            }
        }
        using var stream = new MemoryStream();
        wb.SaveAs(stream);
        return stream;
    }
}
