import { Card } from "@mui/material";


interface Props {
    supportTier: SupportTier
}



const SupportTierListObj = (props: Props) => {
    return (
        <Card style={{maxWidth:"30%", padding: "10px", margin:"20px"}}>
            <h1>{props.supportTier.title}</h1>
            <h2>${props.supportTier.cost}</h2>
            <p>{props.supportTier.description}</p>
        </Card>
    );
}

export default SupportTierListObj;