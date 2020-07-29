import React from 'react';
import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import PropTypes from 'prop-types';
import Menu from '@material-ui/core/Menu';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Home from '@material-ui/icons/Home';
import Palette from '@material-ui/icons/Palette';
import Button from '@material-ui/core/Button';
import Slide from '@material-ui/core/Slide';
import Tooltip from '@material-ui/core/Tooltip';

import { Link } from "@reach/router";

function HideOnScroll(props) {
    const { children, window } = props;
    // Note that you normally won't need to set the window ref as useScrollTrigger
    // will default to window.
    // This is only being set here because the demo is in an iframe.
    const trigger = useScrollTrigger({ target: window ? window() : undefined });

    return (
        <Slide appear={false} direction="down" in={!trigger}>
        {children}
        </Slide>
    );
}

HideOnScroll.propTypes = {
    children: PropTypes.element.isRequired,
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window: PropTypes.func,
};

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}));

export default function MaterialNavBar(props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  /*const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };*/

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem component={ Link } to={props.loggedIn ? '/logout' : '/login'}>{props.loggedIn ? 'Logout' : 'NetID Login'}</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >

      <MenuItem 
            href='/home'>
        <Button
            href='/home'
            variant="outlined"
            color="primary"
            className={classes.button}
            startIcon={<Home />}>
            Home
        </Button>
      </MenuItem>
      <MenuItem href='/canvas'>
        <Button
            href='/canvas'
            variant="outlined"
            color="primary"
            className={classes.button}
            startIcon={<Palette />}>
            Canvas
        </Button>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <Button
            variant="outlined"
            color="primary"
            className={classes.button}
            startIcon={<AccountCircle />}>
            Profile
        </Button>
      </MenuItem>
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <HideOnScroll {...props}>
      <AppBar >
        <Toolbar>

          <Typography className={classes.title} variant="h6" noWrap>
            {props.title}
          </Typography>

          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>


          <Tooltip title='Home'>
            <IconButton color="inherit"
            href='/home'>
              <Badge>
                <Home />
              </Badge>
            </IconButton>
            </Tooltip>

            <Tooltip title='Canvas'>
            <Button
                href='/canvas'
                variant="contained"
                color="primary"
                className={classes.button}
                startIcon={<Palette />}>
                Canvas
            </Button>
            </Tooltip>

            <Tooltip title='Profile'>
            <IconButton
              edge="end"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            </Tooltip>
            
          </div>

          <div className={classes.sectionMobile}>

            <Tooltip title='Home'>
            <IconButton color="inherit"
            href='/home'>
              <Badge>
                <Home />
              </Badge>
            </IconButton>
            </Tooltip>

            <Tooltip title='Canvas'>
            <IconButton
                href='/canvas'
                color="inherit">
                <Palette />
            </IconButton>
            </Tooltip>

            <Tooltip title='Profile'>
            <IconButton
              edge="end"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            </Tooltip>

          </div>
        </Toolbar>
      </AppBar>
      </HideOnScroll>
      {renderMobileMenu}
      {renderMenu}
    </div>
  );
}