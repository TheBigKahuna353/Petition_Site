import { Link } from "@mui/material";
import CSS from 'csstype';

interface IOwnerProps {
    id: number,
    firstName: string,
    lastName: string
}

const Owner = (props: IOwnerProps) => {

    const userImageURL = 'http://localhost:4941/api/v1/users/' + props.id + '/image'

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
                        {props.firstName}
                    </div>
                    <div>
                        {props.lastName}
                    </div>
                </div>
            </Link>
        </div>
    );
}


export default Owner;