import React from 'react';
import Menu from '../Components/Menu';
import axios from 'axios';
import { usePetitionStore, useTokenStore } from '../store';
import PetitionList from '../Components/petitionList';
import { Button } from '@mui/material';

const MyPetitions = () => {

    const [ownPetitions, setOwnPetitions] = React.useState<Petition[]>([]);
    const [supportedPetitions, setSupportedPetitions] = React.useState<Petition[]>([]);
    const userId = useTokenStore(state => state.userId);
    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");

    const catergories = usePetitionStore(state => state.Categories)

    React.useEffect(() => {
        const getOwnPeitions = () => {
            axios.get('http://localhost:4941/api/v1/petitions', { params: {
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
            axios.get('http://localhost:4941/api/v1/petitions', { params: {
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
            <Button variant="contained" style={{marginTop: "2%"}} href="/createPetition">Create Petition</Button>
            <h1>Own Petitions</h1>
            {ownPetitions.length > 0 ?
                <PetitionList petitions={ownPetitions} catergories={catergories} editDelete={true}/>
            :
                <h2>No petitions found</h2>
            }
            <h1>Supported Petitions</h1>
            {supportedPetitions.length > 0 ?
                <PetitionList petitions={supportedPetitions} catergories={catergories}/>
            :
                <h2>No petitions found</h2>
            }
        </div>
    );
}

export default MyPetitions;