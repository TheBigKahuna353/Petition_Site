import { useNavigate } from "react-router-dom";
import { usePageStore, usePetitionStore, useTokenStore } from "../store";
import { Autocomplete, Button, FormControl, TextField } from "@mui/material";
import React from "react";
import CSS from 'csstype';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Menu from "../Components/Menu";
import TierCreator from "../Components/TierCreator";
import { error } from "console";


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

      const validate = () => {
        let hasError = false
        let errors = {title: false, desc: false, cats: false, tiers: false, image: false}
        let errorMessages = {title: "", desc: "", cats: "", tiers: "", image: ""}
        if (title === "") {
            errors.title = true
            errorMessages.title = "Title cannot be empty"
            hasError = true
        }
        if (description === "") {
            errors.desc = true
            errorMessages.desc = "Description cannot be empty"
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
                        supportTiers: tiers,
                        image: image
                }
                console.log(data)
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
            setCategory(newValue)
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
                             label="Catergories" 
                             error={errorsPet.cats}
                            helperText={errorMessagesPet.cats}
                        />
                    )}
                />
                <TierCreator tiers={tiers} setTiers={setTiers}/>
                <div>
                    <Button
                        component="label"
                        style={{width: "20%"}}
                        role={undefined}
                        variant="contained"
                        tabIndex={-1}
                        startIcon={<CloudUploadIcon />}
                        >
                            Upload file
                            <input onChange={imageChange} style={inputCSS} id="image" accept="image/png, image/jpeg, image/gif" type="file" />
                    </Button>
                </div>
                <Button onClick={submit} variant="contained" style={{width: "20%", margin: "auto", marginTop: "30px"}}>Create</Button>
            </FormControl>
        </div>
    )
}

export default CreatePetition;