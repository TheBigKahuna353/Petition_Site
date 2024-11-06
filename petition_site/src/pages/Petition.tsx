import { useParams } from "react-router-dom"
import Menu from "../Components/Menu"
import React from "react"
import axios from "axios"
import { usePageStore, usePetitionStore, useTokenStore } from "../store"
import { Alert, Box, Button, Card, CardMedia, FormControl, FormHelperText, IconButton, InputLabel, MenuItem, Modal, Select, Snackbar, TextField, Typography } from "@mui/material"
import Owner from "../Components/OwnerDisplay"
import SupportTierList from "../Components/SupportTierList"
import SupportersList from "../Components/SupportersList"
import PetitionListObj from "../Components/petitionListObj"
import CSS from "csstype"
import CloseIcon from '@mui/icons-material/Close';
import URL from "../Constanats"


const Petition = () => {

    const {id} = useParams()
    
    const petitionImg = `URL/api/v1/petitions/${id}/image`

    const [tierError, setTierError] = React.useState("")

    const [petition, setPetition] = React.useState<Petition>()

    const categories = usePetitionStore(state => state.Categories)
    const setCategories = usePetitionStore(state => state.setCategories)

    const [catergory, setCategory] = React.useState<Catergory>({categoryId: 0, name: ""})

    const date = new Date(petition?.creationDate ?? 0).toLocaleDateString()
    const [update, setUpdate] = React.useState(0)

    const [similarPets, setSimilarPets] = React.useState<Petition[]>([])

    const [openSupport, setOpenSupport] = React.useState(false)
    const [tier, setTier] = React.useState(0)
    const [message, setMessage] = React.useState("")

    const token = useTokenStore(state => state.token)
    const userId = useTokenStore(state => state.userId)
    const setPage = usePageStore(state => state.setPrevPage)

    const [openSB, setOpenSB] = React.useState(false)
    const handleClose = (event?: any, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSB(false);
    };
    const [SBerror, setSBerror] = React.useState("")

    const card: CSS.Properties = {
        padding: "10px",
        margin: "20px",
        display: "inline-grid",
        width: "fit-content"
    }

    React.useEffect(() => {
        if (categories.length === 0) {
            axios.get(URL+"/api/v1/petitions/categories")
            .then(response => {
                setCategories(response.data)
            })
            .catch(error => {
                setOpenSB(true)
                setSBerror(error.response.statusText)
            })
        }
    }, [setCategories, categories])

    React.useEffect(() => {
        axios.get(`${URL}/api/v1/petitions/${id}`)
        .then(response => {
            setPetition(response.data)
            setCategory(categories.find((cat) => cat.categoryId === response.data.categoryId) ?? {categoryId: 0, name: ""})
        })
        .catch(error => {
            setOpenSB(true)
            setSBerror(error.response.statusText)
        })
    }, [id, categories])

    React.useEffect(() => {
        if (petition?.categoryId === undefined) return;
        axios.get(`${URL}/api/v1/petitions`, {params: {categoryIds: [petition?.categoryId]}})
        .then(response => {
            const sameCat = response.data.petitions.filter((pet: Petition) => pet.petitionId !== petition?.petitionId)
            console.log(sameCat)

            axios.get(`${URL}/api/v1/petitions`, {params: {ownerId: petition?.ownerId}})
            .then(response => {
                const sameOwner = response.data.petitions.filter((pet: Petition) => pet.petitionId !== petition?.petitionId)
                console.log(sameOwner)
                setSimilarPets([...sameCat, ...sameOwner])
            })
            .catch(error => {
                setOpenSB(true)
                setSBerror(error.response.statusText)
            })
        })
        .catch(error => {
            setOpenSB(true)
            setSBerror(error.response.statusText)
        })
    }, [petition?.categoryId, petition?.petitionId, petition?.ownerId])


    const handleSupport = () => {
        if (tier === 0) {
            setTierError("Please select a tier")
            return
        }
        setOpenSupport(false)
        axios.post(`${URL}/api/v1/petitions/${id}/supporters`, {
                supportTierId: tier, 
                ...(message !== "" && {message: message})}, 
            {headers: {
                "X-Authorization": token
            }})
        .then(response => {
            console.log(response)
            setOpenSB(true)
            setUpdate(update + 1)
        })
        .catch(error => {
            setOpenSB(true)
            setSBerror(error.response.statusText)
        })
    }

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

    const margin: CSS.Properties = {
        margin: "20px"
      }

    const clickSupport = () => {
        if (!token) {
            setPage(window.location.pathname)
            window.location.href = "/login"
        }
        setOpenSupport(true)
        setTier(0)
        setTierError("")
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
                    <SupportersList petitionId={petition?.petitionId ?? 0} supportTiers={petition?.supportTiers ?? []} update={update}/>
                </div>
                <Card style={{width: "25%", margin: "20px", height: "500px"}}>
                    <div>
                        <h2>Category</h2>
                        <p>{catergory.name}</p>
                        <h2>Created on</h2>
                        <p>{date}</p>
                        <h2>Number of Supporters</h2>
                        <p>{petition?.numberOfSupporters}</p>
                        <h2>Total Money Raised</h2>
                        <p>{"$" + (petition?.moneyRaised || "0")}</p>
                        <Owner id={petition?.ownerId ?? 0} firstName={petition?.ownerFirstName ?? ""} lastName={petition?.ownerLastName ?? ""}/>
                        <p></p>
                    </div>
                </Card>
                <div style={{width: "70%", margin: "10px"}}>
                    <SupportTierList supportTiers={petition?.supportTiers ?? []}/>
                </div>
            </div>
            <Button 
                variant="contained" 
                style={{margin: "40px"}} 
                onClick={clickSupport}
                disabled={userId === petition?.ownerId}
            >
                Support
            </Button>
            <div>
                <h1>Similar Petitions</h1>
                <div>
                    {similarPets.map((petition) => {
                        return (
                            <Card elevation={3} style={card}>
                                <PetitionListObj petition={petition} key={petition.petitionId} catergories={categories}/>
                            </Card>
                        )
                    })}
                </div>
            </div>
            <Modal
                open={openSupport}
                onClose={() => setOpenSupport(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalCSS}>
                    <IconButton
                        size="small"
                        aria-label="close"
                        color="inherit"
                        style={{float: "right"}}
                        onClick={() => setOpenSupport(false)}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Support
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        <FormControl fullWidth style={{position:"relative"}}>
                            <div style={margin}>
                                <InputLabel style={margin} id="demo-simple-select-label">Tier</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={tier}
                                    error={tierError !== ""}
                                    required    
                                    sx={{width: "100%"}}
                                    label="Tier"
                                    onChange={(e) => setTier(e.target.value as number)}
                                >
                                    {petition?.supportTiers.map((tier) => {
                                        return (
                                            <MenuItem key={Date.now()}value={tier.supportTierId}>{tier.title + " - $" + tier.cost}</MenuItem>
                                        )
                                    })}
                                </Select>
                                {tierError !== "" ? <FormHelperText error margin="dense">{tierError}</FormHelperText> : ""}
                            </div>
                            <TextField
                                id="message"
                                label="Message"
                                sx={margin}
                                multiline
                                rows={4}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                            <Button
                                variant="contained"
                                onClick={handleSupport}
                                style={{display: "block", margin: "20px"}}
                            >
                                Support
                            </Button>
                            <Button
                                variant="contained"
                                onClick={() => setOpenSupport(false)}
                                style={{display: "block", margin: "20px"}}
                            >
                                Cancel
                            </Button>
                        </FormControl>
                    </Typography>
                </Box>
            </Modal>
            <Snackbar open={openSB} autoHideDuration={6000} onClose={handleClose}>
                <Alert
                    onClose={handleClose}
                    severity={SBerror === "" ? "success" : "error"}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {SBerror === "" ? "Success" : SBerror}
                </Alert>
            </Snackbar>
        </div>
    )
}

export default Petition