import { AppBar, Button, ButtonGroup, Toolbar, Typography, Menu as Men, MenuItem, Avatar, Box, IconButton, Tooltip } from "@mui/material";
import { usePageStore, useTokenStore } from "../store";
import { useLocation, useNavigate, Link } from "react-router-dom";
import CSS from "csstype";
import React from "react";
import URL from "../Constanats";

const Menu = () => {

    const location = useLocation()
    const setPage = usePageStore(state => state.setPrevPage)

    const nav = useNavigate()

    const hidden: CSS.Properties = {
        visibility: "hidden"
    }

    const visible: CSS.Properties = {
        visibility: "visible"
    }

    const handleClick = () => {
        if (location.pathname !== "/login" && location.pathname !== "/register") {
            setPage(location.pathname)
        }
    }

    const loginStyle = location.pathname === "/Petition_Site/login" ? hidden : visible
    const registerStyle = location.pathname === "/Petition_Site/register" ? hidden : visible

    const loggedIn = useTokenStore(state => state.loggedIn)

    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = (event: any) => {
        setAnchorElUser(null);
        if (event.target.textContent === 'Logout') {
            useTokenStore.getState().logout()
        } else if (event.target.textContent === 'Profile') {
            nav(`/profile`)
        } else if (event.target.textContent === 'Manage Petitions') {
            nav('/myPetitions')
        }
        
    };

    const userId = useTokenStore(state => state.userId)

    const userURL = `${URL}/api/v1/users/${userId}/image`
    const defaultUserImageURL = 'https://png.pngitem.com/pimgs/s/150-1503945_transparent-user-png-default-user-image-png-png.png'

    const settings = ['Profile', 'Manage Petitions', 'Logout'];

    const onError = (e: any) => {
        console.log("setting default image")
        if (e.target.src === defaultUserImageURL) return;
        e.target.src = defaultUserImageURL
    }


    return (
        <div>
            <AppBar position="static" style={{justifyContent: "space-between"}}>
                <Toolbar style={{justifyContent: "center"}}>
                    <div style={{flexGrow: "1", flexBasis: "0"}}>
                        <Link to="/petitions" style={{textDecoration: "none", color: "white"}}>
                            <Button color="inherit" style={{float: "left"}}>All Petitions</Button>
                        </Link>
                    </div>
                    <Typography variant="h6" component="div">
                        Petition Site
                    </Typography>
                    <div style={{flexGrow: "1", flexBasis: "0"}}>
                        <div style={{float:"right"}}>
                            {loggedIn ?
                                <Box>
                                    <Tooltip title="Open settings">
                                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                        <Avatar onError={onError} src={userURL} />
                                    </IconButton>
                                    </Tooltip>
                                    <Men
                                        sx={{ mt: '45px' }}
                                        id="menu-appbar"
                                        anchorEl={anchorElUser}
                                        anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                        }}
                                        keepMounted
                                        transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                        }}
                                        open={Boolean(anchorElUser)}
                                        onClose={handleCloseUserMenu}
                                    >
                                        {settings.map((setting) => (
                                        <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                            <Typography textAlign="center">{setting}</Typography>
                                        </MenuItem>
                                        ))}
                                    </Men>
                                </Box>
                            :
                                <ButtonGroup color="inherit" variant="text" style={{}}>
                                    <Link to="/login" style={{textDecoration: "none", color: "white"}}>
                                        <Button onClick={handleClick} style={loginStyle}>Login</Button>
                                    </Link>
                                    <Link to="/register" style={{textDecoration: "none", color: "white"}}>
                                        <Button onClick={handleClick} style={registerStyle}>Register</Button>
                                    </Link>
                                </ButtonGroup>
                            }
                        </div>
                    </div>
                </Toolbar>
            </AppBar>
        </div>
    );
}

export default Menu;