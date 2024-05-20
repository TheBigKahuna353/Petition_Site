import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, IconButton, InputAdornment, Modal, TextField, Typography } from '@mui/material';
import React from 'react';
import SupportTierList from './SupportTierList';
import CSS from 'csstype';
import CloseIcon from '@mui/icons-material/Close';

interface tiers {
    tiers: SupportTier[],
    setTiers: (SupportTier: SupportTier[]) => void,
    supportedTiers?: {supportTierId: number}[],
    editCallback?: (tier: SupportTier) => void,
    delteCallback?: (id: number) => void,
    addCallback?: (tier: SupportTier) => void
}

const defaultErrors = {title: "", description: "", cost: ""}

const TierCreator = (props: tiers) => {

    const {tiers, setTiers} = props
    const [tierTitle, setTierTitle] = React.useState("")
    const [tierDescription, setTierDescription] = React.useState("")
    const [tierCost, setTierCost] = React.useState(0)
    // create modal
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    // edit modal
    const [editId, setEditId] = React.useState(-1)
    const [openEdit, setOpenEdit] = React.useState(false);
    const handleOpenEdit = () => setOpenEdit(true);
    const handleCloseEdit = () => setOpenEdit(false);
    // delete modal
    const [openDel, setOpenDel] = React.useState(false);
    const handleOpenDel = () => setOpenDel(true);
    const handleCloseDel = () => setOpenDel(false);

    // has supporters modal
    const [openSupporters, setOpenSupporters] = React.useState(false);
    const handleOpenSupporters = () => setOpenSupporters(true);
    const handleCloseSupporters = () => setOpenSupporters(false);

    const [errors, setErrors] = React.useState(defaultErrors)

    const validateTier = () => {
        let passed = true
        let newErrors = {title: "", description: "", cost: ""}
        if (tiers.find(tier => {
                if (editId === tier.supportTierId) {
                    return false
                }
                return tier.title === tierTitle}) !== undefined) {
            newErrors.title = "Title already exists"
            passed = false
        }
        if (tierTitle === "") {
            newErrors.title = "Title cannot be empty"
            passed = false
        }
        if (tierDescription === "") {
            newErrors.description = "Description cannot be empty"
            passed = false
        }
        setErrors(newErrors)
        return passed
      }


    const modalSubmit = () => {
        if (validateTier()) {
            setTiers([...tiers, {title: tierTitle, description: tierDescription, cost: tierCost, supportTierId: tiers.length}])
            handleClose()
            setErrors(defaultErrors)
            setTierCost(0)
            setTierDescription("")
            setTierTitle("")
            if (props.addCallback) {
                props.addCallback({title: tierTitle, description: tierDescription, cost: tierCost, supportTierId: tiers.length})
        }
        }
      }

      const modalSubmitEdit = () => {
        if (validateTier()) {
            setTiers([...tiers.filter(tier => tier.supportTierId !== editId), {title: tierTitle, description: tierDescription, cost: tierCost, supportTierId: editId}])
            handleCloseEdit()
            if (props.editCallback) {
                props.editCallback({title: tierTitle, description: tierDescription, cost: tierCost, supportTierId: editId})
            }
            setErrors({...defaultErrors, cost: "", description: "", title: ""})
            setTierCost(0)
            setTierDescription("")
            setTierTitle("")
        }
      }

      const editTier = (id: number) => {
        const sTier = props.supportedTiers?.find(tier => tier.supportTierId === id)
        if (sTier) {
            handleOpenSupporters()
            return
        }
        const tier = tiers.find(tier => tier.supportTierId === id)
        if (tier) {
            setTierTitle(tier.title)
            setTierDescription(tier.description)
            setTierCost(tier.cost)
            setEditId(id)
            handleOpenEdit()
        }
    }

    const deleteTier = (id: number) => {
        const sTier = props.supportedTiers?.find(tier => tier.supportTierId === id)
        if (sTier) {
            handleOpenSupporters()
            return
        }
        const tier = tiers.find(tier => tier.supportTierId === id)
        if (tier) {
            setEditId(id)
            handleOpenDel()
        }
    }

    const actuallyDelete = () => {
        if (props.delteCallback) {
            props.delteCallback(editId)
        }
        setTiers([...tiers.filter(tier => tier.supportTierId !== editId)])
        handleCloseDel()
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

      const tiersCSS: CSS.Properties = {
        margin: "10px",
        height: "350px",
        position: "relative",
        width: "100%"
    }

    const formCSS: CSS.Properties = {
        margin: "10px",
    }

      return (
        <div>
            <h2>Add support tiers</h2>
            <div style={tiersCSS}>
                <Button disabled={tiers.length >= 3} onClick={handleOpen} variant="contained" style={{right: "10px", top: "30px", position: "absolute"}}>Add Tier</Button>
                <SupportTierList supportTiers={tiers} editDelete editCallback={editTier} deleteCallback={deleteTier}/>
            </div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalCSS}>
                    <IconButton
                        size="small"
                        aria-label="close"
                        color="inherit"
                        style={{float: "right"}}
                        onClick={handleClose}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
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
                                error={errors.title !== ""}
                                helperText={errors.title}
                                />
                            <TextField 
                                id="description" 
                                label="Description" 
                                variant="outlined" 
                                style={formCSS}
                                value={tierDescription}
                                onChange={(e) => {setTierDescription(e.target.value)}}
                                error={errors.description !== ""}
                                helperText={errors.description}
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
                                error={errors.cost !== ""}
                                helperText={errors.cost}
                            />
                            <Button onClick={modalSubmit} variant="contained" style={{width: "50%", margin: "auto"}}>Add Tier</Button>
                        </FormControl>
                    </Typography>
                </Box>
            </Modal>
            <Modal
                open={openEdit}
                onClose={handleCloseEdit}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalCSS}>
                    <IconButton
                        size="small"
                        aria-label="close"
                        color="inherit"
                        style={{float: "right"}}
                        onClick={handleCloseEdit}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Edit Support Tier
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
                                error={errors.title !== ""}
                                helperText={errors.title}
                                />
                            <TextField 
                                id="description" 
                                label="Description" 
                                variant="outlined" 
                                style={formCSS}
                                value={tierDescription}
                                onChange={(e) => {setTierDescription(e.target.value)}}
                                error={errors.description !== ""}
                                helperText={errors.description}
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
                                error={errors.cost !== ""}
                                helperText={errors.cost}
                            />
                            <Button onClick={modalSubmitEdit} variant="contained" style={{width: "50%", margin: "auto"}}>Edit Tier</Button>
                        </FormControl>
                    </Typography>
                </Box>
            </Modal>
            <Dialog
                open={openDel}
                onClose={handleCloseDel}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                {"Delete Tier"}
                </DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Are you sure you want to delete this tier?
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={handleCloseDel}>Cancel</Button>
                <Button onClick={actuallyDelete} autoFocus>
                    delete
                </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={openSupporters}
                onClose={handleCloseSupporters}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                {"Forbidden"}
                </DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Cannot edit or delete a tier that has supporters
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={handleCloseSupporters} autoFocus>
                    Ok
                </Button>
                </DialogActions>
            </Dialog>
        </div>
      )
}

export default TierCreator;