import React from 'react';
import Menu from '../Components/Menu';
import axios from 'axios';
import { usePetitionStore, useTokenStore, usePageStore } from '../store';
import PetitionList from '../Components/petitionList';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import URL from '../Constanats';
import { useNavigate, Link } from 'react-router-dom';

const MyPetitions = () => {

    const [ownPetitions, setOwnPetitions] = React.useState<Petition[]>([]);
    const [supportedPetitions, setSupportedPetitions] = React.useState<Petition[]>([]);
    const userId = useTokenStore(state => state.userId);
    const token = useTokenStore(state => state.token);
    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");

    const catergories = usePetitionStore(state => state.Categories)

    const setPage = usePageStore(state => state.setPrevPage);

    // delete modal
    const [openDel, setOpenDel] = React.useState(false);
    const handleCloseDel = () => setOpenDel(false);
    const [delId, setDelId] = React.useState<number | null>(null);

    // cant delete modal
    const [openCantDel, setOpenCantDel] = React.useState(false);
    const handleCloseCantDel = () => setOpenCantDel(false);

    const nav = useNavigate();


    if (!userId) {
        setPage("/Petition_Site/myPetitions");
        nav("/Petition_Site/login");
    }

    React.useEffect(() => {
        const getOwnPeitions = () => {
            axios.get(URL+'/api/v1/petitions', { params: {
                ownerId: userId
            }}).then((response) => {
                setOwnPetitions(response.data.petitions);
            }, (error) => {
                console.log("error in own petitions")
                setErrorFlag(true)
                setErrorMessage(error.response.statusText)
            })
        }
        const getSupportedPetitions = () => {
            axios.get(URL+'/api/v1/petitions', { params: {
                supporterId: userId
            }}).then((response) => {
                setSupportedPetitions(response.data.petitions);
            }, (error) => {
                console.log("error in supported petitions")
                setErrorFlag(true)
                setErrorMessage(error.response.statusText)
            })
        }
        getOwnPeitions();
        getSupportedPetitions();
    }, [userId])

    const handleDelete = (id: number) => {
        setOpenDel(true)
        setDelId(id)
    }

    const actuallyDelete = () => {
        if (delId !== null) {
            axios.delete(URL+'/api/v1/petitions/' + delId, { headers: {
                "X-Authorization": token
            }})
            .then((response) => {
                setOwnPetitions(ownPetitions.filter((petition) => petition.petitionId !== delId))
                handleCloseDel()
            }, (error) => {
                if (error.response.statusText === "Can not delete a petition if one or more users have supported it") {
                    setOpenCantDel(true)
                    handleCloseDel()
                    return
                }
                console.log("error in delete")
                setErrorFlag(true)
                setErrorMessage(error.response.statusText)
            })
        }
    }

    if (errorFlag) {
        return (
            <div>
                <Menu />
                <h1>Error: {errorMessage}</h1>
            </div>
        )
    }

    return (
        <div>
            <Menu />
            <Button LinkComponent={Link} variant="contained" style={{marginTop: "2%"}} href="/createPetition">Create Petition</Button>
            <h1>Own Petitions</h1>
            {ownPetitions.length > 0 ?
                <PetitionList 
                petitions={ownPetitions} 
                catergories={catergories} 
                editDelete={true}
                editCallback={(id: number) => {
                    nav("/editPetition" + id)
                }}
                deleteCallback={handleDelete}
            />
            :
                <h2>No petitions found</h2>
            }
            <h1>Supported Petitions</h1>
            {supportedPetitions.length > 0 ?
                <PetitionList petitions={supportedPetitions} catergories={catergories}/>
            :
                <h2>No petitions found</h2>
            }
            <Dialog
                open={openDel}
                onClose={handleCloseDel}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                {"Delete Petition"}
                </DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Are you sure you want to delete this Petition?
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
                open={openCantDel}
                onClose={handleCloseCantDel}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                {"Forbidden"}
                </DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Cant delete petition with supporters
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={handleCloseCantDel} autoFocus>
                    Ok
                </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default MyPetitions;