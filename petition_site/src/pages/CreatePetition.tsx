import { useNavigate } from "react-router-dom";
import { usePageStore, usePetitionStore, useTokenStore } from "../store";
import { Autocomplete, Button, FormControl, IconButton, Snackbar, TextField } from "@mui/material";
import React from "react";
import CSS from 'csstype';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Menu from "../Components/Menu";
import TierCreator from "../Components/TierCreator";
import axios from "axios";
import CloseIcon from '@mui/icons-material/Close';
import URL from "../Constanats";


const CreatePetition = () => {

    const token = useTokenStore(state => state.token);
    const loggedIn = useTokenStore(state => state.loggedIn);
    const nav = useNavigate();
    const setPage = usePageStore(state => state.setPrevPage);

    const catergories = usePetitionStore(state => state.Categories)

    
    if (!loggedIn) {
        setPage("/createPetition");
        nav("/login");
    }
    const [networkError, setNetworkError] = React.useState("")
    
    const [tiers, setTiers] = React.useState<Array<SupportTier>>([])
    const [image, setImage] = React.useState<File>()
    const [title, setTitle] = React.useState<string>("")
    const [description, setDescription] = React.useState<string>("")
    const [category, setCategory] = React.useState<Catergory>({categoryId: -1, name: ""})
    const [errorsPet , setErrorsPet] = React.useState({title: false, desc: false, cats: false, tiers: false, image: false})
    const [errorMessagesPet, setErrorMessagesPet] = React.useState({title: "", desc: "", cats: "", tiers: "", image: ""})

    const formCSS: CSS.Properties = {
        margin: "10px",
    }


    const inputCSS: CSS.Properties = {
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: "1",
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: "1",
      }

      const setTiersHandler = (tiers: Array<SupportTier>) => {
        setTiers(tiers)
        setErrorMessagesPet({...errorMessagesPet, tiers: ""})
        setErrorsPet({...errorsPet, tiers: false})
      }

      const validate = () => {
        let hasError = false
        let errors = {title: false, desc: false, cats: false, tiers: false, image: false}
        let errorMessages = {title: "", desc: "", cats: "", tiers: "", image: ""}
        if (title === "") {
            errors.title = true
            errorMessages.title = "Title cannot be empty"
            hasError = true
        }
        if (title.length > 128) {
            errors.title = true
            errorMessages.title = "Title cannot be longer than 128 characters"
            hasError = true
        }
        if (description === "") {
            errors.desc = true
            errorMessages.desc = "Description cannot be empty"
            hasError = true
        }
        if (description.length > 1024) {
            errors.desc = true
            errorMessages.desc = "Description cannot be longer than 2048 characters"
            hasError = true
        }
        if (category.categoryId === -1) {
            errors.cats = true
            errorMessages.cats = "Category cannot be empty"
            hasError = true
        }
        if (tiers.length === 0) {
            errors.tiers = true
            errorMessages.tiers = "Tiers cannot be empty"
            hasError = true
        }
        if (!image) {
            errors.image = true
            errorMessages.image = "Image cannot be empty"
            hasError = true
        }
        console.log(category)
        setErrorsPet(errors)
        setErrorMessagesPet(errorMessages)
        return !hasError

      }

      const submit = () => {
            if (validate()) {
                const data = {
                        title: title,
                        description: description,
                        categoryId: category.categoryId,
                        supportTiers: tiers
                }
                console.log(data)
                axios.post(URL+"/api/v1/petitions", data, {headers: {"X-Authorization": token} })
                .then((res) => {
                    const filetype = image?.type.split("/")[1]
                    axios.put(URL+"/api/v1/petitions/" + res.data.petitionId + "/image", image, {headers: {
                        "X-Authorization": token,
                        "Content-Type": "image/" + filetype}})
                    .then(() => {
                        nav("/myPetitions")
                    })
                }, (error) => {
                    setNetworkError(error.response.statusText)
                    console.error(error)
                })
            }
      }

    const titleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value)
        setErrorsPet({...errorsPet, title: false})
        setErrorMessagesPet({...errorMessagesPet, title: ""})
    }

    const DescChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDescription(e.target.value)
        setErrorsPet({...errorsPet, desc: false})
        setErrorMessagesPet({...errorMessagesPet, desc: ""})
    }

    const catChange = (event: any, newValue: Catergory | null) => {
        if (newValue) { 
            const newCategory = catergories.find((cat) => cat.name === newValue.name) as Catergory
            console.log(newCategory)
            console.log(catergories)
            setCategory(newCategory)
            setErrorsPet({...errorsPet, cats: false})
            setErrorMessagesPet({...errorMessagesPet, cats: ""})
        }
    }

    const imageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImage(e.target.files[0])
            setErrorsPet({...errorsPet, image: false})
            setErrorMessagesPet({...errorMessagesPet, image: ""})
        }
    }

    const action = (
        <React.Fragment>
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={() => setNetworkError("")}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </React.Fragment>
      );
        

    return (
        <div>
            <Menu />
            <h1>Create Petition</h1>
            <FormControl style={{width: "50%"}}>
                <TextField 
                    id="title" 
                    value={title} 
                    onChange={titleChange} 
                    label="Title" 
                    variant="outlined" 
                    error={errorsPet.title}
                    helperText={errorMessagesPet.title}
                    style={formCSS}/>
                <TextField 
                    id="description" 
                    value={description} 
                    onChange={DescChange} 
                    label="Description" 
                    variant="outlined" 
                    error={errorsPet.desc}
                    helperText={errorMessagesPet.desc}
                    style={formCSS}/>
                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={catergories}
                    onChange={catChange}
                    getOptionLabel={(option) => option.name}
                    sx={{ width: 300 }}
                    style={formCSS}
                    renderInput={(params) => (
                        <TextField
                             {...params} 
                             label="Catergory" 
                             error={errorsPet.cats}
                            helperText={errorMessagesPet.cats}
                        />
                    )}
                />
                <TierCreator tiers={tiers} setTiers={setTiersHandler}/>
                {errorsPet.tiers && <p style={{color: "red"}}>{errorMessagesPet.tiers}</p>}
                <div>
                    <Button
                        component="label"
                        style={{width: "20%", marginRight: "10px"}}
                        role={undefined}
                        variant="contained"
                        tabIndex={-1}
                        startIcon={<CloudUploadIcon />}
                        >
                            Upload file
                            <input onChange={imageChange} style={inputCSS} id="image" accept="image/png, image/jpeg, image/gif" type="file" />
                    </Button>
                    {errorsPet.image ? 
                    <p style={{color: "red", display:"inline"}}>{errorMessagesPet.image}</p>
                    :
                    <p style={{color: "green", display:"inline"}}>{image?.name}</p>}
                </div>
                <Button onClick={submit} variant="contained" style={{width: "20%", margin: "auto", marginTop: "30px"}}>Create</Button>
            </FormControl>
            <Snackbar
                open={networkError !== ""}
                autoHideDuration={6000}
                onClose={() => setNetworkError("")}
                message={"Network Error, " + networkError}
                action={action}
            />
        </div>
    )
}

export default CreatePetition;