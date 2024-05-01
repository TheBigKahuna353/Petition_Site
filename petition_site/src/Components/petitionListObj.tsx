import React from "react"
import CSS from 'csstype';
import { Card, CardMedia, Link } from "@mui/material";

interface IPetitionProps {
    petition : Petition,
    catergories : Array<Catergory>
}

const PetitionListObj = (props: IPetitionProps) => {

    const petition = props.petition

    const imageURL = 'http://localhost:4941/api/v1/petitions/' + petition.petitionId + '/image'

    const userImageURL = 'http://localhost:4941/api/v1/users/' + petition.ownerId + '/image'

    const defaultUserImageURL = 'https://png.pngitem.com/pimgs/s/150-1503945_transparent-user-png-default-user-image-png-png.png'


    const date = new Date(petition.creationDate).toLocaleDateString()

    const onError = (e: any) => {
        console.log("setting default image")
        if (e.target.src === defaultUserImageURL) return;
        e.target.src = defaultUserImageURL
    }

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

    const imageCSS: CSS.Properties = {
        width: "50px", 
        height: "50px", 
        borderRadius: "50%", 
        display: "inline-block"
    }

    return (
        <Link href={'/petitions/' + petition.petitionId}>
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
                        <Link href={"/users/" + petition.ownerId}>
                            <CardMedia
                                component="img"
                                height="50"
                                width="50"
                                sx={imageCSS}
                                image={userImageURL}
                                alt="Petition hero"
                                onError={onError}
                            />
                        </Link>
                        <div style={{display: "inline-block"}}>
                            <div>
                                {petition.ownerFirstName}
                            </div>
                            <div>
                                {petition.ownerLastName}
                            </div>
                        </div>
                    </div>
                    <div style={costCSS}>
                        <h3>
                            $
                            {petition.supportingCost}
                        </h3>
                    </div>
                </div>
            </Card>
        </Link>
    )
}

export default PetitionListObj;