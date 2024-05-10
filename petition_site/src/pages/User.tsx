import React from "react"
import { useTokenStore } from "../store"
import axios from "axios"
import { Box, Button, FormControl, Modal, TextField, Typography } from "@mui/material"

import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import CSS from 'csstype'
import Menu from "../Components/Menu";


// TODO:
// - error handling on axios requests\
// - make errors 1 object for all form fields


const User = () => {

    const userId = useTokenStore(state => state.userId)

    if (!userId) {
        window.location.href = '/login'
    }

    const [editUser, setEditUser] = React.useState<User>({} as User)
    React.useEffect(() => {
        axios.get('http://localhost:4941/api/v1/users/' + userId, { headers: {
            "X-Authorization": useTokenStore.getState().token
        }})
        .then(response => {
            setEditUser(response.data)
        })
        .catch(error => {
            console.error("user not authorised")
        })
    }, [userId])

    const [openPassword, setOpenPassword] = React.useState(false)
    const [passwords, setPasswords] = React.useState({current: "", new: "", confirm: ""})
    const handleOpenPassword = () => {
        setOpenPassword(true)
        setPasswords({current: "", new: "", confirm: ""})
    }
    const [passwordIncorrect, setPasswordIncorrect] = React.useState("")

    const imageURL = 'http://localhost:4941/api/v1/users/' + userId + '/image'

    const defaultUserImageURL = 'https://png.pngitem.com/pimgs/s/150-1503945_transparent-user-png-default-user-image-png-png.png'
    

    const deleteImage = () => {
        axios.delete('http://localhost:4941/api/v1/users/' + userId + '/image', { headers: {
            "X-Authorization": useTokenStore.getState().token
        }})
        .then(response => {
            window.location.reload()
        })
        .catch(error => {
            console.error("user not authorised")
        })
    }

    const changeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return
        const file = e.target.files[0]
        axios.put('http://localhost:4941/api/v1/users/' + userId + '/image', file, { headers: {
            "X-Authorization": useTokenStore.getState().token,
            "Content-Type": file.type
        }})
        .then(response => {
            window.location.reload()
        })
        .catch(error => {
            console.error("user not authorised")
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


    const handleEdit = () => {
        axios.put('http://localhost:4941/api/v1/users/' + userId, editUser, { headers: {
            "X-Authorization": useTokenStore.getState().token
        }})
        .catch(error => {
            console.error("user not authorised")
        })
    }

    const changePassword = () => {
        axios.patch('http://localhost:4941/api/v1/users/' + userId, {
            currentPassword: passwords.current,
            password: passwords.new
        }, { headers: {
            "X-Authorization": useTokenStore.getState().token
        }})
        .then(response => {
            setOpenPassword(false)
        })
        .catch(error => {
            console.error(error.response)
            const code = error.response.status
            if (code >= 400 && code < 500) {
                setPasswordIncorrect(error.response.statusText)
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
                    value={editUser?.firstName || ""} 
                    onChange={(e) => setEditUser({...editUser, firstName: e.target.value})} />
                <TextField 
                    id="lastName" 
                    label="Last Name" 
                    sx={blockCSS}
                    value={editUser?.lastName || ""} 
                    onChange={(e) => setEditUser({...editUser, lastName: e.target.value})} />
                <TextField 
                    id="email" 
                    label="Email" 
                    sx={blockCSS}
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
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Change Password
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        <FormControl>
                            <TextField
                                id="currentPassword"
                                label="Current Password"
                                type="password"
                                error={passwordIncorrect !== ""}
                                helperText={passwordIncorrect}
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
        </div>
    )
}

export default User