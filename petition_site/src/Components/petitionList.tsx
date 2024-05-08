import React from "react"
import PetitionListObj from "./petitionListObj"
import { Paper } from "@mui/material"
import CSS from 'csstype';







interface IPetitionProps {
    petitions: Array<Petition>,
    catergories: Array<Catergory>
}

const PetitionList = (props: IPetitionProps) => {

    const { petitions, catergories } = props

    const card: CSS.Properties = {
        padding: "10px",
        margin: "20px",
        display: "inline-grid",
        width: "fit-content"
    }


    return (
        <div>
            <div>
                {petitions.map((petition) => {
                    return (
                        <Paper elevation={3} style={card} >
                            <PetitionListObj petition={petition} key={petition.petitionId} catergories={catergories} />
                        </Paper>
                    )
                })}
            </div>
        </div>
    )
}

export default PetitionList;