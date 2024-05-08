import { Card } from "@mui/material";
import SupportTierListObj from "./SupportTierListObj";

interface SupportTierListProps {
    supportTiers: SupportTier[]
}

const SupportTierList = (props: SupportTierListProps) => {

    const {supportTiers} = props
    supportTiers.sort((a, b) => a.cost - b.cost)

    return (
        <div style={{marginTop: "20px"}}>
            <Card>
            <h1>Support Tiers</h1>
            <div style={{display: "flex", justifyContent: "space-evenly"}}>
                {props.supportTiers.map((supportTier: SupportTier) => {
                    return (
                        <SupportTierListObj supportTier={supportTier}/>
                    )
                })}
            </div>
            </Card>
        </div>
    );
}

export default SupportTierList;