import { useParams } from "react-router-dom"
import Menu from "../Components/Menu"


const Petition = () => {

    const {id} = useParams()
    console.log(id)
    return (
        <div>
            <Menu/>
            <h1>Petition {id}</h1>
        </div>
    )
}

export default Petition