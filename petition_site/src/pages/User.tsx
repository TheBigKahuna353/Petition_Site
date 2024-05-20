import React from "react"
import { useTokenStore, usePageStore } from "../store"
import axios from "axios"
import { Alert, Box, Button, FormControl, IconButton, Modal, Snackbar, TextField, Typography } from "@mui/material"

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';

import CSS from 'csstype'
import Menu from "../Components/Menu";



const defaultErrors = {firstName: "", lastName: "", email: "", password: "", newPassword: "", confirmPassword: ""}

const User = () => {

    const userId = useTokenStore(state => state.userId)
    const setPrevPage = usePageStore(state => state.setPrevPage)

    if (!userId) {
        setPrevPage("/profile")
        window.location.href = "/login"
    }

    const [editUser, setEditUser] = React.useState<User>({} as User)
    React.useEffect(() => {
        axios.get('http://192.168.1.17:4941/api/v1/users/' + userId, { headers: {
            "X-Authorization": useTokenStore.getState().token
        }})
        .then(response => {
            setEditUser(response.data)
        })
        .catch(error => {
            console.error("user not authorised")
            setOpenSB(true)
            setSBerror("Error: " + error.response.statusText)
        })
    }, [userId])

    const [openPassword, setOpenPassword] = React.useState(false)
    const [passwords, setPasswords] = React.useState({current: "", new: "", confirm: ""})
    const handleOpenPassword = () => {
        setOpenPassword(true)
        setPasswords({current: "", new: "", confirm: ""})
    }

    const imageURL = 'http://192.168.1.17:4941/api/v1/users/' + userId + '/image'

    const defaultUserImageURL = 'https://png.pngitem.com/pimgs/s/150-1503945_transparent-user-png-default-user-image-png-png.png'
    
    const [errors, setErrors] = React.useState(defaultErrors)

    const [openSB, setOpenSB] = React.useState(false)
    const handleClose = (event?: any, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSB(false);
    };
    const [SBerror, setSBerror] = React.useState("")


    const deleteImage = () => {
        axios.delete('http://192.168.1.17:4941/api/v1/users/' + userId + '/image', { headers: {
            "X-Authorization": useTokenStore.getState().token
        }})
        .then(response => {
            window.location.reload()
        })
        .catch(error => {
            console.error("user not authorised")
            setSBerror("Error: " + error.response.statusText)
            setOpenSB(true)
        })
    }

    const changeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return
        const file = e.target.files[0]
        axios.put('http://192.168.1.17:4941/api/v1/users/' + userId + '/image', file, { headers: {
            "X-Authorization": useTokenStore.getState().token,
            "Content-Type": file.type
        }})
        .then(response => {
            window.location.reload()
        })
        .catch(error => {
            setSBerror("Error: " + error.response.statusText)
            setOpenSB(true)
        })
    }


    const onError = (e: any) => {
        console.log("setting default image")
        if (e.target.src === defaultUserImageURL) return;
        e.target.src = defaultUserImageURL
    }

    const blockCSS : CSS.Properties = {
        display: "block",
        margin: "20px"
    }

    const inlineCSS : CSS.Properties = {
        display: "inline-block",
        marginRight: "50px"
    }

    const imageCSS : CSS.Properties = {
        width: "300px",
        height: "300px",
        borderRadius: "50%",
        display: "block",
        border: "5px solid black",
        margin: "20px"
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
    
    const validateEdit = () => {
        let passed = true
        let newErrors = {...defaultErrors}
        if (editUser.firstName === "") {
            newErrors = {...newErrors, firstName: "First Name cannot be empty"}
            passed = false
        }
        if (editUser.lastName === "") {
            newErrors = {...newErrors, lastName: "Last Name cannot be empty"}
            passed = false
        }
        if (editUser.email === "") {
            newErrors = {...newErrors, email: "Email cannot be empty"}
            passed = false
        }
        if (editUser.email.indexOf('@') === -1) {
            newErrors = {...newErrors, email: "Invalid email"}
            passed = false
        }
        setErrors(newErrors)
        return passed
    }
    

    const handleEdit = () => {
        if (!validateEdit()) return

        axios.patch('http://192.168.1.17:4941/api/v1/users/' + userId, editUser, { headers: {
            "X-Authorization": useTokenStore.getState().token
        }})
        .then(response => {
            setSBerror("")
            setOpenSB(true)
        })
        .catch(error => {
            console.error(error.response)
            setSBerror("Error: " + error.response.statusText)
            setOpenSB(true)
        })
    }

    const validatePassword = () => {
        let newErrors = {...defaultErrors}
        let passed = true
        if (passwords.current.length < 6) {
            newErrors = {...newErrors, password: "Password must be at least 6 characters"}
            passed = false
        }
        if (passwords.current === "") {
            newErrors = {...newErrors, password: "Current Password cannot be empty"}
            passed = false
        }
        if (passwords.new.length < 6) {
            newErrors = {...newErrors, newPassword: "Password must be at least 6 characters"}
            passed = false
        }
        if (passwords.new === "") {
            newErrors = {...newErrors, newPassword: "New Password cannot be empty"}
            passed = false
        }
        if (passwords.new !== passwords.confirm) {
            passed = false
        }
        setErrors(newErrors)
        return passed
    }


    const changePassword = () => {
        if (!validatePassword()) return

        axios.patch('http://192.168.1.17:4941/api/v1/users/' + userId, {
            currentPassword: passwords.current,
            password: passwords.new
        }, { headers: {
            "X-Authorization": useTokenStore.getState().token
        }})
        .then(response => {
            setOpenPassword(false)
            setSBerror("")
            setOpenSB(true)
        })
        .catch(error => {
            console.error(error.response)
            const code = error.response.status
            if (code === 401) {
                setErrors({...defaultErrors, password: "Incorrect password"})
            }
            else {
                setSBerror("Error: " + error.response.statusText)
                setOpenSB(true)
                setOpenPassword(false)
            }
        })
    }

    return (
        <div>
            <Menu />
            <h1>Profile</h1>
            <div style={inlineCSS}>
                <TextField 
                    id="firstName" 
                    label="First Name" 
                    sx={blockCSS}
                    error={errors.firstName !== ""}
                    helperText={errors.firstName}
                    value={editUser?.firstName || ""} 
                    onChange={(e) => setEditUser({...editUser, firstName: e.target.value})} />
                <TextField 
                    id="lastName" 
                    label="Last Name" 
                    sx={blockCSS}
                    error={errors.lastName !== ""}
                    helperText={errors.lastName}
                    value={editUser?.lastName || ""} 
                    onChange={(e) => setEditUser({...editUser, lastName: e.target.value})} />
                <TextField 
                    id="email" 
                    label="Email" 
                    sx={blockCSS}
                    error={errors.email !== ""}
                    helperText={errors.email}
                    value={editUser?.email || ""} 
                    onChange={(e) => setEditUser({...editUser, email: e.target.value})} />
                <Button
                    variant="contained"
                    onClick={handleEdit}
                    style={{display: "block", margin: "20px"}}
                >
                    Save Changes
                </Button>
            </div>
            <div style={inlineCSS}>
                <img src={imageURL} style={imageCSS} onError={onError} alt="user" />
                <Button variant="contained" style={inlineCSS} onClick={deleteImage}>
                    Remove Image
                </Button>
                <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<CloudUploadIcon />}
                    >
                        Upload file
                        <input onChange={changeImage} style={{display:"none"}} id="image" accept="image/png, image/jpeg, image/gif" type="file" />
                    </Button>
            </div>
            <Button
                variant="contained"
                onClick={handleOpenPassword}
                style={{display: "block", margin: "auto", marginTop: "20px"}}
            >
                Change Password
            </Button>
            <Modal
                open={openPassword}
                onClose={() => setOpenPassword(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalCSS}>
                    <IconButton
                        size="small"
                        aria-label="close"
                        color="inherit"
                        style={{float: "right"}}
                        onClick={() => setOpenPassword(false)}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Change Password
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        <FormControl>
                            <TextField
                                id="currentPassword"
                                label="Current Password"
                                type="password"
                                error={errors.password !== ""}
                                helperText={errors.password}
                                sx={blockCSS}
                                value={passwords.current}
                                onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                            />
                            <TextField
                                id="newPassword"
                                label="New Password"
                                type="password"
                                sx={blockCSS}
                                value={passwords.new}
                                error={errors.newPassword !== ""}
                                helperText={errors.newPassword}
                                onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                            />
                            <TextField
                                id="confirmPassword"
                                label="Confirm Password"
                                type="password"
                                sx={blockCSS}
                                error={passwords.new !== passwords.confirm}
                                helperText={passwords.new !== passwords.confirm ? "Passwords do not match" : ""}
                                value={passwords.confirm}
                                onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                            />
                            <Button
                                variant="contained"
                                onClick={changePassword}
                                style={{display: "block", margin: "20px"}}
                            >
                                Save Changes
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
                    {SBerror === "" ? "Changes saved" : SBerror}
                </Alert>
            </Snackbar>
        </div>
    )
}

export default User

function usePrevPageStore(arg0: (state: any) => any) {
    throw new Error("Function not implemented.");
}
