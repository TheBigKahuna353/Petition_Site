import React from "react"
import { useTokenStore } from "../store"
import axios from "axios"


const User = () => {

    const userId = useTokenStore(state => state.userId)

    if (!userId) {
        window.location.href = '/login'
    }

    const [user, setUser] = React.useState<User>()
    React.useEffect(() => {
        axios.get('http://localhost:4941/api/v1/users/' + userId, { headers: {
            "X-Authorization": useTokenStore.getState().token
        }})
        .then(response => {
            setUser(response.data)
        })
        .catch(error => {
            console.log("error in user")
        })
    }, [userId])

    const imageURL = 'http://localhost:4941/api/v1/users/' + userId + '/image'

    const defaultUserImageURL = 'https://png.pngitem.com/pimgs/s/150-1503945_transparent-user-png-default-user-image-png-png.png'
    

    const onError = (e: any) => {
        console.log("setting default image")
        if (e.target.src === defaultUserImageURL) return;
        e.target.src = defaultUserImageURL
    }

    return (
        <div>
            <h1>User {userId}</h1>
            <img src={imageURL} onError={onError} alt="user" />
            <div>
                <div>{user?.firstName}</div>
                <div>{user?.lastName}</div>
                <div>{user?.email}</div>
            </div>
        </div>
    )
}

export default User