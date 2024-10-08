import {
    Button,
    Icon,
    Tooltip,
} from "@equinor/eds-core-react"
import {
    useState,
    useEffect,
    useMemo,
    useRef,
} from "react"
import { useNavigate } from "react-router-dom"
import { useModuleCurrentContext } from "@equinor/fusion-framework-react-module-context"
import { AgGridReact } from "@ag-grid-community/react"
import { more_vertical } from "@equinor/eds-icons"
import styled from "styled-components"
import { ColDef } from "@ag-grid-community/core"
import { useQuery } from "@tanstack/react-query"
import { casePath, productionStrategyOverviewToString, cellStyleRightAlign } from "../../../Utils/common"
import { ReferenceCaseIcon } from "../Components/ReferenceCaseIcon"
import { projectQueryFn } from "../../../Services/QueryFunctions"

const AgTableContainer = styled.div`
    overflow: auto;
`

const Wrapper = styled.div`
    justify-content: center;
    align-items: center;
    display: inline-flex;
`

interface TableCase {
    id: string,
    name: string,
    description: string,
    productionStrategyOverview: Components.Schemas.ProductionStrategyOverview | undefined,
    producerCount: number,
    gasInjectorCount: number,
    waterInjectorCount: number,
    createdAt?: string
    referenceCaseId?: string
}

interface CasesAgGridTableProps {
    setSelectedCaseId: (id: string) => void
    setMenuAnchorEl: (el: HTMLElement | null) => void
    setIsMenuOpen: (isMenuOpen: boolean) => void
    isMenuOpen: boolean
}

const CasesAgGridTable = ({
    setSelectedCaseId,
    setMenuAnchorEl,
    setIsMenuOpen,
    isMenuOpen,
}: CasesAgGridTableProps): JSX.Element => {
    const gridRef = useRef<AgGridReact>(null)
    const [rowData, setRowData] = useState<TableCase[]>()
    const { currentContext } = useModuleCurrentContext()
    const navigate = useNavigate()
    const externalId = currentContext?.externalId

    const defaultColDef = useMemo(() => ({
        sortable: true,
        filter: true,
        resizable: true,
        suppressHeaderMenuButton: true,
    }), [])

    const { data: apiData } = useQuery({
        queryKey: ["projectApiData", externalId],
        queryFn: () => projectQueryFn(externalId),
        enabled: !!externalId,
    })

    if (!apiData) { return <p>project not found</p> }

    const productionStrategyToString = (p: any) => {
        const stringValue = productionStrategyOverviewToString(p.value)
        return <div>{stringValue}</div>
    }

    const onMoreClick = (data: TableCase, target: HTMLElement) => {
        setSelectedCaseId(data.id)
        setMenuAnchorEl(target)
        setIsMenuOpen(!isMenuOpen)
    }

    const menuButton = (p: any) => (
        <Button
            variant="ghost"
            onClick={(e) => onMoreClick(p.node.data, e.currentTarget)}

        >
            <Icon data={more_vertical} />
        </Button>
    )

    const selectCase = (p: any) => {
        if (!currentContext || !p.node.data) { return null }
        navigate(casePath(currentContext.id, p.node.data.id))
        return null
    }

    const nameWithReferenceCase = (p: any) => (
        <Tooltip title={p.value} placement="bottom-start">
            <Wrapper>
                {p.node.data.referenceCaseId === p.node.data.id && (
                    <ReferenceCaseIcon iconPlacement="casesTable" />
                )}
                <Button as="span" variant="ghost" className="GhostButton" onClick={() => selectCase(p)}>{p.value}</Button>
            </Wrapper>
        </Tooltip>
    )

    const [columnDefs] = useState<ColDef[]>([
        {
            field: "name",
            cellRenderer: nameWithReferenceCase,
            minWidth: 150,
            maxWidth: 500,
            flex: 1,
        },
        {
            field: "productionStrategyOverview",
            headerName: "Production Strategy Overview",
            headerTooltip: "Production Strategy Overview",
            cellRenderer: productionStrategyToString,
            width: 280,
        },
        {
            field: "producerCount",
            headerName: "Producers",
            width: 130,
            cellStyle: cellStyleRightAlign,
        },
        {
            field: "gasInjectorCount",
            headerName: "Gas injectors",
            width: 155,
            cellStyle: cellStyleRightAlign,
        },
        {
            field: "waterInjectorCount",
            headerName: "Water injectors",
            width: 170,
            cellStyle: cellStyleRightAlign,
        },
        {
            field: "createdAt",
            headerName: "Created",
            width: 120,
        },
        {
            field: "Options",
            cellRenderer: menuButton,
            width: 120,
        },
    ])

    const casesToRowData = () => {
        if (apiData.cases) {
            const tableCases: TableCase[] = []
            apiData.cases.forEach((c) => {
                const tableCase: TableCase = {
                    id: c.id!,
                    name: c.name ?? "",
                    description: c.description ?? "",
                    productionStrategyOverview: c.productionStrategyOverview,
                    producerCount: c.producerCount ?? 0,
                    waterInjectorCount: c.waterInjectorCount ?? 0,
                    gasInjectorCount: c.gasInjectorCount ?? 0,
                    createdAt: c.createTime?.substring(0, 10),
                    referenceCaseId: apiData.referenceCaseId,
                }
                tableCases.push(tableCase)
            })
            setRowData(tableCases)
        }
    }

    useEffect(() => {
        casesToRowData()
    }, [apiData])

    return (
        <div>
            <AgTableContainer>
                <AgGridReact
                    ref={gridRef}
                    rowData={rowData}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    animateRows
                    domLayout="autoHeight"
                />
            </AgTableContainer>
        </div>
    )
}

export default CasesAgGridTable
