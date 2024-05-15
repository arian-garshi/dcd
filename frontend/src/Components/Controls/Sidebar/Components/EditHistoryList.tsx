import React from "react"
import styled from "styled-components"
import { Typography, Icon, Button } from "@equinor/eds-core-react"
import { arrow_forward, arrow_drop_down, arrow_drop_up } from "@equinor/eds-icons"
import { useCaseContext } from "../../../../Context/CaseContext"
import { formatTime } from "../../../../Utils/common"
import { useAppContext } from "../../../../Context/AppContext"
import HistoryButton from "../../../Buttons/HistoryButton"

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    margin-bottom: 5px;
`

const Container = styled.div<{ $sidebarOpen: boolean }>`
    display: flex;
    flex-direction: column;
    width: 100%;
    margin: ${({ $sidebarOpen }) => ($sidebarOpen ? "0 8px" : "0")};
    align-items: ${({ $sidebarOpen }) => ($sidebarOpen ? "space-between" : "center")};
`

const Content = styled.div`
    max-height: 200px;
    overflow: auto;
    -ms-overflow-style: none; 
    scrollbar-width: none; 
    margin: 0 5px;
    
    &::-webkit-scrollbar { 
        display: none;  
    }
`

const EditInstance = styled.div`
    margin: 10px 5px 10px 0;
`

const PreviousValue = styled(Typography)`
    color: red;
    text-decoration: line-through;
    opacity: 0.5;
    max-width: 100px;
    font-size: 12px;

`

const NextValue = styled(Typography)`
    max-width: 100px;
    font-size: 12px;
`

const ChangeView = styled.div`
    display: flex;
    flex-wrap: nowrap;
    gap: 10px;
    align-items: center;

    & > p {
        white-space: wrap;
        overflow: hidden;
    }
`

const EditHistoryList: React.FC = () => {
    const { caseEdits, projectCase } = useCaseContext()

    const {
        editHistoryIsActive,
        setEditHistoryIsActive,
        sidebarOpen,
    } = useAppContext()

    return (
        <Container $sidebarOpen={sidebarOpen}>
            {!sidebarOpen ? <HistoryButton /> : (
                <Header>
                    <Typography variant="overline">Edit history</Typography>
                    <Button variant="ghost_icon" onClick={() => setEditHistoryIsActive(!editHistoryIsActive)}>
                        <Icon size={16} data={editHistoryIsActive ? arrow_drop_up : arrow_drop_down} />
                    </Button>
                </Header>
            )}
            <Content>
                {sidebarOpen && projectCase && editHistoryIsActive && caseEdits.map((edit) => (edit.level === "case" && edit.objectId === projectCase.id ? (
                    <EditInstance key={edit.uuid} style={{ marginBottom: "10px" }}>
                        <Header>
                            <Typography variant="caption">{String(edit.inputLabel)}</Typography>
                            <Typography variant="overline">{formatTime(edit.timeStamp)}</Typography>
                        </Header>
                        <ChangeView>
                            <PreviousValue>{edit.previousValue}</PreviousValue>
                            <div>
                                <Icon data={arrow_forward} size={16} />
                            </div>
                            <NextValue>{edit.newValue}</NextValue>
                        </ChangeView>
                    </EditInstance>
                ) : null))}
                {editHistoryIsActive && caseEdits.length === 0 && <NextValue>No edits..</NextValue>}
            </Content>
        </Container>
    )
}

export default EditHistoryList
