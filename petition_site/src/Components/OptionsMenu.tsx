import { IconButton, Menu, MenuItem, Typography } from "@mui/material";
import React from "react";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

import CSS from 'csstype';

interface IProps {
    id: number,
    editCallback?: (id: number) => void,
    deleteCallback?: (id: number) => void
}

const OptionsMenu = (props: IProps) => {

    const iconCSS : CSS.Properties = {
        position: "absolute",
        right: "-5%",
        top: "-2%", 
        borderRadius: "50%", 
        background: "#EEEEEE"
    }

    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleEdit = (id: number) => {
        handleCloseUserMenu()
        if (props.editCallback) {
            props.editCallback(id)
        }
    }

    const handleDelete = (id: number) => {
        handleCloseUserMenu()
        if (props.deleteCallback) {
            props.deleteCallback(id)
        }
    }

    return (
        <div style={iconCSS}>
            <IconButton onClick={handleOpenUserMenu} color="inherit">
                <MoreHorizIcon fontSize="large" />
            </IconButton>
            <Menu
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
                <MenuItem  onClick={() => handleEdit(props.id)}>
                    <Typography textAlign="center">Edit</Typography>
                </MenuItem>
                <MenuItem  onClick={() => handleDelete(props.id)}>
                    <Typography textAlign="center">Delete</Typography>
                </MenuItem>
            </Menu>
        </div>
    )
}


export default OptionsMenu;