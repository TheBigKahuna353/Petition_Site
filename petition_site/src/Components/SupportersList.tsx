import { Card } from "@mui/material"
import React, { useEffect } from "react"
import SupportersListObj from "./SupportersListObj"
import axios from "axios"

interface Props {
    petitionId: number,
    supportTiers: SupportTier[]
}

const SupportersList = (props: Props) => {

    const [supporters, setSupporters] = React.useState<Supporter[]>([])

    useEffect(() => {
        if (props.petitionId === 0) return
        axios.get(`http://localhost:4941/api/v1/petitions/${props.petitionId}/supporters`)
        .then(response => {
            setSupporters(response.data)
        })
        .catch(error => {
            console.log(error.response.statusText)
        })
    }, [props.petitionId])

    const getTier = (supporter: Supporter) => {
        return props.supportTiers.find((tier) => tier.supportTierId === supporter.supportTierId)?.title ?? "..."
    }

    return (
        <div style={{marginTop:"20px", height:"340px"}}>
            <Card style={{height:"100%"}}>
            <h1>Supporters</h1>
            <div style={{display: "flex", justifyContent: "space-evenly", height:"70%"}}>
                {supporters.map((supporter: Supporter) => {
                    return (
                        <SupportersListObj supporter={supporter} tier={getTier(supporter)}/>
                    )
                })}
            </div>
            </Card>
        </div>
    );
}


export default SupportersList;