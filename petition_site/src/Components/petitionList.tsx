import React from "react"
import PetitionListObj from "./petitionListObj"
import { Paper } from "@mui/material"
import CSS from 'csstype';



interface IPetitionProps {
    petitions: Array<Petition>,
    catergories: Array<Catergory>,
    editDelete?: boolean,
    editCallback?: (id: number) => void,
    deleteCallback?: (id: number) => void
}

const PetitionList = (props: IPetitionProps) => {

    const { petitions, catergories } = props

    const card: CSS.Properties = {
        padding: "10px",
        margin: "20px",
        display: "inline-grid",
        width: "fit-content",
        position: "relative"
    }

    return (
        <div>
            <div>
                {petitions.map((petition) => {
                    return (
                        <Paper elevation={3} style={card} id={'PetitionObj-' + petition.petitionId}>
                            <PetitionListObj 
                                petition={petition} 
                                key={petition.petitionId} 
                                catergories={catergories}
                                editDelete={props.editDelete}
                                editCallback={props.editCallback}
                                deleteCallback={props.deleteCallback}
                            />
                        </Paper>
                    )
                })}
            </div>
        </div>
    )
}

export default PetitionList;