import React from "react"
import PetitionListObj from "./petitionListObj"
import { IconButton, Paper, Menu as Men, MenuItem, Typography } from "@mui/material"
import CSS from 'csstype';

import MoreHorizIcon from '@mui/icons-material/MoreHoriz';


interface IPetitionProps {
    petitions: Array<Petition>,
    catergories: Array<Catergory>,
    editDelete?: boolean,
}

const settings = ['Edit', 'Delete'];

const PetitionList = (props: IPetitionProps) => {

    const { petitions, catergories } = props

    const card: CSS.Properties = {
        padding: "10px",
        margin: "20px",
        display: "inline-grid",
        width: "fit-content",
        position: "relative"
    }

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

    const handleCloseUserMenu = (event: any) => {
        setAnchorElUser(null);
        if (event.target.textContent === 'Edit') {
            console.log("Edit")
        } else if (event.target.textContent === 'Delete') {
            console.log("Delete")
        }
        
    };

    return (
        <div>
            <div>
                {petitions.map((petition) => {
                    return (
                        <Paper elevation={3} style={card} id={'PetitionObj-' + petition.petitionId}>
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
                                    {settings.map((setting) => (
                                    <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                        <Typography textAlign="center">{setting}</Typography>
                                    </MenuItem>
                                    ))}
                                </Men>
                            </div>}
                            <PetitionListObj petition={petition} key={petition.petitionId} catergories={catergories}/>
                        </Paper>
                    )
                })}
            </div>
        </div>
    )
}

export default PetitionList;