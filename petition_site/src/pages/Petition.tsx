import { useParams } from "react-router-dom"
import Menu from "../Components/Menu"
import React from "react"
import axios from "axios"
import { usePetitionStore } from "../store"
import { Card, CardMedia } from "@mui/material"
import Owner from "../Components/OwnerDisplay"
import SupportTierList from "../Components/SupportTierList"
import SupportersList from "../Components/SupportersList"
import PetitionListObj from "../Components/petitionListObj"
import CSS from "csstype"


const Petition = () => {

    const {id} = useParams()
    
    const petitionImg = `http://localhost:4941/api/v1/petitions/${id}/image`

    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")

    const [petition, setPetition] = React.useState<Petition>()

    const categories = usePetitionStore(state => state.Categories)
    const setCategories = usePetitionStore(state => state.setCategories)

    const [catergory, setCategory] = React.useState<Catergory>({categoryId: 0, name: ""})

    const date = new Date(petition?.creationDate ?? 0).toLocaleDateString()

    const [similarPets, setSimilarPets] = React.useState<Petition[]>([])


    const card: CSS.Properties = {
        padding: "10px",
        margin: "20px",
        display: "inline-grid",
        width: "fit-content"
    }

    React.useEffect(() => {
        if (categories.length === 0) {
            axios.get("http://localhost:4941/api/v1/petitions/categories")
            .then(response => {
                setCategories(response.data)
            })
            .catch(error => {
                setErrorFlag(true)
                setErrorMessage(error.response.statusText)
            })
        }
    }, [setCategories, categories])

    React.useEffect(() => {
        axios.get(`http://localhost:4941/api/v1/petitions/${id}`)
        .then(response => {
            setPetition(response.data)
            setCategory(categories[response.data.categoryId])
        })
        .catch(error => {
            setErrorFlag(true)
            setErrorMessage(error.response.statusText)
        })
    }, [id, categories])

    React.useEffect(() => {
        if (petition?.categoryId === undefined) return;
        axios.get(`http://localhost:4941/api/v1/petitions`, {params: {categoryIds: [petition?.categoryId]}})
        .then(response => {
            setSimilarPets(response.data.petitions)
        })
        .catch(error => {
            setErrorFlag(true)
            setErrorMessage(error.response.statusText)
        })
    }, [petition?.categoryId])

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
            <Menu/>
            <div style={{display: "flex", justifyContent: "space-evenly", flexWrap: "wrap"}}>
                <Card style={{width: "50%", margin: "10px"}}>
                    <div style={{display: "flex", justifyContent: "center", alignItems: "center", height:"100%"}}>
                        <h1 >{petition?.title}</h1>
                    </div>
                </Card>
                <Card style={{width: "25%", margin: "10px"}}>
                    <CardMedia
                        component="img"
                        height="300"
                        image={petitionImg}
                        alt="Petition hero"
                    />
                </Card>
                <div style={{width: "50%", margin: "10px", padding:"10px"}}>
                    <Card>
                        <div>
                            <h2>Description</h2>
                            <p>{petition?.description}</p>
                        </div>
                    </Card>
                    <SupportersList petitionId={petition?.petitionId ?? 0} supportTiers={petition?.supportTiers ?? []}/>
                </div>
                <Card style={{width: "25%", margin: "20px"}}>
                    <div>
                        <h2>Category</h2>
                        <p>{catergory.name}</p>
                        <h2>Created on</h2>
                        <p>{date}</p>
                        <h2>Number of Supporters</h2>
                        <p>{petition?.numberOfSupporters}</p>
                        <h2>Total Money Raised</h2>
                        <p>{petition?.moneyRaised}</p>
                        <Owner id={petition?.ownerId ?? 0} firstName={petition?.ownerFirstName ?? ""} lastName={petition?.ownerLastName ?? ""}/>
                        <p></p>
                    </div>
                </Card>
                <div style={{width: "80%", margin: "10px"}}>
                    <SupportTierList supportTiers={petition?.supportTiers ?? []}/>
                </div>
            </div>
            <div>
                <h1>Similar Petitions</h1>
                <div>
                    {similarPets.map((petition) => {
                        return (
                            <Card elevation={3} style={card}>
                                <PetitionListObj petition={petition} key={petition.petitionId} catergories={categories} />
                            </Card>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default Petition