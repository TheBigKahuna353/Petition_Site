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
import axios from 'axios';
import { usePageStore, useTokenStore } from '../store';
import Menu from '../Components/Menu';
import { useNavigate } from 'react-router-dom';
import { Snackbar, Alert } from '@mui/material';
import URL from '../Constanats';

const defaultErrors = {email: "", password: "", firstName: "", lastName: ""};

export default function SignUp() {

    const [errors, setErrors] = React.useState(defaultErrors);

    const validate = (firstName: string, lastName: string, email: string, password: string) => {
        let newErrors = defaultErrors;
        let passed = true;
        if (firstName === "") {
            newErrors.firstName = "First Name is required";
            passed = false;
        }
        if (lastName === "") {
            newErrors.lastName = "Last Name is required";
            passed = false;
        }
        if (!email.includes("@")) {
            newErrors.email = "Invalid email";
            passed = false;
        }
        if (email === "") {
            newErrors.email = "Email is required";
            passed = false;
        }
        if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
            passed = false;
        }
        if (password === "") {
            newErrors.password = "Password is required";
            passed = false;
        }
        setErrors(newErrors);
        return passed;
    }


    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        if (!validate(data.get('firstName') as string, data.get('lastName') as string, data.get('email') as string, data.get('password') as string)) {
            return;
        }
        axios.post(URL+'/api/v1/users/register', {
            email: data.get('email'),
            password: data.get('password'),
            firstName: data.get('firstName'),
            lastName: data.get('lastName')
        })
        .then(response => {
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
        })
        .catch(error => {
            setOpenSB(true);
            setSBerror(error.response.statusText);
        })
    };


    const [openSB, setOpenSB] = React.useState(false)
    const handleClose = (event?: any, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSB(false);
    };
    const [SBerror, setSBerror] = React.useState("")

    const login = useTokenStore((state) => state.login);

    const nav = useNavigate()
    const page = usePageStore(state => state.prevPage);

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
                    Sign up
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                        autoComplete="given-name"
                        name="firstName"
                        required
                        fullWidth
                        error={errors.firstName !== ""}
                        helperText={errors.firstName}
                        id="firstName"
                        label="First Name"
                        autoFocus
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                        required
                        fullWidth
                        error={errors.lastName !== ""}
                        helperText={errors.lastName}
                        id="lastName"
                        label="Last Name"
                        name="lastName"
                        autoComplete="family-name"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                        required
                        fullWidth
                        error={errors.email !== ""}
                        helperText={errors.email}
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                        required
                        fullWidth
                        error={errors.password !== ""}
                        helperText={errors.password}
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                        />
                    </Grid>
                    </Grid>
                    <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    >
                    Sign Up
                    </Button>
                    <Grid container justifyContent="flex-end">
                    <Grid item>
                        <Link href="/Petition_Site/login" variant="body2">
                        Already have an account? Sign in
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
                    {SBerror === "" ? "Changes saved" : SBerror}
                </Alert>
            </Snackbar>
        </div>
    );
}