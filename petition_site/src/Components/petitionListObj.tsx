import React from "react"
import CSS from 'csstype';
import { Card, CardMedia } from "@mui/material";
import Owner from "./OwnerDisplay";
import OptionsMenu from "./OptionsMenu";

interface IPetitionProps {
    petition : Petition,
    catergories : Array<Catergory>,
    editDelete?: boolean,
    editCallback?: (id: number) => void,
    deleteCallback?: (id: number) => void
}

const PetitionListObj = (props: IPetitionProps) => {

    const petition = props.petition

    const imageURL = 'http://localhost:4941/api/v1/petitions/' + petition.petitionId + '/image'


    const date = new Date(petition.creationDate).toLocaleDateString()


    const catergory = props.catergories.find((cat) => cat.categoryId === petition.categoryId)?.name

    const imageCard: CSS.Properties = {
        display: "block",
        width: "300px",
        margin: "10px",
        padding: "20px",
        backgroundColor: "F19782",
        color: "success.main"
    }

    const DataCard: CSS.Properties = {
        display: "block",
        height: "100px",
        width: "300px",
        margin: "10px",
        padding: "20px",
    }

    const dateCSS: CSS.Properties = {
        top: "0",
        left: "0",
        position: "absolute"
    }

    const ownerCSS: CSS.Properties = {
        bottom: "0",
        left: "0",
        position: "absolute"
    }

    const costCSS: CSS.Properties = {
        bottom: "0",
        right: "0",
        position: "absolute"
    }

    const catCSS: CSS.Properties = {
        top: "0",
        right: "0",
        position: "absolute"
    }


    return (
        <div>
            {props.editDelete && <OptionsMenu 
                id={petition.petitionId}
                editCallback={props.editCallback}
                deleteCallback={props.deleteCallback}
            />}
                            
            <a href={'/petitions/' + petition.petitionId} style={{textDecoration: "none"}}>
                <Card sx={imageCard} ha-card-background={"F19782"}>
                    <CardMedia
                        component="img"
                        height="200"
                        width="200"
                        sx={{objectFit:"cover"}}
                        image={imageURL}
                        alt="Petition hero"
                    />
                </Card>
                <Card sx={DataCard}>
                    <div>
                        <h2>{petition.title}</h2>
                    </div>
                </Card>
                <Card sx={DataCard}>
                    <div style={{position: "relative", height: "100%"}}>
                        <div style={dateCSS}>
                            {date}
                        </div>
                        <div style={catCSS}>
                            {catergory}
                        </div>
                        <div style={ownerCSS}>
                            <Owner id={petition.ownerId} firstName={petition.ownerFirstName} lastName={petition.ownerLastName}/>
                        </div>
                        <div style={costCSS}>
                            <h3>
                                $
                                {petition.supportingCost}
                            </h3>
                        </div>
                    </div>
                </Card>
            </a>
        </div>
    )
}

export default PetitionListObj;