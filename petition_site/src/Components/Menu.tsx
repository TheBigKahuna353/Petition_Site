import { AppBar, Button, ButtonGroup, Toolbar, Typography } from "@mui/material";



const Menu = () => {
    return (
        <div>
            <AppBar position="static" style={{}}>
                <Toolbar>
                    <Button color="inherit" href="/petitions">Petitions</Button>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Menu
                    </Typography>
                    <ButtonGroup color="inherit" variant="text" style={{}}>
                        <Button href="/login">Login</Button>
                        <Button href="/register">Register</Button>
                    </ButtonGroup>
                </Toolbar>
            </AppBar>
        </div>
    );
}

export default Menu;