import React from "react"
import PetitionList from "../Components/petitionList"
import Menu  from "../Components/Menu"


const Petitions = () => {

    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")

    
    if (errorFlag) {
        return (
            <div>
                <h1>Error</h1>
                <p>{errorMessage}</p>
            </div>
        )
    }

    return (
        <div>
            <Menu />
            <PetitionList setErrorFlag={setErrorFlag} setErrorMessage={setErrorMessage} />
        </div>
    )
}


export default Petitions;