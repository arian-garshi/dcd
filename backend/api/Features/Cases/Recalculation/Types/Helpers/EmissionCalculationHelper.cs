using api.Models;

namespace api.Features.Cases.Recalculation.Types.Helpers;

public static class EmissionCalculationHelper
{
    private const int Cd = 365;
    private const int ConversionFactorFromMtoG = 1000;

    public static TimeSeries<double> CalculateTotalFuelConsumptions(
        Case caseItem,
        Topside topside,
        DrainageStrategy drainageStrategy
    )
    {
        var factor = caseItem.FacilitiesAvailability * topside.FuelConsumption * Cd * 1e6;

        var totalUseOfPower = CalculateTotalUseOfPower(topside, drainageStrategy, caseItem.FacilitiesAvailability);

        var fuelConsumptionValues = totalUseOfPower.Values.Select(v => v * factor).ToArray();
        var fuelConsumptions = new TimeSeries<double>
        {
            Values = fuelConsumptionValues,
            StartYear = totalUseOfPower.StartYear,
        };

        return fuelConsumptions;
    }

    public static TimeSeries<double> CalculateTotalUseOfPower(
        Topside topside,
        DrainageStrategy drainageStrategy,
        double pe
    )
    {
        var co2ShareCo2MaxOil = topside.CO2ShareOilProfile * topside.CO2OnMaxOilProfile;
        var co2ShareCo2MaxGas = topside.CO2ShareGasProfile * topside.CO2OnMaxGasProfile;
        var co2ShareCo2MaxWi = topside.CO2ShareWaterInjectionProfile * topside.CO2OnMaxWaterInjectionProfile;

        var co2ShareCo2Max = co2ShareCo2MaxOil + co2ShareCo2MaxGas + co2ShareCo2MaxWi;

        var totalPowerOil = CalculateTotalUseOfPowerOil(topside, drainageStrategy, pe);
        var totalPowerGas = CalculateTotalUseOfPowerGas(topside, drainageStrategy, pe);
        var totalPowerWi = CalculateTotalUseOfPowerWi(topside, drainageStrategy, pe);

        var mergedPowerProfile = TimeSeriesCost.MergeCostProfilesList(new List<TimeSeries<double>?> { totalPowerOil, totalPowerGas, totalPowerWi });

        var totalUseOfPowerValues = mergedPowerProfile.Values.Select(v => v + co2ShareCo2Max).ToArray();
        var totalUseOfPower = new TimeSeries<double>
        {
            StartYear = mergedPowerProfile.StartYear,
            Values = totalUseOfPowerValues,
        };

        return totalUseOfPower;
    }

    // Formula: 1. WRP = WR/WIC/cd
    //          2. WRP*WSP*(1-WOM)
    private static TimeSeries<double> CalculateTotalUseOfPowerWi(
        Topside topside,
        DrainageStrategy drainageStrategy,
        double pe
    )
    {
        var wic = topside.WaterInjectionCapacity;
        var wr = drainageStrategy.ProductionProfileWaterInjection?.Values;

        var wsp = topside.CO2ShareWaterInjectionProfile;
        var wom = topside.CO2OnMaxWaterInjectionProfile;

        if (wr == null || wr.Length == 0 || wic == 0 || pe == 0)
        {
            return new TimeSeries<double>();
        }

        var wrp = wr.Select(v => v / wic / Cd / pe);
        var wrpWspWom = wrp.Select(v => v * wsp * (1 - wom));

        var totalUseOfPower = new TimeSeries<double>
        {
            Values = wrpWspWom.ToArray(),
            StartYear = drainageStrategy.ProductionProfileGas?.StartYear ?? 0,
        };
        return totalUseOfPower;
    }

    // Formula: 1. GRP = GR/GC/cd/1000000
    //          2. GRP*GSP*(1-GOM)
    private static TimeSeries<double> CalculateTotalUseOfPowerGas(Topside topside, DrainageStrategy drainageStrategy, double pe)
    {
        var gc = topside.GasCapacity;
        var gr = drainageStrategy.ProductionProfileGas?.Values ?? [];
        var additionalGr = drainageStrategy.AdditionalProductionProfileGas?.Values ?? [];

        // Create TimeSeries<double> instances for both profiles
        var productionProfileGas = new TimeSeries<double>
        {
            StartYear = drainageStrategy.ProductionProfileGas?.StartYear ?? 0,
            Values = gr
        };

        var additionalProductionProfileGas = new TimeSeries<double>
        {
            StartYear = drainageStrategy.AdditionalProductionProfileGas?.StartYear ?? 0,
            Values = additionalGr
        };

        var mergedProfile = TimeSeriesCost.MergeCostProfiles(productionProfileGas, additionalProductionProfileGas);

        var gsp = topside.CO2ShareGasProfile;
        var gom = topside.CO2OnMaxGasProfile;

        if (mergedProfile.Values == null || mergedProfile.Values.Length == 0 || gc == 0 || pe == 0)
        {
            return new TimeSeries<double>();
        }

        // Convert merged values to appropriate units
        var grp = mergedProfile.Values.Select(v => v / gc / Cd / pe / 1e6);

        // Apply CO2 Share and CO2 On Max multipliers
        var grpGspGom = grp.Select(v => v * gsp * (1 - gom));

        // Create the final TimeSeries<double> result
        var totalUseOfPower = new TimeSeries<double>
        {
            Values = grpGspGom.ToArray(),
            StartYear = drainageStrategy.ProductionProfileGas?.StartYear ?? 0,
        };

        return totalUseOfPower;
    }

    // Formula: 1. WRP = WR/WIC/cd
    //          2. ORP*OSP*(1-OOM)
    private static TimeSeries<double> CalculateTotalUseOfPowerOil(Topside topside, DrainageStrategy drainageStrategy, double pe)
    {
        var oc = topside.OilCapacity;
        var or = drainageStrategy.ProductionProfileOil?.Values ?? [];
        var additionalOr = drainageStrategy.AdditionalProductionProfileOil?.Values ?? [];

        // Create TimeSeries<double> instances for both profiles
        var productionProfileOil = new TimeSeries<double>
        {
            StartYear = drainageStrategy.ProductionProfileOil?.StartYear ?? 0,
            Values = or
        };

        var additionalProductionProfileOil = new TimeSeries<double>
        {
            StartYear = drainageStrategy.AdditionalProductionProfileOil?.StartYear ?? 0,
            Values = additionalOr
        };

        var mergedProfile = TimeSeriesCost.MergeCostProfiles(productionProfileOil, additionalProductionProfileOil);

        var osp = topside.CO2ShareOilProfile;
        var oom = topside.CO2OnMaxOilProfile;

        if (mergedProfile.Values.Length == 0 || oc == 0 || pe == 0)
        {
            return new TimeSeries<double>();
        }

        var orp = mergedProfile.Values.Select(v => v / oc / Cd / pe);
        var orpOspOom = orp.Select(v => v * osp * (1 - oom));

        var totalUseOfPower = new TimeSeries<double>
        {
            Values = orpOspOom.ToArray(),
            StartYear = drainageStrategy.ProductionProfileOil?.StartYear ?? 0,
        };

        return totalUseOfPower;
    }

    public static TimeSeries<double> CalculateFlaring(Project project, DrainageStrategy drainageStrategy)
    {
        var oilRate = drainageStrategy.ProductionProfileOil?.Values.Select(v => v).ToArray() ?? [];
        var additionalOilRate = drainageStrategy.AdditionalProductionProfileOil?.Values.Select(v => v).ToArray() ?? [];

        var gasRate = drainageStrategy.ProductionProfileGas?.Values.Select(v => v / ConversionFactorFromMtoG).ToArray() ?? [];
        var additionalGasRate = drainageStrategy.AdditionalProductionProfileGas?.Values.Select(v => v / ConversionFactorFromMtoG).ToArray() ?? [];

        // Create TimeSeries<double> instances for both oil and gas profiles
        var oilRateTs = new TimeSeries<double>
        {
            Values = oilRate,
            StartYear = drainageStrategy.ProductionProfileOil?.StartYear ?? 0,
        };

        var additionalOilRateTs = new TimeSeries<double>
        {
            Values = additionalOilRate,
            StartYear = drainageStrategy.AdditionalProductionProfileOil?.StartYear ?? 0,
        };

        var gasRateTs = new TimeSeries<double>
        {
            Values = gasRate,
            StartYear = drainageStrategy.ProductionProfileGas?.StartYear ?? 0,
        };

        var additionalGasRateTs = new TimeSeries<double>
        {
            Values = additionalGasRate,
            StartYear = drainageStrategy.AdditionalProductionProfileGas?.StartYear ?? 0,
        };

        var mergedOilProfile = TimeSeriesCost.MergeCostProfiles(oilRateTs, additionalOilRateTs);
        var mergedGasProfile = TimeSeriesCost.MergeCostProfiles(gasRateTs, additionalGasRateTs);
        var mergedOilAndGas = TimeSeriesCost.MergeCostProfiles(mergedOilProfile, mergedGasProfile);

        var flaringValues = mergedOilAndGas.Values.Select(v => v * project.FlaredGasPerProducedVolume).ToArray();
        var flaring = new TimeSeries<double>
        {
            Values = flaringValues,
            StartYear = mergedOilAndGas.StartYear,
        };

        return flaring;
    }

    public static TimeSeries<double> CalculateLosses(Project project, DrainageStrategy drainageStrategy)
    {
        var lossesValues = drainageStrategy.ProductionProfileGas?.Values.Select(v => v * project.CO2RemovedFromGas).ToArray() ?? [];
        var additionalGasLossesValues = drainageStrategy.AdditionalProductionProfileGas?.Values.Select(v => v * project.CO2RemovedFromGas).ToArray() ?? [];

        // Create TimeSeries<double> instances for both gas losses profiles
        var gasLossesTs = new TimeSeries<double>
        {
            Values = lossesValues,
            StartYear = drainageStrategy.ProductionProfileGas?.StartYear ?? 0,
        };

        var additionalGasLossesTs = new TimeSeries<double>
        {
            Values = additionalGasLossesValues,
            StartYear = drainageStrategy.AdditionalProductionProfileGas?.StartYear ?? 0,
        };

        var mergedGasLosses = TimeSeriesCost.MergeCostProfiles(gasLossesTs, additionalGasLossesTs);

        var losses = new TimeSeries<double>
        {
            Values = mergedGasLosses.Values,
            StartYear = mergedGasLosses.StartYear,
        };
        return losses;
    }
}