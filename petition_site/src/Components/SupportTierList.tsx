import { Card } from "@mui/material";
import SupportTierListObj from "./SupportTierListObj";


interface SupportTierListProps {
    supportTiers: SupportTier[],
    editDelete?: boolean,
    editCallback?: (id: number) => void,
    deleteCallback?: (id: number) => void
}

const SupportTierList = (props: SupportTierListProps) => {

    const {supportTiers} = props
    supportTiers.sort((a, b) => a.cost - b.cost)

    return (
        <div style={{marginTop: "20px", height: "100%", minWidth: "800px"}}>
            <Card style={{height:"100%"}}>
                <h1>Support Tiers</h1>
                <div style={{display: "flex", justifyContent: "space-evenly", position:"relative"}}>
                    {props.supportTiers.map((supportTier: SupportTier) => {
                        return (
                            <div style={{position: "relative", maxWidth:"30%", minWidth: "250px"}}>
                                <SupportTierListObj supportTier={supportTier} editDelete editCallback={props.editCallback} deleteCallback={props.deleteCallback}/>
                            </div>
                        )
                    })}
                </div>
            </Card>
        </div>
    );
}

export default SupportTierList;