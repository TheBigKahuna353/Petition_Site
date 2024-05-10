import { Card, IconButton, MenuItem, Typography } from "@mui/material";
import CSS from 'csstype';
import { Menu as Men } from "@mui/material";

import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import React from "react";

interface Props {
    supportTier: SupportTier,
    editDelete?: boolean,
    editCallback?: (id: number) => void,
    deleteCallback?: (id: number) => void
}



const SupportTierListObj = (props: Props) => {

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
        <div>
            <Card style={{padding: "10px", margin:"20px"}}>
                <h1>{props.supportTier.title}</h1>
                <h2>${props.supportTier.cost}</h2>
                <p>{props.supportTier.description}</p>
            </Card>
            {props.editDelete &&
                <div style={iconCSS}>
                    <IconButton onClick={handleOpenUserMenu} color="inherit">
                        <MoreHorizIcon fontSize="large" />
                    </IconButton>
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
                        <MenuItem  onClick={() => handleEdit(props.supportTier.supportTierId)}>
                            <Typography textAlign="center">edit</Typography>
                        </MenuItem>
                        <MenuItem  onClick={() => handleDelete(props.supportTier.supportTierId)}>
                            <Typography textAlign="center">delete</Typography>
                        </MenuItem>
                    </Men>
                </div>}
        </div>
    );
}

export default SupportTierListObj;