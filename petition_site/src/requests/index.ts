import axios from "axios";
import { useCredStore } from "../store";


const login = async (email: string, password: string) => {
    axios.post('http://localhost:4941/api/login', { body: {
        email: email,
        password: password
    }})
    .then(response => {
        console.log(response);
        useCredStore.setState({loggedIn: true});
        useCredStore.setState({token: response.data.token});
    })
    
    
}