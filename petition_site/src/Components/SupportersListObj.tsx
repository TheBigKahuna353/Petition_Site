import { Box, Card, IconButton, Modal } from "@mui/material";
import Owner from "./OwnerDisplay";
import React from "react";
import CloseIcon from '@mui/icons-material/Close';

interface SupportersListObjProps {
  supporter: Supporter;
  tier: string;
}

const SupportersListObj = (props: SupportersListObjProps) => {

    const date = new Date(props.supporter.timestamp).toLocaleDateString();


    let shortenedMessage = "";
    let tooLong = false;
    if (props.supporter.message !== null) {
        tooLong = props.supporter.message.length > 200;
        shortenedMessage = tooLong === true ? props.supporter.message.substring(0, 200) + "..." : props.supporter.message;
    } else {
        shortenedMessage = "";
    }
    const [open, setOpen] = React.useState(false);

    const modalCSS = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: "500px",
        backgroundColor: 'background.paper',
        border: '2px solid #000',
        boxShadow: "24",
        p: 4,
    };

    const pBot = tooLong === true ? "70px" : "50px";

    return (
        <div style={{maxWidth: "30%"}}>
            <div style={{height:"80%"}}>
                <Card style={{padding: "10px", paddingBottom: pBot, minWidth:"220px",height:"100%", position: "relative"}}>
                    <h1>
                        {props.tier}
                    </h1>
                    <h2>
                        {shortenedMessage}
                        {tooLong === true ? <button onClick={() => setOpen(true)}>Read More</button> : null}
                    </h2>
                    <div style={{position: "absolute",bottom: "10px", right:"10px"}}>{date}</div>
                    <div style={{position: "absolute", bottom: "10px"}}>
                        <Owner id={props.supporter.supporterId} firstName={props.supporter.supporterFirstName} lastName={props.supporter.supporterLastName}/>
                    </div>
                </Card>
                <Modal
                    open={open}
                    onClose={() => setOpen(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={modalCSS}>
                        <IconButton
                            size="small"
                            aria-label="close"
                            color="inherit"
                            style={{float: "right"}}
                            onClick={() => setOpen(false)}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                        <h2>{props.tier}</h2>
                        <h3>{props.supporter.message}</h3>
                        <h4>{date}</h4>
                        <Owner id={props.supporter.supporterId} firstName={props.supporter.supporterFirstName} lastName={props.supporter.supporterLastName}/>
                    </Box>
                </Modal>
            </div>
        </div>
    );
}

export default SupportersListObj;