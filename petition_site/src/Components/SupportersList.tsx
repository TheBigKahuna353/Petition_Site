import { Card, Pagination } from "@mui/material"
import React, { useEffect } from "react"
import SupportersListObj from "./SupportersListObj"
import axios from "axios"

interface Props {
    petitionId: number,
    supportTiers: SupportTier[],
    update: number
}

const SupportersList = (props: Props) => {

    const [supporters, setSupporters] = React.useState<Supporter[]>([])
    const [page, setPage] = React.useState(1)

    const [supportersPage, setSupportersPage] = React.useState<Supporter[]>([])

    useEffect(() => {
        if (props.petitionId === 0) return
        axios.get(`http://localhost:4941/api/v1/petitions/${props.petitionId}/supporters`)
        .then(response => {
            setSupporters(response.data)
        })
        .catch(error => {
            console.log(error.response.statusText)
            // TODO: error handling
        })
    }, [props.petitionId, props.update])

    useEffect(() => {
        setSupportersPage(supporters.slice((page - 1) * 3, page * 3))
    }, [page, supporters])

    const getTier = (supporter: Supporter) => {
        return props.supportTiers.find((tier) => tier.supportTierId === supporter.supportTierId)?.title ?? "..."
    }

    return (
        <div style={{marginTop:"20px", height:"420px", background:"red"}}>
            <Card style={{height:"100%"}}>
                <h1>Supporters</h1>
                <div style={{display: "flex", justifyContent: "space-evenly", height:"65%"}}>
                    {supportersPage.map((supporter: Supporter) => {
                        return (
                            <SupportersListObj supporter={supporter} tier={getTier(supporter)}/>
                        )
                    })}
                </div>
                <Pagination 
                count={Math.ceil(supporters.length / 3)} 
                color="primary"
                onChange={(event, value) => setPage(value)}
                style={{display:"inline-flex", margin:"15px"}}/>
            </Card>
        </div>
    );
}


export default SupportersList;