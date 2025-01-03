using api.Features.CaseProfiles.Repositories;
using api.Models;

namespace api.Features.Assets.CaseAssets.DrainageStrategies.Repositories;

public interface IDrainageStrategyTimeSeriesRepository
{
    ProductionProfileOil CreateProductionProfileOil(ProductionProfileOil productionProfileOil);
    Task<ProductionProfileOil?> GetProductionProfileOil(Guid productionProfileOilId);
    ProductionProfileOil UpdateProductionProfileOil(ProductionProfileOil productionProfileOil);
    AdditionalProductionProfileOil CreateAdditionalProductionProfileOil(AdditionalProductionProfileOil additionalProductionProfileOil);
    Task<AdditionalProductionProfileOil?> GetAdditionalProductionProfileOil(Guid additionalProductionProfileOilId);
    AdditionalProductionProfileOil UpdateAdditionalProductionProfileOil(AdditionalProductionProfileOil additionalProductionProfileOil);
    ProductionProfileGas CreateProductionProfileGas(ProductionProfileGas profile);
    Task<ProductionProfileGas?> GetProductionProfileGas(Guid productionProfileId);
    ProductionProfileGas UpdateProductionProfileGas(ProductionProfileGas productionProfile);
    AdditionalProductionProfileGas CreateAdditionalProductionProfileGas(AdditionalProductionProfileGas profile);
    Task<AdditionalProductionProfileGas?> GetAdditionalProductionProfileGas(Guid productionProfileId);
    AdditionalProductionProfileGas UpdateAdditionalProductionProfileGas(AdditionalProductionProfileGas productionProfile);
    ProductionProfileWater CreateProductionProfileWater(ProductionProfileWater profile);
    Task<ProductionProfileWater?> GetProductionProfileWater(Guid productionProfileId);
    ProductionProfileWater UpdateProductionProfileWater(ProductionProfileWater productionProfile);
    ProductionProfileWaterInjection CreateProductionProfileWaterInjection(ProductionProfileWaterInjection profile);
    Task<ProductionProfileWaterInjection?> GetProductionProfileWaterInjection(Guid productionProfileId);
    ProductionProfileWaterInjection UpdateProductionProfileWaterInjection(ProductionProfileWaterInjection productionProfile);
    FuelFlaringAndLossesOverride CreateFuelFlaringAndLossesOverride(FuelFlaringAndLossesOverride profile);
    Task<FuelFlaringAndLossesOverride?> GetFuelFlaringAndLossesOverride(Guid profileId);
    FuelFlaringAndLossesOverride UpdateFuelFlaringAndLossesOverride(FuelFlaringAndLossesOverride profile);
    NetSalesGasOverride CreateNetSalesGasOverride(NetSalesGasOverride profile);
    Task<NetSalesGasOverride?> GetNetSalesGasOverride(Guid profileId);
    NetSalesGasOverride UpdateNetSalesGasOverride(NetSalesGasOverride profile);
    Co2EmissionsOverride CreateCo2EmissionsOverride(Co2EmissionsOverride profile);
    Task<Co2EmissionsOverride?> GetCo2EmissionsOverride(Guid profileId);
    Co2EmissionsOverride UpdateCo2EmissionsOverride(Co2EmissionsOverride profile);
    ImportedElectricityOverride CreateImportedElectricityOverride(ImportedElectricityOverride profile);
    Task<ImportedElectricityOverride?> GetImportedElectricityOverride(Guid profileId);
    ImportedElectricityOverride UpdateImportedElectricityOverride(ImportedElectricityOverride profile);
    DeferredOilProduction CreateDeferredOilProduction(DeferredOilProduction profile);
    Task<DeferredOilProduction?> GetDeferredOilProduction(Guid productionProfileId);
    DeferredOilProduction UpdateDeferredOilProduction(DeferredOilProduction productionProfile);
    DeferredGasProduction CreateDeferredGasProduction(DeferredGasProduction profile);
    Task<DeferredGasProduction?> GetDeferredGasProduction(Guid productionProfileId);
    DeferredGasProduction UpdateDeferredGasProduction(DeferredGasProduction productionProfile);
}
