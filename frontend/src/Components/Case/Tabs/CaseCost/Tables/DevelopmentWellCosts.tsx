import React, { useEffect, useState } from "react"
import { useModuleCurrentContext } from "@equinor/fusion-framework-react-module-context"
import { useQuery } from "@tanstack/react-query"

import { ITimeSeriesTableData } from "@/Models/ITimeSeries"
import { projectQueryFn } from "@/Services/QueryFunctions"
import CaseTabTable from "../../../Components/CaseTabTable"

interface DevelopmentWellCostsProps {
    tableYears: [number, number];
    developmentWellsGridRef: React.MutableRefObject<any>;
    alignedGridsRef: any[];
    apiData: Components.Schemas.CaseWithAssetsDto;
    addEdit: any;
}

const DevelopmentWellCosts: React.FC<DevelopmentWellCostsProps> = ({
    tableYears,
    developmentWellsGridRef,
    alignedGridsRef,
    apiData,
    addEdit,
}) => {
    const { currentContext } = useModuleCurrentContext()
    const externalId = currentContext?.externalId

    const { data: projectData } = useQuery({
        queryKey: ["projectApiData", externalId],
        queryFn: () => projectQueryFn(externalId),
        enabled: !!externalId,
    })

    const [developmentTimeSeriesData, setDevelopmentTimeSeriesData] = useState<ITimeSeriesTableData[]>([])

    useEffect(() => {
        const wellProject = apiData?.wellProject
        const wellProjectOilProducerCostData = apiData.oilProducerCostProfile
        const wellProjectOilProducerCostOverrideData = apiData.oilProducerCostProfileOverride
        const wellProjectGasProducerCostData = apiData.gasProducerCostProfile
        const wellProjectGasProducerCostOverrideData = apiData.gasProducerCostProfileOverride
        const wellProjectWaterInjectorCostData = apiData.waterInjectorCostProfile
        const wellProjectWaterInjectorCostOverrideData = apiData.waterInjectorCostProfileOverride
        const wellProjectGasInjectorCostData = apiData.gasInjectorCostProfile
        const wellProjectGasInjectorCostOverrideData = apiData.gasInjectorCostProfileOverride

        if (!wellProject) {
            console.error("No well project data")
            return
        }

        const newDevelopmentTimeSeriesData: ITimeSeriesTableData[] = [
            {
                profileName: "Oil producer",
                unit: `${projectData?.commonProjectAndRevisionData.currency === 1 ? "MNOK" : "MUSD"}`,
                profile: wellProjectOilProducerCostData,
                resourceName: "wellProjectOilProducerCostOverride",
                resourceId: wellProject.id,
                resourceProfileId: wellProjectOilProducerCostOverrideData?.id,
                resourcePropertyKey: "wellProjectOilProducerCostOverride",
                overridable: true,
                overrideProfile: wellProjectOilProducerCostOverrideData,
                editable: true,
            },
            {
                profileName: "Gas producer",
                unit: `${projectData?.commonProjectAndRevisionData.currency === 1 ? "MNOK" : "MUSD"}`,
                profile: wellProjectGasProducerCostData,
                resourceName: "wellProjectGasProducerCostOverride",
                resourceId: wellProject.id,
                resourceProfileId: wellProjectGasProducerCostOverrideData?.id,
                resourcePropertyKey: "wellProjectGasProducerCostOverride",
                overridable: true,
                overrideProfile: wellProjectGasProducerCostOverrideData,
                editable: true,
            },
            {
                profileName: "Water injector",
                unit: `${projectData?.commonProjectAndRevisionData.currency === 1 ? "MNOK" : "MUSD"}`,
                profile: wellProjectWaterInjectorCostData,
                resourceName: "wellProjectWaterInjectorCostOverride",
                resourceId: wellProject.id,
                resourceProfileId: wellProjectWaterInjectorCostOverrideData?.id,
                resourcePropertyKey: "wellProjectWaterInjectorCostOverride",
                overridable: true,
                overrideProfile: wellProjectWaterInjectorCostOverrideData,
                editable: true,
            },
            {
                profileName: "Gas injector",
                unit: `${projectData?.commonProjectAndRevisionData.currency === 1 ? "MNOK" : "MUSD"}`,
                profile: wellProjectGasInjectorCostData,
                resourceName: "wellProjectGasInjectorCostOverride",
                resourceId: wellProject.id,
                resourceProfileId: wellProjectGasInjectorCostOverrideData?.id,
                resourcePropertyKey: "wellProjectGasInjectorCostOverride",
                overridable: true,
                overrideProfile: wellProjectGasInjectorCostOverrideData,
                editable: true,
            },
        ]

        setDevelopmentTimeSeriesData(newDevelopmentTimeSeriesData)
    }, [apiData, projectData, tableYears])

    return (
        <CaseTabTable
            timeSeriesData={developmentTimeSeriesData}
            dg4Year={apiData.case.dG4Date ? new Date(apiData.case.dG4Date).getFullYear() : 2030}
            tableYears={tableYears}
            tableName="Development well cost"
            gridRef={developmentWellsGridRef}
            alignedGridsRef={alignedGridsRef}
            includeFooter
            totalRowName="Total"
            addEdit={addEdit}
        />
    )
}

export default DevelopmentWellCosts
