import { useNavigate } from "react-router-dom";
import { usePageStore, usePetitionStore, useTokenStore } from "../store";
import { Autocomplete, Box, Button, Card, FormControl, InputAdornment, Modal, TextField, Typography } from "@mui/material";
import React from "react";
import CSS from 'csstype';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Menu from "../Components/Menu";
import SupportTierList from "../Components/SupportTierList";


const CreatePetition = () => {

    const userId = useTokenStore(state => state.userId);
    const loggedIn = useTokenStore(state => state.loggedIn);
    const nav = useNavigate();
    const setPage = usePageStore(state => state.setPrevPage);

    const catergories = usePetitionStore(state => state.Categories)

    
    if (!loggedIn) {
        setPage("/createPetition");
        nav("/login");
    }

    
    const [tiers, setTiers] = React.useState<Array<SupportTier>>([])
    const [tierTitle, setTierTitle] = React.useState("")
    const [tierDescription, setTierDescription] = React.useState("")
    const [tierCost, setTierCost] = React.useState(0)
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [errors, setErrors] = React.useState({title: false, description: false, cost: false})
    const [errorMsgs, setErrorMsgs] = React.useState({title: "Title already taken", description: "", cost: ""})
    const [addButton, setAddButton] = React.useState(true)

    const formCSS: CSS.Properties = {
        margin: "10px",
    }

    const tiersCSS: CSS.Properties = {
        margin: "10px",
        height: "350px",
        position: "relative"
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

      const modalCSS = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: "400",
        backgroundColor: 'background.paper',
        border: '2px solid #000',
        boxShadow: "24",
        p: 4,
      };

      const modalSubmit = () => {
        if (validateTier()) {
            setTiers([...tiers, {title: tierTitle, description: tierDescription, cost: tierCost, supportTierId: tiers.length}])
            handleClose()
            setErrorMsgs({title: "", description: "", cost: ""})
            setErrors({title: false, description: false, cost: false})
            setTierCost(0)
            setTierDescription("")
            setTierTitle("")
        }
      }

      const validateTier = () => {
        if (tiers.find(tier => tier.title === tierTitle) !== undefined) {
            setErrors({...errors, title: true})
            setErrorMsgs({...errorMsgs, title: "Title already taken"})
            return false
        }
        if (tierTitle === "") {
            setErrors({...errors, title: true})
            setErrorMsgs({...errorMsgs, title: "Title cannot be empty"})
            return false
        }
        if (tierDescription === "") {
            setErrors({...errors, description: true})
            setErrorMsgs({...errorMsgs, description: "Description cannot be empty"})
            return false
        }
        return true
      }


    return (
        <div>
            <Menu />
            <h1>Create Petition</h1>
            <FormControl style={{width: "50%"}}>
                <TextField id="title" label="Title" variant="outlined" style={formCSS}/>
                <TextField id="description" label="Description" variant="outlined" style={formCSS}/>
                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={catergories}
                    getOptionLabel={(option) => option.name}
                    sx={{ width: 300 }}
                    style={formCSS}
                    renderInput={(params) => <TextField {...params} label="Catergories" />}
                />
                <h2>Add support tiers</h2>
                <div style={tiersCSS}>
                    <Button disabled={tiers.length >= 3} onClick={handleOpen} variant="contained" style={{right: "10px", top: "30px", position: "absolute"}}>Add Tier</Button>
                    <SupportTierList supportTiers={tiers} />
                </div>
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
                            <input style={inputCSS} id="image" accept="image/png, image/jpeg, image/gif" type="file" />
                    </Button>

                </div>
            </FormControl>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalCSS}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Add Support Tier
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        <FormControl>
                            <TextField 
                                value={tierTitle} 
                                onChange={(e) => {setTierTitle(e.target.value)}}
                                id="title" 
                                label="Title" 
                                variant="outlined" 
                                style={formCSS}
                                error={errors.title}
                                helperText={errors.title ? errorMsgs.title : ""}
                                />
                            <TextField 
                                id="description" 
                                label="Description" 
                                variant="outlined" 
                                style={formCSS}
                                value={tierDescription}
                                onChange={(e) => {setTierDescription(e.target.value)}}
                                error={errors.description}
                                />
                            <TextField 
                                id="cost" 
                                label="Cost" 
                                variant="outlined" 
                                style={formCSS} 
                                value={tierCost}
                                onChange={(e) => {setTierCost(parseInt(e.target.value))}}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                }}
                                type='number'
                                error={errors.cost}
                            />
                            <Button onClick={modalSubmit} variant="contained" style={{width: "50%", margin: "auto"}}>Add Tier</Button>
                        </FormControl>
                    </Typography>
                </Box>
            </Modal>
        </div>
    )
}

export default CreatePetition;