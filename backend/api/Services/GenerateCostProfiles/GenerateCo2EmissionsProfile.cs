using api.Adapters;
using api.Dtos;
using api.Helpers;
using api.Models;

namespace api.Services.GenerateCostProfiles;

public class GenerateCo2EmissionsProfile
{
    private readonly CaseService _caseService;
    private readonly DrainageStrategyService _drainageStrategyService;
    private readonly ProjectService _projectService;
    private readonly TopsideService _topsideService;
    private readonly WellProjectService _wellProjectService;

    public GenerateCo2EmissionsProfile(IServiceProvider serviceProvider)
    {
        _caseService = serviceProvider.GetRequiredService<CaseService>();
        _projectService = serviceProvider.GetRequiredService<ProjectService>();
        _topsideService = serviceProvider.GetRequiredService<TopsideService>();
        _drainageStrategyService = serviceProvider.GetRequiredService<DrainageStrategyService>();
        _wellProjectService = serviceProvider.GetRequiredService<WellProjectService>();
    }

    public Co2EmissionsDto Generate(Guid caseId)
    {
        var caseItem = _caseService.GetCase(caseId);
        var topside = _topsideService.GetTopside(caseItem.TopsideLink);
        var project = _projectService.GetProject(caseItem.ProjectId);
        var drainageStrategy = _drainageStrategyService.GetDrainageStrategy(caseItem.DrainageStrategyLink);
        var wellProject = _wellProjectService.GetWellProject(caseItem.WellProjectLink);
        var fuelConsumptionsProfile = GetFuelConsumptionsProfile(project, caseItem, topside, drainageStrategy);
        var flaringsProfile = GetFlaringsProfile(project, drainageStrategy);
        var lossesProfile = GetLossesProfile(project, drainageStrategy);
        var drillingEmissionsProfile = CalculateDrillingEmissions(project, drainageStrategy, wellProject);

        var totalProfile =
            TimeSeriesCost.MergeCostProfiles(TimeSeriesCost.MergeCostProfiles(
                TimeSeriesCost.MergeCostProfiles(fuelConsumptionsProfile, flaringsProfile),
                lossesProfile), drillingEmissionsProfile);
        var co2Emission = new Co2Emissions
        {
            StartYear = totalProfile.StartYear,
            Values = totalProfile.Values,
        };

        var dto = DrainageStrategyDtoAdapter.Convert(co2Emission, project.PhysicalUnit);
        return dto ?? new Co2EmissionsDto();
    }

    private static TimeSeriesVolume GetLossesProfile(Project project, DrainageStrategy drainageStrategy)
    {
        var losses = EmissionCalculationHelper.CalculateLosses(project, drainageStrategy);

        var lossesProfile = new TimeSeriesVolume
        {
            StartYear = losses.StartYear,
            Values = losses.Values.Select(loss => loss * project.CO2Vented).ToArray(),
        };
        return lossesProfile;
    }

    private static TimeSeriesVolume GetFlaringsProfile(Project project, DrainageStrategy drainageStrategy)
    {
        var flarings = EmissionCalculationHelper.CalculateFlaring(project, drainageStrategy);

        var flaringsProfile = new TimeSeriesVolume
        {
            StartYear = flarings.StartYear,
            Values = flarings.Values.Select(flare => flare * project.CO2EmissionsFromFlaredGas).ToArray(),
        };
        return flaringsProfile;
    }

    private static TimeSeriesVolume GetFuelConsumptionsProfile(Project project, Case caseItem, Topside topside,
        DrainageStrategy drainageStrategy)
    {
        var fuelConsumptions =
            EmissionCalculationHelper.CalculateTotalFuelConsumptions(caseItem, topside, drainageStrategy);

        var fuelConsumptionsProfile = new TimeSeriesVolume
        {
            StartYear = fuelConsumptions.StartYear,
            Values = fuelConsumptions.Values.Select(fuel => fuel * project.CO2EmissionFromFuelGas).ToArray(),
        };
        return fuelConsumptionsProfile;
    }

    private static TimeSeriesVolume CalculateDrillingEmissions(Project project, DrainageStrategy drainageStrategy,
        WellProject wellProject)
    {
        var linkedWells = wellProject.WellProjectWells?.Where(ew => Well.IsWellProjectWell(ew.Well.WellCategory))
            .ToList();
        if (linkedWells == null)
        {
            return new TimeSeriesVolume();
        }

        var wellDrillingSchedules = new TimeSeries<double>();
        foreach (var linkedWell in linkedWells)
        {
            if (linkedWell.DrillingSchedule == null)
            {
                continue;
            }

            var timeSeries = new TimeSeries<double>
            {
                StartYear = linkedWell.DrillingSchedule.StartYear,
                Values = linkedWell.DrillingSchedule.Values.Select(v => (double)v).ToArray(),
            };
            wellDrillingSchedules = TimeSeriesCost.MergeCostProfiles(wellDrillingSchedules, timeSeries);
        }

        if (drainageStrategy.ProductionProfileGas != null)
        {
            var drillingEmission = new ProductionProfileGas
            {
                StartYear = drainageStrategy.ProductionProfileGas.StartYear,
                Values = wellDrillingSchedules.Values
                    .Select(well => well * project.AverageDevelopmentDrillingDays * project.DailyEmissionFromDrillingRig / 1000000)
                    .ToArray(),
            };

            return drillingEmission;
        }

        return new TimeSeriesVolume();
    }
}