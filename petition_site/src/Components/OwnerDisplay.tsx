import { Link } from "@mui/material";
import CSS from 'csstype';
import URL from "../Constanats";

interface IOwnerProps {
    id: number,
    firstName: string,
    lastName: string
}

const Owner = (props: IOwnerProps) => {

    const userImageURL = URL+'/api/v1/users/' + props.id + '/image'

    const defaultUserImageURL = 'https://png.pngitem.com/pimgs/s/150-1503945_transparent-user-png-default-user-image-png-png.png'


    const onError = (e: any) => {
        console.log("setting default image")
        if (e.target.src === defaultUserImageURL) return;
        e.target.src = defaultUserImageURL
    }

    const imageCSS: CSS.Properties = {
        width: "50px", 
        height: "50px", 
        borderRadius: "50%", 
        display: "inline-block",
        objectFit: "cover"
    }

    return (
        <div>
            <Link color={"inherit"}>
                <img
                    height="50"
                    width="50"
                    style={imageCSS}
                    src={userImageURL}
                    alt="Petition hero"
                    onError={onError}
                />
                <div style={{display: "inline-block"}}>
                    <div>
                        {props.firstName.length > 15 ? props.firstName.substring(0, 15) + "..." : props.firstName}
                    </div>
                    <div>
                        {props.lastName.length > 15 ? props.lastName.substring(0, 15) + "..." : props.lastName}
                    </div>
                </div>
            </Link>
        </div>
    );
}


export default Owner;