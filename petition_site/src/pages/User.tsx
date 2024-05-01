import { useParams } from "react-router-dom"


const User = () => {

    const {id} = useParams()
    const imageURL = 'http://localhost:4941/api/v1/users/' + id + '/image'
    
    return (
        <div>
            <h1>User {id}</h1>
            <img src={imageURL} alt="user" />
        </div>
    )
}

export default User