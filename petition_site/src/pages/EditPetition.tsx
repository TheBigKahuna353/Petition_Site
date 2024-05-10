import { useNavigate, useParams } from "react-router-dom";
import { usePageStore, usePetitionStore, useTokenStore } from "../store";
import { Autocomplete, Button, FormControl, IconButton, Snackbar, TextField } from "@mui/material";
import React from "react";
import CSS from 'csstype';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Menu from "../Components/Menu";
import TierCreator from "../Components/TierCreator";
import axios from "axios";
import CloseIcon from '@mui/icons-material/Close';


const EditPetition = () => {

    const {id} = useParams();

    const token = useTokenStore(state => state.token);
    const loggedIn = useTokenStore(state => state.loggedIn);
    const nav = useNavigate();
    const setPage = usePageStore(state => state.setPrevPage);


    const catergories = usePetitionStore(state => state.Categories)
    
    if (!loggedIn) {
        setPage("/editPetition");
        nav("/login");
    }
    const [networkError, setNetworkError] = React.useState(false)

    const [updatedOpen, setUpdatedOpen] = React.useState(false)
    
    const [tiers, setTiers] = React.useState<Array<SupportTier>>([])
    const [image, setImage] = React.useState<File>()
    const [title, setTitle] = React.useState<string>("")
    const [description, setDescription] = React.useState<string>("")
    const [category, setCategory] = React.useState<Catergory>({categoryId: -1, name: ""})
    const [errorsPet , setErrorsPet] = React.useState({title: false, desc: false, cats: false, tiers: false, image: false})
    const [errorMessagesPet, setErrorMessagesPet] = React.useState({title: "", desc: "", cats: "", tiers: "", image: ""})
    const [supportedTiers, setSupportedTiers] = React.useState([])

    const formCSS: CSS.Properties = {
        margin: "10px",
    }

    React.useEffect(() => {
        axios.get("http://localhost:4941/api/v1/petitions/" + id)
        .then((res) => {
            const petition = res.data
            setTitle(petition.title)
            setDescription(petition.description)
            setCategory({categoryId: petition.categoryId, name: catergories.find((cat) => cat.categoryId === petition.categoryId)?.name || ""})
            setTiers(petition.supportTiers)
            axios.get("http://localhost:4941/api/v1/petitions/" + id + "/image")
            .then((res) => {
                setImage(res.data)
            }, (error) => {
            })

        }, (error) => {
            setNetworkError(true)
        })
        axios.get("http://localhost:4941/api/v1/petitions/" + id + "/supporters")
        .then((res) => {
            setSupportedTiers(res.data)
        }, (error) => {
            setNetworkError(true)
        })
    }, [id, catergories, tiers])

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
        setErrorsPet(errors)
        setErrorMessagesPet(errorMessages)
        return !hasError
      }

    const deleteTier = (Tid: number) => {
        axios.delete("http://localhost:4941/api/v1/petitions/" + id + "/supportTiers/" + Tid, {headers: {
            "X-Authorization": token
        }}).catch((error) => {
            setNetworkError(true)
        })
    }

    const editTier = (tier: SupportTier) => {
        axios.patch("http://localhost:4941/api/v1/petitions/" + id + "/supportTiers/" + tier.supportTierId, tier, {headers: {
            "X-Authorization": token
        }}).catch((error) => {
            setNetworkError(true)
            console.error(error)
        })
    }

    const addTier = (tier: SupportTier) => {
        axios.put("http://localhost:4941/api/v1/petitions/" + id + "/supportTiers", tier, {headers: {
            "X-Authorization": token
        }}).then((res) => {
            setTiers([...tiers, res.data])
        }, (error) => {
            setNetworkError(true)
            console.error(error)

        })
    }


      const submit = () => {
            if (validate()) {
                const data = {
                        title: title,
                        description: description,
                        categoryId: category.categoryId,
                }
                axios.put("http://localhost:4941/api/v1/petitions", data, {headers: {"X-Authorization": token} })
                .then((res) => {
                    setUpdatedOpen(true)
                }, (error) => {
                    setNetworkError(true)
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
            setCategory(newValue)
            setErrorsPet({...errorsPet, cats: false})
            setErrorMessagesPet({...errorMessagesPet, cats: ""})
        }
    }

    const imageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            axios.put("http://localhost:4941/api/v1/petitions/" + id + "/image", e.target.files[0], {headers: {
                "X-Authorization": token,
                "Content-Type": e.target.files[0].type}}
            ).then(() => {
                if (e.target.files) {
                    setImage(e.target.files[0])
                    window.location.reload();
                }
            }, (error) => {
                setNetworkError(true)
                console.log(error)
            })
        }
    }

    const action = (
        <React.Fragment>
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={() => setNetworkError(false)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </React.Fragment>
      );
        

    return (
        <div>
            <Menu />
            <h1>Edit Petition</h1>
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
                    value={category}
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
                <Button onClick={submit} variant="contained" style={{width: "20%", margin: "auto", marginTop: "30px"}}>Save</Button>
                <TierCreator 
                    tiers={tiers} 
                    setTiers={setTiersHandler} 
                    supportedTiers={supportedTiers}
                    addCallback={addTier}
                    editCallback={editTier}
                    delteCallback={deleteTier}
                />
                {errorsPet.tiers && <p style={{color: "red"}}>{errorMessagesPet.tiers}</p>}
                <div>
                    <Button
                        component="label"
                        style={{width: "200px", marginRight: "10px"}}
                        role={undefined}
                        variant="contained"
                        tabIndex={-1}
                        startIcon={<CloudUploadIcon />}
                        >
                            Upload file
                            <input onChange={imageChange} style={inputCSS} id="image" accept="image/png, image/jpeg, image/gif" type="file" />
                    </Button>
                    <Button 
                    onClick={() => nav("/myPetitions")} 
                    variant="contained" 
                    style={{width: "200px"}}>Back</Button>
                </div>
            </FormControl>
            <img src={"http://localhost:4941/api/v1/petitions/" + id + "/image"} key={Date.now()} alt="Petition" style={{width: "200px", height: "200px"}}/>
            <Snackbar
                open={networkError}
                autoHideDuration={6000}
                onClose={() => setNetworkError(false)}
                message="Network Error, please try again later"
                action={action}
            />
            <Snackbar
                open={updatedOpen}
                autoHideDuration={6000}
                onClose={() => setUpdatedOpen(false)}
                message="Updated Successfully"
                action={action}
            />
        </div>
    )
}

export default EditPetition;