declare namespace Components {
    namespace Schemas {
        export type ArtificialLift = 0 | 1 | 2 | 3; // int32
        export interface CaseDto {
            id?: string; // uuid
            projectId?: string; // uuid
            name?: string | null;
            description?: string | null;
            referenceCase?: boolean;
            dG4Date?: string; // date-time
            createTime?: string; // date-time
            modifyTime?: string; // date-time
            drainageStrategyLink?: string; // uuid
            wellProjectLink?: string; // uuid
            surfLink?: string; // uuid
            substructureLink?: string; // uuid
            topsideLink?: string; // uuid
            transportLink?: string; // uuid
            explorationLink?: string; // uuid
            capex?: number; // double
        }
        export interface Co2EmissionsDto {
            id?: string; // uuid
            startYear?: number; // int32
            internalData?: string | null;
            values?: number /* double */[] | null;
        }
        export type Currency = 0 | 1; // int32
        export interface DrainageStrategyDto {
            id?: string; // uuid
            projectId?: string; // uuid
            name?: string | null;
            description?: string | null;
            nglYield?: number; // double
            producerCount?: number; // int32
            gasInjectorCount?: number; // int32
            waterInjectorCount?: number; // int32
            artificialLift?: ArtificialLift /* int32 */;
            productionProfileOil?: ProductionProfileOilDto;
            productionProfileGas?: ProductionProfileGasDto;
            productionProfileWater?: ProductionProfileWaterDto;
            productionProfileWaterInjection?: ProductionProfileWaterInjectionDto;
            fuelFlaringAndLosses?: FuelFlaringAndLossesDto;
            netSalesGas?: NetSalesGasDto;
            co2Emissions?: Co2EmissionsDto;
        }
        export interface DrillingScheduleDto {
            id?: string; // uuid
            startYear?: number; // int32
            internalData?: string | null;
            values?: number /* int32 */[] | null;
        }
        export interface ExplorationCostProfileDto {
            id?: string; // uuid
            startYear?: number; // int32
            internalData?: string | null;
            values?: number /* double */[] | null;
            epaVersion?: string | null;
            currency?: Currency /* int32 */;
        }
        export interface ExplorationDrillingScheduleDto {
            id?: string; // uuid
            startYear?: number; // int32
            internalData?: string | null;
            values?: number /* int32 */[] | null;
        }
        export interface ExplorationDto {
            id?: string; // uuid
            projectId?: string; // uuid
            name?: string | null;
            wellType?: WellType /* int32 */;
            costProfile?: ExplorationCostProfileDto;
            drillingSchedule?: ExplorationDrillingScheduleDto;
            gAndGAdminCost?: GAndGAdminCostDto;
            rigMobDemob?: number; // double
        }
        export interface FuelFlaringAndLossesDto {
            id?: string; // uuid
            startYear?: number; // int32
            internalData?: string | null;
            values?: number /* double */[] | null;
        }
        export interface GAndGAdminCostDto {
            id?: string; // uuid
            startYear?: number; // int32
            internalData?: string | null;
            values?: number /* double */[] | null;
            epaVersion?: string | null;
            currency?: Currency /* int32 */;
        }
        export type Maturity = 0 | 1 | 2 | 3; // int32
        export interface NetSalesGasDto {
            id?: string; // uuid
            startYear?: number; // int32
            internalData?: string | null;
            values?: number /* double */[] | null;
        }
        export type ProductionFlowline = 999; // int32
        export interface ProductionProfileGasDto {
            id?: string; // uuid
            startYear?: number; // int32
            internalData?: string | null;
            values?: number /* double */[] | null;
        }
        export interface ProductionProfileOilDto {
            id?: string; // uuid
            startYear?: number; // int32
            internalData?: string | null;
            values?: number /* double */[] | null;
        }
        export interface ProductionProfileWaterDto {
            id?: string; // uuid
            startYear?: number; // int32
            internalData?: string | null;
            values?: number /* double */[] | null;
        }
        export interface ProductionProfileWaterInjectionDto {
            id?: string; // uuid
            startYear?: number; // int32
            internalData?: string | null;
            values?: number /* double */[] | null;
        }
        export type ProjectCategory = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13; // int32
        export interface ProjectDto {
            projectId?: string; // uuid
            name?: string | null;
            description?: string | null;
            country?: string | null;
            projectPhase?: ProjectPhase /* int32 */;
            projectCategory?: ProjectCategory /* int32 */;
            cases?: CaseDto[] | null;
            explorations?: ExplorationDto[] | null;
            surfs?: SurfDto[] | null;
            substructures?: SubstructureDto[] | null;
            topsides?: TopsideDto[] | null;
            transports?: TransportDto[] | null;
            drainageStrategies?: DrainageStrategyDto[] | null;
            wellProjects?: WellProjectDto[] | null;
        }
        export type ProjectPhase = 0 | 1 | 2 | 3; // int32
        export interface SubstructureCostProfileDto {
            id?: string; // uuid
            startYear?: number; // int32
            internalData?: string | null;
            values?: number /* double */[] | null;
            epaVersion?: string | null;
            currency?: Currency /* int32 */;
        }
        export interface SubstructureDto {
            id?: string; // uuid
            name?: string | null;
            projectId?: string; // uuid
            costProfile?: SubstructureCostProfileDto;
            dryWeight?: number; // double
            maturity?: Maturity /* int32 */;
        }
        export interface SurfCostProfileDto {
            id?: string; // uuid
            startYear?: number; // int32
            internalData?: string | null;
            values?: number /* double */[] | null;
            epaVersion?: string | null;
            currency?: Currency /* int32 */;
        }
        export interface SurfDto {
            id?: string; // uuid
            name?: string | null;
            projectId?: string; // uuid
            costProfile?: SurfCostProfileDto;
            maturity?: Maturity /* int32 */;
            infieldPipelineSystemLength?: number; // double
            umbilicalSystemLength?: number; // double
            artificialLift?: ArtificialLift /* int32 */;
            riserCount?: number; // int32
            templateCount?: number; // int32
            productionFlowline?: ProductionFlowline /* int32 */;
        }
        export interface TopsideCostProfileDto {
            id?: string; // uuid
            startYear?: number; // int32
            internalData?: string | null;
            values?: number /* double */[] | null;
            epaVersion?: string | null;
            currency?: Currency /* int32 */;
        }
        export interface TopsideDto {
            id?: string; // uuid
            name?: string | null;
            projectId?: string; // uuid
            costProfile?: TopsideCostProfileDto;
            dryWeight?: number; // double
            oilCapacity?: number; // double
            gasCapacity?: number; // double
            facilitiesAvailability?: number; // double
            artificialLift?: ArtificialLift /* int32 */;
            maturity?: Maturity /* int32 */;
        }
        export interface TransportCostProfileDto {
            id?: string; // uuid
            startYear?: number; // int32
            internalData?: string | null;
            values?: number /* double */[] | null;
            epaVersion?: string | null;
            currency?: Currency /* int32 */;
        }
        export interface TransportDto {
            id?: string; // uuid
            name?: string | null;
            projectId?: string; // uuid
            costProfile?: TransportCostProfileDto;
            maturity?: Maturity /* int32 */;
            gasExportPipelineLength?: number; // double
            oilExportPipelineLength?: number; // double
        }
        export interface WellProjectCostProfileDto {
            id?: string; // uuid
            startYear?: number; // int32
            internalData?: string | null;
            values?: number /* double */[] | null;
            epaVersion?: string | null;
            currency?: Currency /* int32 */;
        }
        export interface WellProjectDto {
            id?: string; // uuid
            projectId?: string; // uuid
            name?: string | null;
            costProfile?: WellProjectCostProfileDto;
            drillingSchedule?: DrillingScheduleDto;
            producerCount?: number; // int32
            gasInjectorCount?: number; // int32
            waterInjectorCount?: number; // int32
            artificialLift?: ArtificialLift /* int32 */;
            rigMobDemob?: number; // double
            annualWellInterventionCost?: number; // double
            pluggingAndAbandonment?: number; // double
        }
        export type WellType = 0 | 1; // int32
    }
}
declare namespace Paths {
    namespace CreateCase {
        export type RequestBody = Components.Schemas.CaseDto;
        namespace Responses {
            export type $200 = Components.Schemas.ProjectDto;
        }
    }
    namespace CreateDrainageStrategy {
        namespace Parameters {
            export type SourceCaseId = string; // uuid
        }
        export interface QueryParameters {
            sourceCaseId?: Parameters.SourceCaseId /* uuid */;
        }
        export type RequestBody = Components.Schemas.DrainageStrategyDto;
        namespace Responses {
            export type $200 = Components.Schemas.ProjectDto;
        }
    }
    namespace CreateExploration {
        namespace Parameters {
            export type SourceCaseId = string; // uuid
        }
        export interface QueryParameters {
            sourceCaseId?: Parameters.SourceCaseId /* uuid */;
        }
        export type RequestBody = Components.Schemas.ExplorationDto;
        namespace Responses {
            export type $200 = Components.Schemas.ProjectDto;
        }
    }
    namespace CreateProject {
        export type RequestBody = Components.Schemas.ProjectDto;
        namespace Responses {
            export type $200 = Components.Schemas.ProjectDto;
        }
    }
    namespace CreateSubstructure {
        namespace Parameters {
            export type SourceCaseId = string; // uuid
        }
        export interface QueryParameters {
            sourceCaseId?: Parameters.SourceCaseId /* uuid */;
        }
        export type RequestBody = Components.Schemas.SubstructureDto;
        namespace Responses {
            export type $200 = Components.Schemas.ProjectDto;
        }
    }
    namespace CreateSurf {
        namespace Parameters {
            export type SourceCaseId = string; // uuid
        }
        export interface QueryParameters {
            sourceCaseId?: Parameters.SourceCaseId /* uuid */;
        }
        export type RequestBody = Components.Schemas.SurfDto;
        namespace Responses {
            export type $200 = Components.Schemas.ProjectDto;
        }
    }
    namespace CreateTopside {
        namespace Parameters {
            export type SourceCaseId = string; // uuid
        }
        export interface QueryParameters {
            sourceCaseId?: Parameters.SourceCaseId /* uuid */;
        }
        export type RequestBody = Components.Schemas.TopsideDto;
        namespace Responses {
            export type $200 = Components.Schemas.ProjectDto;
        }
    }
    namespace CreateTransport {
        namespace Parameters {
            export type SourceCaseId = string; // uuid
        }
        export interface QueryParameters {
            sourceCaseId?: Parameters.SourceCaseId /* uuid */;
        }
        export type RequestBody = Components.Schemas.TransportDto;
        namespace Responses {
            export type $200 = Components.Schemas.ProjectDto;
        }
    }
    namespace CreateWellProject {
        namespace Parameters {
            export type SourceCaseId = string; // uuid
        }
        export interface QueryParameters {
            sourceCaseId?: Parameters.SourceCaseId /* uuid */;
        }
        export type RequestBody = Components.Schemas.WellProjectDto;
        namespace Responses {
            export type $200 = Components.Schemas.ProjectDto;
        }
    }
    namespace DeleteDrainageStrategy {
        namespace Parameters {
            export type DrainageStrategyId = string; // uuid
        }
        export interface PathParameters {
            drainageStrategyId: Parameters.DrainageStrategyId /* uuid */;
        }
        namespace Responses {
            export type $200 = Components.Schemas.ProjectDto;
        }
    }
    namespace DeleteExploration {
        namespace Parameters {
            export type ExplorationId = string; // uuid
        }
        export interface PathParameters {
            explorationId: Parameters.ExplorationId /* uuid */;
        }
        namespace Responses {
            export type $200 = Components.Schemas.ProjectDto;
        }
    }
    namespace DeleteSubstructure {
        namespace Parameters {
            export type SubstructureId = string; // uuid
        }
        export interface PathParameters {
            substructureId: Parameters.SubstructureId /* uuid */;
        }
        namespace Responses {
            export type $200 = Components.Schemas.ProjectDto;
        }
    }
    namespace DeleteSurf {
        namespace Parameters {
            export type SurfId = string; // uuid
        }
        export interface PathParameters {
            surfId: Parameters.SurfId /* uuid */;
        }
        namespace Responses {
            export type $200 = Components.Schemas.ProjectDto;
        }
    }
    namespace DeleteTopside {
        namespace Parameters {
            export type TopsideId = string; // uuid
        }
        export interface PathParameters {
            topsideId: Parameters.TopsideId /* uuid */;
        }
        namespace Responses {
            export type $200 = Components.Schemas.ProjectDto;
        }
    }
    namespace DeleteTransport {
        namespace Parameters {
            export type TransportId = string; // uuid
        }
        export interface PathParameters {
            transportId: Parameters.TransportId /* uuid */;
        }
        namespace Responses {
            export type $200 = Components.Schemas.ProjectDto;
        }
    }
    namespace DeleteWellProject {
        namespace Parameters {
            export type WellProjectId = string; // uuid
        }
        export interface PathParameters {
            wellProjectId: Parameters.WellProjectId /* uuid */;
        }
        namespace Responses {
            export type $200 = Components.Schemas.ProjectDto;
        }
    }
    namespace GetProject {
        namespace Parameters {
            export type ProjectId = string; // uuid
        }
        export interface PathParameters {
            projectId: Parameters.ProjectId /* uuid */;
        }
        namespace Responses {
            export type $200 = Components.Schemas.ProjectDto;
        }
    }
    namespace GetProjects {
        namespace Responses {
            export type $200 = Components.Schemas.ProjectDto[];
        }
    }
    namespace GetProjectsFromCommonLibrary {
        namespace Responses {
            export type $200 = Components.Schemas.ProjectDto[];
        }
    }
    namespace UpdateDrainageStrategy {
        namespace Parameters {
            export type DrainageStrategyId = string; // uuid
        }
        export interface PathParameters {
            drainageStrategyId: Parameters.DrainageStrategyId /* uuid */;
        }
        export type RequestBody = Components.Schemas.DrainageStrategyDto;
        namespace Responses {
            export type $200 = Components.Schemas.ProjectDto;
        }
    }
    namespace UpdateExploration {
        namespace Parameters {
            export type ExplorationId = string; // uuid
        }
        export interface PathParameters {
            explorationId: Parameters.ExplorationId /* uuid */;
        }
        export type RequestBody = Components.Schemas.ExplorationDto;
        namespace Responses {
            export type $200 = Components.Schemas.ProjectDto;
        }
    }
    namespace UpdateSubstructure {
        namespace Parameters {
            export type SubstructureId = string; // uuid
        }
        export interface PathParameters {
            substructureId: Parameters.SubstructureId /* uuid */;
        }
        export type RequestBody = Components.Schemas.SubstructureDto;
        namespace Responses {
            export type $200 = Components.Schemas.ProjectDto;
        }
    }
    namespace UpdateSurf {
        namespace Parameters {
            export type SurfId = string; // uuid
        }
        export interface PathParameters {
            surfId: Parameters.SurfId /* uuid */;
        }
        export type RequestBody = Components.Schemas.SurfDto;
        namespace Responses {
            export type $200 = Components.Schemas.ProjectDto;
        }
    }
    namespace UpdateTopside {
        namespace Parameters {
            export type TopsideId = string; // uuid
        }
        export interface PathParameters {
            topsideId: Parameters.TopsideId /* uuid */;
        }
        export type RequestBody = Components.Schemas.TopsideDto;
        namespace Responses {
            export type $200 = Components.Schemas.ProjectDto;
        }
    }
    namespace UpdateTransport {
        namespace Parameters {
            export type TransportId = string; // uuid
        }
        export interface PathParameters {
            transportId: Parameters.TransportId /* uuid */;
        }
        export type RequestBody = Components.Schemas.TransportDto;
        namespace Responses {
            export type $200 = Components.Schemas.ProjectDto;
        }
    }
    namespace UpdateWellProject {
        namespace Parameters {
            export type WellProjectId = string; // uuid
        }
        export interface PathParameters {
            wellProjectId: Parameters.WellProjectId /* uuid */;
        }
        export type RequestBody = Components.Schemas.WellProjectDto;
        namespace Responses {
            export type $200 = Components.Schemas.ProjectDto;
        }
    }
}