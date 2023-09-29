import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';

function NavBar() {

    const pages = ['Swap', 'Tokens', 'NFTs'];

    const [anchorNav, setAnchorNav] = React.useState(null);

    const [active, setActive] = useState(pages[0]);

    const openNavMenu = (event) => {
        setAnchorNav(event.currentTarget);
    }

    const updateActiveBtn = (page) => {
        setActive(page);
        setAnchorNav(null)
        console.log(page)
    }

    const closeNavMenu = (event) => {
        setAnchorNav(null);
    }

    return (
        <AppBar position="sticky" className="navbar" sx={{ boxShadow: 0, borderBottom: '1px solid', borderColor: 'secondary.main', borderRadius: '8px'}}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Typography
                    variant="h6"
                    noWrap
                    component="a"
                    href="#"
                    sx={{
                    mr: 2,
                    display: { xs: 'none', md: 'flex' },
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    letterSpacing: '.3rem',
                    color: 'secondary.main',
                    textDecoration: 'none',
                    }}
                    >
                        SWAP
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                    <IconButton
                    size="large"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={openNavMenu}
                    color="inherit"
                    >
                    <MenuIcon />
                    </IconButton>
                    <Menu
                    id="menu-appbar"
                    anchorEl={anchorNav}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    open={Boolean(anchorNav)}
                    onClose={closeNavMenu}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                    }}
                    >
                    {pages.map((page) => (
                        <MenuItem key={page} onClick={closeNavMenu}>
                        <Typography textAlign="center">{page}</Typography>
                        </MenuItem>
                    ))}
                    </Menu>
                </Box>
                <Typography
                    variant="h5"
                    noWrap
                    component="a"
                    href="#app-bar-with-responsive-menu"
                    sx={{
                    mr: 2,
                    display: { xs: 'flex', md: 'none' },
                    flexGrow: 1,
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    letterSpacing: '.3rem',
                    color: 'secondary.main',
                    textDecoration: 'none',
                    }}
                >
                    SWAP
                </Typography>
                <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                    {pages.map((page) => (
                    <Button
                        key={page}
                        id={page}
                        onClick={() => updateActiveBtn(page)}
                        className={page === active ? 'activeBtn' : ''}
                        sx={{ my: 2, mx: 2, color: 'secondary.main', display: 'block', backgroundColor: page === active ? 'secondary.main' : 'inherit', color: page === active ? 'white' : 'secondary.main' }}>
                        {page}
                    </Button>
                    ))}
                </Box>
                </Toolbar>
            </Container>
        </AppBar>
    )}

export default NavBar;