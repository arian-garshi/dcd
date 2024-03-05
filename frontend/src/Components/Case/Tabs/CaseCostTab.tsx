import {
    ChangeEventHandler,
    Dispatch,
    SetStateAction,
    useEffect,
    useRef,
    useState,
} from "react"
import {
    Button,
    NativeSelect,
} from "@equinor/eds-core-react"
import CaseNumberInput from "../../Input/CaseNumberInput"
import CaseTabTable from "../Components/CaseTabTable"
import { SetTableYearsFromProfiles } from "../Components/CaseTabTableHelper"
import { ITimeSeries } from "../../../Models/ITimeSeries"
import { ITimeSeriesCostOverride } from "../../../Models/ITimeSeriesCostOverride"
import { ITimeSeriesCost } from "../../../Models/ITimeSeriesCost"
import InputSwitcher from "../../Input/InputSwitcher"
import { useProjectContext } from "../../../Context/ProjectContext"
import { useCaseContext } from "../../../Context/CaseContext"
import Grid from "@mui/material/Grid"

interface Props {
    topside: Components.Schemas.TopsideDto,
    setTopside: Dispatch<SetStateAction<Components.Schemas.TopsideDto | undefined>>,
    surf: Components.Schemas.SurfDto,
    setSurf: Dispatch<SetStateAction<Components.Schemas.SurfDto | undefined>>,
    substructure: Components.Schemas.SubstructureDto,
    setSubstructure: Dispatch<SetStateAction<Components.Schemas.SubstructureDto | undefined>>,
    transport: Components.Schemas.TransportDto,
    setTransport: Dispatch<SetStateAction<Components.Schemas.TransportDto | undefined>>,

    totalFeasibilityAndConceptStudies: Components.Schemas.TotalFeasibilityAndConceptStudiesDto | undefined,
    setTotalFeasibilityAndConceptStudies: Dispatch<SetStateAction<Components.Schemas.TotalFeasibilityAndConceptStudiesDto | undefined>>,
    totalFEEDStudies: Components.Schemas.TotalFEEDStudiesDto | undefined,
    setTotalFEEDStudies: Dispatch<SetStateAction<Components.Schemas.TotalFEEDStudiesDto | undefined>>,
    totalOtherStudies: Components.Schemas.TotalOtherStudiesDto | undefined,
    historicCostCostProfile: Components.Schemas.HistoricCostCostProfileDto | undefined,
    offshoreFacilitiesOperationsCostProfile: Components.Schemas.OffshoreFacilitiesOperationsCostProfileDto | undefined,
    setOffshoreFacilitiesOperationsCostProfile: Dispatch<SetStateAction<Components.Schemas.OffshoreFacilitiesOperationsCostProfileDto | undefined>>,

    wellInterventionCostProfile: Components.Schemas.WellInterventionCostProfileDto | undefined,
    setWellInterventionCostProfile: Dispatch<SetStateAction<Components.Schemas.WellInterventionCostProfileDto | undefined>>,

    additionalOPEXCostProfile: Components.Schemas.AdditionalOPEXCostProfileDto | undefined,
    cessationWellsCost: Components.Schemas.TotalFEEDStudiesDto | undefined,
    setCessationWellsCost: Dispatch<SetStateAction<Components.Schemas.CessationWellsCostDto | undefined>>,

    cessationOffshoreFacilitiesCost: Components.Schemas.CessationOffshoreFacilitiesCostDto | undefined,
    setCessationOffshoreFacilitiesCost: Dispatch<SetStateAction<Components.Schemas.CessationOffshoreFacilitiesCostDto | undefined>>,

    gAndGAdminCost: Components.Schemas.GAndGAdminCostDto | undefined,
    setGAndGAdminCost: Dispatch<SetStateAction<Components.Schemas.GAndGAdminCostDto | undefined>>,

    exploration: Components.Schemas.ExplorationDto,
    setExploration: Dispatch<SetStateAction<Components.Schemas.ExplorationDto | undefined>>,
    wellProject: Components.Schemas.WellProjectDto,
    setWellProject: Dispatch<SetStateAction<Components.Schemas.WellProjectDto | undefined>>,

}

const CaseCostTab = ({
    topside,
    setTopside,
    surf,
    setSurf,
    substructure,
    setSubstructure,
    transport,
    setTransport,
    totalFeasibilityAndConceptStudies,
    setTotalFeasibilityAndConceptStudies,
    totalFEEDStudies,
    setTotalFEEDStudies,
    offshoreFacilitiesOperationsCostProfile,
    setOffshoreFacilitiesOperationsCostProfile,
    wellInterventionCostProfile,
    setWellInterventionCostProfile,
    cessationWellsCost,
    setCessationWellsCost,
    cessationOffshoreFacilitiesCost,
    setCessationOffshoreFacilitiesCost,
    gAndGAdminCost,
    setGAndGAdminCost,
    exploration,
    setExploration,
    wellProject,
    setWellProject,
}: Props) => {
    const { project } = useProjectContext();
    const { projectCase, setProjectCase, projectCaseEdited, setProjectCaseEdited, activeTabCase } = useCaseContext();
    // OPEX
    const [totalFeasibilityAndConceptStudiesOverride, setTotalFeasibilityAndConceptStudiesOverride] = useState<Components.Schemas.TotalFeasibilityAndConceptStudiesOverrideDto>()
    const [totalFEEDStudiesOverride, setTotalFEEDStudiesOverride] = useState<Components.Schemas.TotalFEEDStudiesOverrideDto>()
    const [totalOtherStudies, setTotalOtherStudies] = useState<Components.Schemas.TotalOtherStudiesDto>()

    const [offshoreFacilitiesOperationsCostProfileOverride, setOffshoreFacilitiesOperationsCostProfileOverride] = useState<Components.Schemas.OffshoreFacilitiesOperationsCostProfileOverrideDto>()
    const [wellInterventionCostProfileOverride, setWellInterventionCostProfileOverride] = useState<Components.Schemas.WellInterventionCostProfileOverrideDto>()
    const [additionalOPEXCostProfile, setAdditionalOPEXCostProfile] = useState<Components.Schemas.AdditionalOPEXCostProfileDto>()
    const [historicCostCostProfile, setHistoricCostCostProfile] = useState<Components.Schemas.HistoricCostCostProfileDto>()

    const [cessationWellsCostOverride, setCessationWellsCostOverride] = useState<Components.Schemas.CessationWellsCostOverrideDto>()
    const [cessationOffshoreFacilitiesCostOverride, setCessationOffshoreFacilitiesCostOverride] = useState<Components.Schemas.CessationOffshoreFacilitiesCostOverrideDto>()

    // CAPEX
    const [topsideCost, setTopsideCost] = useState<Components.Schemas.TopsideCostProfileDto>()
    const [topsideCostOverride, setTopsideCostOverride] = useState<Components.Schemas.TopsideCostProfileOverrideDto>()
    const [surfCost, setSurfCost] = useState<Components.Schemas.SurfCostProfileDto>()
    const [surfCostOverride, setSurfCostOverride] = useState<Components.Schemas.SurfCostProfileOverrideDto>()
    const [substructureCost, setSubstructureCost] = useState<Components.Schemas.SubstructureCostProfileDto>()
    const [substructureCostOverride, setSubstructureCostOverride] = useState<Components.Schemas.SubstructureCostProfileOverrideDto>()
    const [transportCost, setTransportCost] = useState<Components.Schemas.TransportCostProfileDto>()
    const [transportCostOverride, setTransportCostOverride] = useState<Components.Schemas.TransportCostProfileOverrideDto>()

    // Development
    const [wellProjectOilProducerCost, setWellProjectOilProducerCost] = useState<Components.Schemas.OilProducerCostProfileDto>()
    const [wellProjectOilProducerCostOverride,
        setWellProjectOilProducerCostOverride] = useState<Components.Schemas.OilProducerCostProfileOverrideDto>()

    const [wellProjectGasProducerCost, setWellProjectGasProducerCost] = useState<Components.Schemas.GasProducerCostProfileDto>()
    const [wellProjectGasProducerCostOverride,
        setWellProjectGasProducerCostOverride] = useState<Components.Schemas.GasProducerCostProfileOverrideDto>()

    const [wellProjectWaterInjectorCost, setWellProjectWaterInjectorCost] = useState<Components.Schemas.WaterInjectorCostProfileDto>()
    const [wellProjectWaterInjectorCostOverride,
        setWellProjectWaterInjectorCostOverride] = useState<Components.Schemas.WaterInjectorCostProfileOverrideDto>()

    const [wellProjectGasInjectorCost, setWellProjectGasInjectorCost] = useState<Components.Schemas.GasInjectorCostProfileDto>()
    const [wellProjectGasInjectorCostOverride,
        setWellProjectGasInjectorCostOverride] = useState<Components.Schemas.GasInjectorCostProfileOverrideDto>()

    // Exploration
    const [explorationWellCost, setExplorationWellCost] = useState<Components.Schemas.ExplorationWellCostProfileDto>()
    const [explorationAppraisalWellCost, setExplorationAppraisalWellCost] = useState<Components.Schemas.AppraisalWellCostProfileDto>()
    const [explorationSidetrackCost, setExplorationSidetrackCost] = useState<Components.Schemas.SidetrackCostProfileDto>()
    const [seismicAcqAndProcCost, setSeismicAcqAndProcCost] = useState<Components.Schemas.SeismicAcquisitionAndProcessingDto>()
    const [countryOfficeCost, setCountryOfficeCost] = useState<Components.Schemas.CountryOfficeCostDto>()

    const [startYear, setStartYear] = useState<number>(2020)
    const [endYear, setEndYear] = useState<number>(2030)
    const [tableYears, setTableYears] = useState<[number, number]>([2020, 2030])

    const studyGridRef = useRef<any>(null)
    const opexGridRef = useRef<any>(null)
    const cessationGridRef = useRef<any>(null)
    const capexGridRef = useRef<any>(null)
    const developmentWellsGridRef = useRef<any>(null)
    const explorationWellsGridRef = useRef<any>(null)

    useEffect(() => {
        (async () => {
            try {
                if (activeTabCase === 5) {
                    const totalFeasibility = projectCase?.totalFeasibilityAndConceptStudies
                    const totalFEED = projectCase?.totalFEEDStudies
                    const totalOtherStudiesLocal = projectCase?.totalOtherStudies

                    setTotalFeasibilityAndConceptStudies(totalFeasibility)
                    setTotalFeasibilityAndConceptStudiesOverride(projectCase?.totalFeasibilityAndConceptStudiesOverride)
                    setTotalFEEDStudies(totalFEED)
                    setTotalFEEDStudiesOverride(projectCase?.totalFEEDStudiesOverride)
                    setTotalOtherStudies(totalOtherStudiesLocal)

                    const wellIntervention = wellInterventionCostProfile
                    const offshoreFacilitiesOperations = projectCase?.offshoreFacilitiesOperationsCostProfile
                    const historicCostCostProfileLocal = projectCase?.historicCostCostProfile
                    const additionalOPEXCostProfileLocal = projectCase?.additionalOPEXCostProfile

                    setWellInterventionCostProfile(wellIntervention)
                    setWellInterventionCostProfileOverride(projectCase?.wellInterventionCostProfileOverride)
                    setOffshoreFacilitiesOperationsCostProfile(offshoreFacilitiesOperations)
                    setOffshoreFacilitiesOperationsCostProfileOverride(projectCase?.offshoreFacilitiesOperationsCostProfileOverride)
                    setHistoricCostCostProfile(historicCostCostProfileLocal)
                    setAdditionalOPEXCostProfile(additionalOPEXCostProfileLocal)

                    const cessationWells = projectCase?.cessationWellsCost
                    const cessationOffshoreFacilities = projectCase?.cessationOffshoreFacilitiesCost

                    setCessationWellsCost(cessationWells)
                    setCessationWellsCostOverride(projectCase?.cessationWellsCostOverride)
                    setCessationOffshoreFacilitiesCost(cessationOffshoreFacilities)
                    setCessationOffshoreFacilitiesCostOverride(projectCase?.cessationOffshoreFacilitiesCostOverride)

                    // CAPEX
                    const topsideCostProfile = topside.costProfile
                    setTopsideCost(topsideCostProfile)
                    const topsideCostProfileOverride = topside.costProfileOverride
                    setTopsideCostOverride(topsideCostProfileOverride)

                    const surfCostProfile = surf.costProfile
                    setSurfCost(surfCostProfile)
                    const surfCostProfileOverride = surf.costProfileOverride
                    setSurfCostOverride(surfCostProfileOverride)

                    const substructureCostProfile = substructure.costProfile
                    setSubstructureCost(substructureCostProfile)
                    const substructureCostProfileOverride = substructure.costProfileOverride
                    setSubstructureCostOverride(substructureCostProfileOverride)

                    const transportCostProfile = transport.costProfile
                    setTransportCost(transportCostProfile)
                    const transportCostProfileOverride = transport.costProfileOverride
                    setTransportCostOverride(transportCostProfileOverride)

                    // Development
                    const {
                        oilProducerCostProfile,
                        gasProducerCostProfile,
                        waterInjectorCostProfile,
                        gasInjectorCostProfile,
                        oilProducerCostProfileOverride,
                        gasProducerCostProfileOverride,
                        waterInjectorCostProfileOverride,
                        gasInjectorCostProfileOverride,
                    } = wellProject
                    setWellProjectOilProducerCost(oilProducerCostProfile)
                    setWellProjectOilProducerCostOverride(oilProducerCostProfileOverride)
                    setWellProjectGasProducerCost(gasProducerCostProfile)
                    setWellProjectGasProducerCostOverride(gasProducerCostProfileOverride)
                    setWellProjectWaterInjectorCost(waterInjectorCostProfile)
                    setWellProjectWaterInjectorCostOverride(waterInjectorCostProfileOverride)
                    setWellProjectGasInjectorCost(gasInjectorCostProfile)
                    setWellProjectGasInjectorCostOverride(gasInjectorCostProfileOverride)

                    // Exploration
                    const {
                        explorationWellCostProfile, appraisalWellCostProfile, sidetrackCostProfile,
                        seismicAcquisitionAndProcessing,
                    } = exploration
                    setExplorationWellCost(explorationWellCostProfile)
                    setExplorationAppraisalWellCost(appraisalWellCostProfile)
                    setExplorationSidetrackCost(sidetrackCostProfile)
                    setSeismicAcqAndProcCost(seismicAcquisitionAndProcessing)
                    const countryOffice = exploration.countryOfficeCost
                    setCountryOfficeCost(countryOffice)

                    setGAndGAdminCost(exploration.gAndGAdminCost)

                    SetTableYearsFromProfiles([
                        projectCase?.totalFeasibilityAndConceptStudies,
                        projectCase?.totalFEEDStudies,
                        projectCase?.wellInterventionCostProfile,
                        projectCase?.offshoreFacilitiesOperationsCostProfile,
                        projectCase?.cessationWellsCost,
                        projectCase?.cessationOffshoreFacilitiesCost,
                        projectCase?.totalFeasibilityAndConceptStudiesOverride,
                        projectCase?.totalFEEDStudiesOverride,
                        projectCase?.wellInterventionCostProfileOverride,
                        projectCase?.offshoreFacilitiesOperationsCostProfileOverride,
                        projectCase?.cessationWellsCostOverride,
                        projectCase?.cessationOffshoreFacilitiesCostOverride,
                        surfCostProfile,
                        topsideCostProfile,
                        substructureCostProfile,
                        transportCostProfile,
                        surfCostOverride,
                        topsideCostOverride,
                        substructureCostOverride,
                        transportCostOverride,
                        oilProducerCostProfile,
                        gasProducerCostProfile,
                        waterInjectorCostProfile,
                        gasInjectorCostProfile,
                        oilProducerCostProfileOverride,
                        gasProducerCostProfileOverride,
                        waterInjectorCostProfileOverride,
                        gasInjectorCostProfileOverride,
                        explorationWellCostProfile,
                        appraisalWellCostProfile,
                        sidetrackCostProfile,
                        seismicAcquisitionAndProcessing,
                        countryOffice,
                        exploration.gAndGAdminCost,
                    ], projectCase?.dG4Date ? new Date(projectCase?.dG4Date).getFullYear() : 2030, setStartYear, setEndYear, setTableYears)
                }
            } catch (error) {
                console.error("[CaseView] Error while generating cost profile", error)
            }
        })()
    }, [activeTabCase])

    useEffect(() => {
        const {
            explorationWellCostProfile,
            appraisalWellCostProfile,
            sidetrackCostProfile,
            seismicAcquisitionAndProcessing,
        } = exploration
        setExplorationWellCost(explorationWellCostProfile)
        setExplorationAppraisalWellCost(appraisalWellCostProfile)
        setExplorationSidetrackCost(sidetrackCostProfile)
        setSeismicAcqAndProcCost(seismicAcquisitionAndProcessing)
        const countryOffice = exploration.countryOfficeCost
        setCountryOfficeCost(countryOffice)
    }, [exploration])

    useEffect(() => {
        if (studyGridRef.current
            && studyGridRef.current.api
            && studyGridRef.current.api.refreshCells) {
            studyGridRef.current.api.refreshCells()
        }
    }, [totalFeasibilityAndConceptStudies, totalFEEDStudies, totalOtherStudies])

    useEffect(() => {
        if (opexGridRef.current
            && opexGridRef.current.api
            && opexGridRef.current.api.refreshCells) {
            opexGridRef.current.api.refreshCells()
        }
    }, [
        offshoreFacilitiesOperationsCostProfile,
        wellInterventionCostProfile,
        historicCostCostProfile,
        additionalOPEXCostProfile,
    ])

    useEffect(() => {
        if (cessationGridRef.current
            && cessationGridRef.current.api
            && cessationGridRef.current.api.refreshCells) {
            cessationGridRef.current.api.refreshCells()
        }
    }, [cessationWellsCost, cessationOffshoreFacilitiesCost])

    useEffect(() => {
        if (explorationWellsGridRef.current
            && explorationWellsGridRef.current.api
            && explorationWellsGridRef.current.api.refreshCells) {
            explorationWellsGridRef.current.api.refreshCells()
        }
    }, [gAndGAdminCost])

    const updatedAndSetSurf = (surfItem: Components.Schemas.SurfDto) => {
        const newSurf: Components.Schemas.SurfDto = { ...surfItem }
        if (surfCost) {
            newSurf.costProfile = surfCost
        }
        setSurf(newSurf)
    }

    const handleCaseFeasibilityChange: ChangeEventHandler<HTMLInputElement> = async (e) => {
        const newCase = { ...projectCase }
        const newCapexFactorFeasibilityStudies = e.currentTarget.value.length > 0
            ? Math.min(Math.max(Number(e.currentTarget.value), 0), 100) : undefined
        if (newCapexFactorFeasibilityStudies !== undefined) {
            newCase.capexFactorFeasibilityStudies = newCapexFactorFeasibilityStudies / 100
        } else { newCase.capexFactorFeasibilityStudies = 0 }
        newCase ?? setProjectCaseEdited(newCase)
    }

    const handleCaseFEEDChange: ChangeEventHandler<HTMLInputElement> = async (e) => {
        const newCase = { ...projectCase }
        const newCapexFactorFEEDStudies = e.currentTarget.value.length > 0
            ? Math.min(Math.max(Number(e.currentTarget.value), 0), 100) : undefined
        if (newCapexFactorFEEDStudies !== undefined) {
            newCase.capexFactorFEEDStudies = newCapexFactorFEEDStudies / 100
        } else { newCase.capexFactorFEEDStudies = 0 }
        newCase ?? setProjectCaseEdited(newCase)
    }

    const handleSurfMaturityChange: ChangeEventHandler<HTMLSelectElement> = async (e) => {
        if ([0, 1, 2, 3].indexOf(Number(e.currentTarget.value)) !== -1) {
            const newMaturity: Components.Schemas.Maturity = Number(e.currentTarget.value) as Components.Schemas.Maturity
            const newSurf = { ...surf }
            newSurf.maturity = newMaturity
            updatedAndSetSurf(newSurf)
        }
    }

    const handleStartYearChange: ChangeEventHandler<HTMLInputElement> = async (e) => {
        const newStartYear = Number(e.currentTarget.value)
        if (newStartYear < 2010) {
            setStartYear(2010)
            return
        }
        setStartYear(newStartYear)
    }

    const handleEndYearChange: ChangeEventHandler<HTMLInputElement> = async (e) => {
        const newEndYear = Number(e.currentTarget.value)
        if (newEndYear > 2100) {
            setEndYear(2100)
            return
        }
        setEndYear(newEndYear)
    }

    interface ITimeSeriesData {
        profileName: string
        unit: string,
        set?: Dispatch<SetStateAction<ITimeSeriesCost | undefined>>,
        overrideProfileSet?: Dispatch<SetStateAction<ITimeSeriesCostOverride | undefined>>,
        profile: ITimeSeries | undefined
        overrideProfile?: ITimeSeries | undefined
        overridable?: boolean
    }

    const studyTimeSeriesData: ITimeSeriesData[] = [
        {
            profileName: "Feasibility & conceptual stud.",
            unit: `${project?.currency === 1 ? "MNOK" : "MUSD"}`,
            profile: totalFeasibilityAndConceptStudies,
            overridable: true,
            overrideProfile: totalFeasibilityAndConceptStudiesOverride,
            overrideProfileSet: setTotalFeasibilityAndConceptStudiesOverride,
        },
        {
            profileName: "FEED studies (DG2-DG3)",
            unit: `${project?.currency === 1 ? "MNOK" : "MUSD"}`,
            profile: totalFEEDStudies,
            overridable: true,
            overrideProfile: totalFEEDStudiesOverride,
            overrideProfileSet: setTotalFEEDStudiesOverride,
        },
        {
            profileName: "Other studies",
            unit: `${project?.currency === 1 ? "MNOK" : "MUSD"}`,
            profile: totalOtherStudies,
            set: setTotalOtherStudies,
        },
    ]

    const opexTimeSeriesData: ITimeSeriesData[] = [
        {
            profileName: "Historic Cost",
            unit: `${project?.currency === 1 ? "MNOK" : "MUSD"}`,
            profile: historicCostCostProfile,
            set: setHistoricCostCostProfile,
        },
        {
            profileName: "Well intervention",
            unit: `${project?.currency === 1 ? "MNOK" : "MUSD"}`,
            profile: wellInterventionCostProfile,
            overridable: true,
            overrideProfile: wellInterventionCostProfileOverride,
            overrideProfileSet: setWellInterventionCostProfileOverride,
        },
        {
            profileName: "Offshore facilities operations",
            unit: `${project?.currency === 1 ? "MNOK" : "MUSD"}`,
            profile: offshoreFacilitiesOperationsCostProfile,
            overridable: true,
            overrideProfile: offshoreFacilitiesOperationsCostProfileOverride,
            overrideProfileSet: setOffshoreFacilitiesOperationsCostProfileOverride,
        },
        {
            profileName: "Additional OPEX (input req.)",
            unit: `${project?.currency === 1 ? "MNOK" : "MUSD"}`,
            profile: additionalOPEXCostProfile,
            set: setAdditionalOPEXCostProfile,
        },
    ]

    const cessationTimeSeriesData: ITimeSeriesData[] = [
        {
            profileName: "Cessation - Development wells",
            unit: `${project?.currency === 1 ? "MNOK" : "MUSD"}`,
            profile: cessationWellsCost,
            overridable: true,
            overrideProfile: cessationWellsCostOverride,
            overrideProfileSet: setCessationWellsCostOverride,
        },
        {
            profileName: "Cessation - Offshore facilities",
            unit: `${project?.currency === 1 ? "MNOK" : "MUSD"}`,
            profile: cessationOffshoreFacilitiesCost,
            overridable: true,
            overrideProfile: cessationOffshoreFacilitiesCostOverride,
            overrideProfileSet: setCessationOffshoreFacilitiesCostOverride,
        },
    ]

    const capexTimeSeriesData: ITimeSeriesData[] = [
        {
            profileName: "Subsea production system",
            unit: `${project?.currency === 1 ? "MNOK" : "MUSD"}`,
            profile: surfCost,
            overridable: true,
            overrideProfile: surfCostOverride,
            overrideProfileSet: setSurfCostOverride,
        },
        {
            profileName: "Topside",
            unit: `${project?.currency === 1 ? "MNOK" : "MUSD"}`,
            profile: topsideCost,
            overridable: true,
            overrideProfile: topsideCostOverride,
            overrideProfileSet: setTopsideCostOverride,
        },
        {
            profileName: "Substructure",
            unit: `${project?.currency === 1 ? "MNOK" : "MUSD"}`,
            profile: substructureCost,
            overridable: true,
            overrideProfile: substructureCostOverride,
            overrideProfileSet: setSubstructureCostOverride,
        },
        {
            profileName: "Transport system",
            unit: `${project?.currency === 1 ? "MNOK" : "MUSD"}`,
            profile: transportCost,
            overridable: true,
            overrideProfile: transportCostOverride,
            overrideProfileSet: setTransportCostOverride,
        },
    ]

    const developmentTimeSeriesData: ITimeSeriesData[] = [
        {
            profileName: "Oil producer cost",
            unit: `${project?.currency === 1 ? "MNOK" : "MUSD"}`,
            profile: wellProjectOilProducerCost,
            overridable: true,
            overrideProfile: wellProjectOilProducerCostOverride,
            overrideProfileSet: setWellProjectOilProducerCostOverride,
        },
        {
            profileName: "Gas producer cost",
            unit: `${project?.currency === 1 ? "MNOK" : "MUSD"}`,
            profile: wellProjectGasProducerCost,
            overridable: true,
            overrideProfile: wellProjectGasProducerCostOverride,
            overrideProfileSet: setWellProjectGasProducerCostOverride,
        },
        {
            profileName: "Water injector cost",
            unit: `${project?.currency === 1 ? "MNOK" : "MUSD"}`,
            profile: wellProjectWaterInjectorCost,
            overridable: true,
            overrideProfile: wellProjectWaterInjectorCostOverride,
            overrideProfileSet: setWellProjectWaterInjectorCostOverride,
        },
        {
            profileName: "Gas injector cost",
            unit: `${project?.currency === 1 ? "MNOK" : "MUSD"}`,
            profile: wellProjectGasInjectorCost,
            overridable: true,
            overrideProfile: wellProjectGasInjectorCostOverride,
            overrideProfileSet: setWellProjectGasInjectorCostOverride,
        },
    ]

    const explorationTimeSeriesData: ITimeSeriesData[] = [
        {
            profileName: "G&G and admin costs",
            unit: `${project?.currency === 1 ? "MNOK" : "MUSD"}`,
            profile: gAndGAdminCost,
        },
        {
            profileName: "Seismic acquisition and processing",
            unit: `${project?.currency === 1 ? "MNOK" : "MUSD"}`,
            profile: seismicAcqAndProcCost,
            set: setSeismicAcqAndProcCost,
        },
        {
            profileName: "Country office cost",
            unit: `${project?.currency === 1 ? "MNOK" : "MUSD"}`,
            profile: countryOfficeCost,
            set: setCountryOfficeCost,
        },
        {
            profileName: "Exploration well cost",
            unit: `${project?.currency === 1 ? "MNOK" : "MUSD"}`,
            profile: explorationWellCost,
            set: setExplorationWellCost,
        },
        {
            profileName: "Appraisal well cost",
            unit: `${project?.currency === 1 ? "MNOK" : "MUSD"}`,
            profile: explorationAppraisalWellCost,
            set: setExplorationAppraisalWellCost,
        },
        {
            profileName: "Sidetrack well cost",
            unit: `${project?.currency === 1 ? "MNOK" : "MUSD"}`,
            profile: explorationSidetrackCost,
            set: setExplorationSidetrackCost,
        },
    ]

    const handleTableYearsClick = () => {
        setTableYears([startYear, endYear])
    }

    function updateObject<T>(object: T | undefined, setObject: Dispatch<SetStateAction<T | undefined>>, key: keyof T, value: any): void {
        if (!object || !value) {
            console.error("Object or value is undefined")
            return
        }
        if (object[key] === value) {
            console.error("Object key is already set to value")
            return
        }
        const newObject: T = { ...object }
        newObject[key] = value
        setObject(newObject)
    }

    useEffect(() => {
       projectCase ?? updateObject(projectCase, setProjectCase, "totalFeasibilityAndConceptStudiesOverride", totalFeasibilityAndConceptStudiesOverride)
    }, [totalFeasibilityAndConceptStudiesOverride])

    useEffect(() => {
       projectCase ?? updateObject(projectCase, setProjectCase, "totalFEEDStudiesOverride", totalFEEDStudiesOverride)
    }, [totalFEEDStudiesOverride])

    useEffect(() => {
       projectCase ?? updateObject(projectCase, setProjectCase, "totalOtherStudies", totalOtherStudies)
    }, [totalOtherStudies])

    useEffect(() => {
       projectCase ?? updateObject(projectCase, setProjectCase, "wellInterventionCostProfileOverride", wellInterventionCostProfileOverride)
    }, [wellInterventionCostProfileOverride])

    useEffect(() => {
       projectCase ?? updateObject(projectCase, setProjectCase, "offshoreFacilitiesOperationsCostProfileOverride", offshoreFacilitiesOperationsCostProfileOverride)
    }, [offshoreFacilitiesOperationsCostProfileOverride])

    useEffect(() => {
       projectCase ?? updateObject(projectCase, setProjectCase, "historicCostCostProfile", historicCostCostProfile)
    }, [historicCostCostProfile])

    useEffect(() => {
       projectCase ?? updateObject(projectCase, setProjectCase, "additionalOPEXCostProfile", additionalOPEXCostProfile)
    }, [additionalOPEXCostProfile])

    useEffect(() => {
       projectCase ?? updateObject(projectCase, setProjectCase, "cessationWellsCostOverride", cessationWellsCostOverride)
    }, [cessationWellsCostOverride])

    useEffect(() => {
       projectCase ?? updateObject(projectCase, setProjectCase, "cessationOffshoreFacilitiesCostOverride", cessationOffshoreFacilitiesCostOverride)
    }, [cessationOffshoreFacilitiesCostOverride])

    useEffect(() => {
       surf ?? updateObject(surf, setSurf, "costProfile", surfCost)
    }, [surfCost])

    useEffect(() => {
        topside ?? updateObject(topside, setTopside, "costProfile", topsideCost)
    }, [topsideCost])

    useEffect(() => {
        substructure ?? updateObject(substructure, setSubstructure, "costProfile", substructureCost)
    }, [substructureCost])

    useEffect(() => {
        transport ?? updateObject(transport, setTransport, "costProfile", transportCost)
    }, [transportCost])

    useEffect(() => {
        surf ?? updateObject(surf, setSurf, "costProfileOverride", surfCostOverride)
    }, [surfCostOverride])

    useEffect(() => {
        topside ?? updateObject(topside, setTopside, "costProfileOverride", topsideCostOverride)
    }, [topsideCostOverride])

    useEffect(() => {
        substructure ?? updateObject(substructure, setSubstructure, "costProfileOverride", substructureCostOverride)
    }, [substructureCostOverride])

    useEffect(() => {
        transport ?? updateObject(transport, setTransport, "costProfileOverride", transportCostOverride)
    }, [transportCostOverride])

    useEffect(() => {
        wellProject ?? updateObject(wellProject, setWellProject, "oilProducerCostProfile", wellProjectOilProducerCost)
    }, [wellProjectOilProducerCost])

    useEffect(() => {
        wellProject ?? updateObject(wellProject, setWellProject, "oilProducerCostProfileOverride", wellProjectOilProducerCostOverride)
    }, [wellProjectOilProducerCostOverride])

    useEffect(() => {
        wellProject ?? updateObject(wellProject, setWellProject, "gasProducerCostProfile", wellProjectGasProducerCost)
    }, [wellProjectGasProducerCost])

    useEffect(() => {
        wellProject ?? updateObject(wellProject, setWellProject, "gasProducerCostProfileOverride", wellProjectGasProducerCostOverride)
    }, [wellProjectGasProducerCostOverride])

    useEffect(() => {
        wellProject ?? updateObject(wellProject, setWellProject, "waterInjectorCostProfile", wellProjectWaterInjectorCost)
    }, [wellProjectWaterInjectorCost])

    useEffect(() => {
        wellProject ?? updateObject(wellProject, setWellProject, "waterInjectorCostProfileOverride", wellProjectWaterInjectorCostOverride)
    }, [wellProjectWaterInjectorCostOverride])

    useEffect(() => {
        wellProject ?? updateObject(wellProject, setWellProject, "gasInjectorCostProfile", wellProjectGasInjectorCost)
    }, [wellProjectGasInjectorCost])

    useEffect(() => {
        wellProject ?? updateObject(wellProject, setWellProject, "gasInjectorCostProfileOverride", wellProjectGasInjectorCostOverride)
    }, [wellProjectGasInjectorCostOverride])

    useEffect(() => {
        exploration ?? updateObject(exploration, setExploration, "explorationWellCostProfile", explorationWellCost)
    }, [explorationWellCost])

    useEffect(() => {
        exploration ?? updateObject(exploration, setExploration, "appraisalWellCostProfile", explorationAppraisalWellCost)
    }, [explorationAppraisalWellCost])

    useEffect(() => {
        exploration ?? updateObject(exploration, setExploration, "sidetrackCostProfile", explorationSidetrackCost)
    }, [explorationSidetrackCost])

    useEffect(() => {
        exploration ?? updateObject(exploration, setExploration, "seismicAcquisitionAndProcessing", seismicAcqAndProcCost)
    }, [seismicAcqAndProcCost])

    useEffect(() => {
        exploration ?? updateObject(exploration, setExploration, "countryOfficeCost", countryOfficeCost)
    }, [countryOfficeCost])

    if (activeTabCase !== 5) { return null }

    const maturityOptions: { [key: string]: string } = {
        0: "A",
        1: "B",
        2: "C",
        3: "D",
    }
    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
                <InputSwitcher
                    value={`${projectCase?.capexFactorFeasibilityStudies !== undefined ? (projectCase?.capexFactorFeasibilityStudies * 100).toFixed(2) : ""}%`}
                    label="CAPEX factor feasibility studies"
                >
                    <CaseNumberInput
                        onChange={handleCaseFeasibilityChange}
                        defaultValue={projectCase?.capexFactorFeasibilityStudies !== undefined ? projectCase?.capexFactorFeasibilityStudies * 100 : undefined}
                        integer={false}
                        unit="%"
                        min={0}
                        max={100}
                    />
                </InputSwitcher>
            </Grid>
            <Grid item xs={12} md={4}>
                <InputSwitcher
                    value={`${projectCase?.capexFactorFEEDStudies !== undefined ? (projectCase?.capexFactorFEEDStudies * 100).toFixed(2) : ""}%`}
                    label="CAPEX factor FEED studies"
                >
                    <CaseNumberInput
                        onChange={handleCaseFEEDChange}
                        defaultValue={projectCase?.capexFactorFEEDStudies !== undefined ? projectCase?.capexFactorFEEDStudies * 100 : undefined}
                        integer={false}
                        unit="%"
                        min={0}
                        max={100}
                    />
                </InputSwitcher>
            </Grid>
            <Grid item xs={12} md={4}>
                <InputSwitcher value={maturityOptions[surf.maturity]} label="Maturity">
                    <NativeSelect
                        id="maturity"
                        label=""
                        onChange={handleSurfMaturityChange}
                        value={surf.maturity}
                    >
                        {Object.keys(maturityOptions).map((key) => (
                            <option key={key} value={key}>{maturityOptions[key]}</option>
                        ))}
                    </NativeSelect>
                </InputSwitcher>
            </Grid>
            <Grid item xs={12} container spacing={1} justifyContent="flex-end" alignItems="flex-end">
                <Grid item>
                    <NativeSelect
                        id="currency"
                        label="Currency"
                        onChange={() => { }}
                        value={project?.currency}
                        disabled
                    >
                        <option key="1" value={1}>MNOK</option>
                        <option key="2" value={2}>MUSD</option>
                    </NativeSelect>
                </Grid>
                <Grid item>
                    <CaseNumberInput
                        onChange={handleStartYearChange}
                        defaultValue={startYear}
                        integer
                        label="Start year"
                    />
                </Grid>
                <Grid item>
                    <CaseNumberInput
                        onChange={handleEndYearChange}
                        defaultValue={endYear}
                        integer
                        label="End year"
                    />
                </Grid>
                <Grid item>
                    <Button onClick={handleTableYearsClick}>
                        Apply
                    </Button>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <CaseTabTable
                    timeSeriesData={studyTimeSeriesData}
                    dg4Year={projectCase?.dG4Date ? new Date(projectCase?.dG4Date).getFullYear() : 2030}
                    tableYears={tableYears}
                    tableName="Total study costs"
                    gridRef={studyGridRef}
                    alignedGridsRef={[opexGridRef, cessationGridRef, capexGridRef,
                        developmentWellsGridRef, explorationWellsGridRef]}
                    includeFooter
                    totalRowName="Total study costs"
                />
            </Grid>
            <Grid item xs={12}>
                <CaseTabTable
                    timeSeriesData={opexTimeSeriesData}
                    dg4Year={projectCase?.dG4Date ? new Date(projectCase?.dG4Date).getFullYear() : 2030}
                    tableYears={tableYears}
                    tableName="OPEX"
                    gridRef={opexGridRef}
                    alignedGridsRef={[studyGridRef, cessationGridRef, capexGridRef,
                        developmentWellsGridRef, explorationWellsGridRef]}
                    includeFooter
                    totalRowName="Total OPEX cost"
                />
            </Grid>
            <Grid item xs={12}>
                <CaseTabTable
                    timeSeriesData={cessationTimeSeriesData}
                    dg4Year={projectCase?.dG4Date ? new Date(projectCase?.dG4Date).getFullYear() : 2030}
                    tableYears={tableYears}
                    tableName="Cessation costs"
                    gridRef={cessationGridRef}
                    alignedGridsRef={[studyGridRef, opexGridRef, capexGridRef,
                        developmentWellsGridRef, explorationWellsGridRef]}
                    includeFooter
                    totalRowName="Total cessation cost"
                />
            </Grid>
            <Grid item xs={12}>
                <CaseTabTable
                    timeSeriesData={capexTimeSeriesData}
                    dg4Year={projectCase?.dG4Date ? new Date(projectCase?.dG4Date).getFullYear() : 2030}
                    tableYears={tableYears}
                    tableName="Offshore facilitiy costs"
                    gridRef={capexGridRef}
                    alignedGridsRef={[studyGridRef, opexGridRef, cessationGridRef,
                        developmentWellsGridRef, explorationWellsGridRef]}
                    includeFooter
                    totalRowName="Total offshore facility cost"
                />
            </Grid>
            <Grid item xs={12}>
                <CaseTabTable
                    timeSeriesData={developmentTimeSeriesData}
                    dg4Year={projectCase?.dG4Date ? new Date(projectCase?.dG4Date).getFullYear() : 2030}
                    tableYears={tableYears}
                    tableName="Development well costs"
                    gridRef={developmentWellsGridRef}
                    alignedGridsRef={[studyGridRef, opexGridRef, cessationGridRef, capexGridRef,
                        explorationWellsGridRef]}
                    includeFooter
                    totalRowName="Total development well cost"
                />
            </Grid>
            <Grid item xs={12}>
                <CaseTabTable
                    timeSeriesData={explorationTimeSeriesData}
                    dg4Year={projectCase?.dG4Date ? new Date(projectCase?.dG4Date).getFullYear() : 2030}
                    tableYears={tableYears}
                    tableName="Exploration well costs"
                    gridRef={explorationWellsGridRef}
                    alignedGridsRef={[studyGridRef, opexGridRef, cessationGridRef, capexGridRef,
                        developmentWellsGridRef]}
                    includeFooter
                    totalRowName="Total exploration cost"
                />
            </Grid>
        </Grid>
    )
}

export default CaseCostTab
