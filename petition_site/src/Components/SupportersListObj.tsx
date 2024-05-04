import { Card } from "@mui/material";
import Owner from "./OwnerDisplay";

interface SupportersListObjProps {
  supporter: Supporter;
  tier: string;
}

const SupportersListObj = (props: SupportersListObjProps) => {

    const date = new Date(props.supporter.timestamp).toLocaleDateString();

    return (
        <Card style={{ maxWidth: "30%", padding: "10px", position: "relative"}}>
            <h1>
                {props.tier}
            </h1>
            <h2>{props.supporter.message}</h2>
            <div style={{position: "absolute",bottom: "10px", right:"10px"}}>{date}</div>
            <div style={{position: "absolute", bottom: "10px"}}>
                <Owner id={props.supporter.supporterId} firstName={props.supporter.supporterFirstName} lastName={props.supporter.supporterLastName}/>
            </div>
        </Card>
    );
}

export default SupportersListObj;