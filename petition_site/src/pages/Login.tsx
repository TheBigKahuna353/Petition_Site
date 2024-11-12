import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

import {useTokenStore} from '../store';
import axios from 'axios';
import Menu from '../Components/Menu';
import { usePageStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { Snackbar, Alert } from '@mui/material';
import URL from '../Constanats';

const defaultErrors = {email: "", password: ""};

export default function SignIn() {
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        if (!validate(data)) {
            return;
        }
        axios.post(URL+'/api/v1/users/login', {
            email: data.get('email'),
            password: data.get('password')
        })
        .then(response => {
            login(response.data.token, response.data.userId);
            if (page === "") {
                nav("/petitions");
            } else {
                nav(page);
            }
        })
        .catch(error => {
            if (error.response.status === 401) {
                setErrors({email: "", password: "Invalid email or password"});
            } else if (error.response.status === 400) {
                if (error.response.statusText.indexOf("email") !== -1) {
                    setErrors({email: "Invalid email", password: ""});
                } else {
                    setErrors({email: "", password: "Invalid email or password"});
                }
            } else {
                setOpenSB(true);
                setSBerror("Error: " + error.response.statusText);
            }
        })
    };

    const [errors, setErrors] = React.useState(defaultErrors);

    const [openSB, setOpenSB] = React.useState(false)
    const handleClose = (event?: any, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSB(false);
    };
    const [SBerror, setSBerror] = React.useState("")

    const login = useTokenStore(state => state.login)

    const page = usePageStore(state => state.prevPage)
    const nav = useNavigate()


    const validate = (data: FormData) => {
        let newErrors = defaultErrors;
        let passed = true;
        if (data.get('email') === "") {
            newErrors.email = "Email is required";
            passed = false;
        }
        if (data.get('password') === "") {
            newErrors.password = "Password is required";
            passed = false;
        }
        setErrors(newErrors);
        console.log(newErrors);
        return passed;
    }

    return (
        <div>
            <Menu/>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    error={errors.email !== ""}
                    helperText={errors.email}
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    error={errors.password !== ""}
                    helperText={errors.password}
                    type="password"
                    id="password"
                    autoComplete="current-password"
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}>
                    Sign In
                </Button>
                    <Grid container>
                        <Grid item xs>
                        </Grid>
                        <Grid item>
                            <Link href="/Petition_Site/register" variant="body2">
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
        <Snackbar open={openSB} autoHideDuration={6000} onClose={handleClose}>
                <Alert
                    onClose={handleClose}
                    severity={SBerror === "" ? "success" : "error"}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {SBerror === "" ? "Success" : SBerror}
                </Alert>
            </Snackbar>
    </div>
  );
}