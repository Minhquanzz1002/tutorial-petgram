// import React, { useState } from 'react'
import { Link, withRouter } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import { alpha, makeStyles } from '@material-ui/core/styles';
import {
  AppBar,
  Avatar,
  Toolbar,
  IconButton,
  Typography,
  Badge,
  MenuItem,
  Menu,
  Button,
} from '@material-ui/core';
import VerifiedUserSharpIcon from '@material-ui/icons/VerifiedUserSharp'
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import './Navbar.css'
import sha1 from 'sha1';


const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    display: 'block',
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  navbars: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  title: {
    textDecoration: "none",
    color: "white",
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
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
  navlinks: {
    marginLeft: theme.spacing(2),
    display: "flex",
  },
  link: {
    textDecoration: "none",
    color: "white",
    fontSize: "20px",
    marginLeft: theme.spacing(3),
    "&:hover": {
      borderBottom: "1px solid white",
    },
  },
}));

export const Navbar = withRouter(({ account, connectWallet }) => {
  const classes = useStyles();
  const [user, setUser] = useState('')
  const [accountMenuAnchorEl, setAccountMenuAnchorEl] = useState(null);
  const [mobileNavAnchorEl, setMobileNavAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);

  const isAccountMenuOpen = Boolean(accountMenuAnchorEl);
  const isMobileNavOpen = Boolean(mobileNavAnchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  useEffect(() => {
    getUserData()
  }, [account])

  const handleAccountMenuOpen = (event) => {
    setAccountMenuAnchorEl(event.currentTarget);
  };

  const handleAccountMenuClose = () => {
    setAccountMenuAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleMobileNavClose = () => {
    setMobileNavAnchorEl(null);
  };

  const handleMobileNavOpen = (event) => {
    setMobileNavAnchorEl(event.currentTarget);
  };

  const getUserData = async () => {
    let user_hash = sha1(account);
    let data = await fetch(`http://localhost:8000/api/user/getOne/${user_hash}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    let userAccount = await data.json();
    setUser(userAccount);
  }

  const accountMenuId = 'primary-account-menu';
  const renderAccountMenu = (
    <Menu
      anchorEl={accountMenuAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={accountMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isAccountMenuOpen}
      onClose={handleAccountMenuClose}
    >
      <MenuItem onClick={handleAccountMenuClose} component={Link} to="/profile">Profile</MenuItem>
      <MenuItem onClick={() => window.location.reload()}>Logout</MenuItem>
    </Menu>
  );

  const mobileNavId = 'primary-nav-menu';
  const renderMobileNav = (
    <Menu
      anchorEl={mobileNavAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileNavId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileNavOpen}
      onClose={handleMobileNavClose}
    >
      <MenuItem component={Link} onClick={handleMobileNavClose} to="/">Home</MenuItem>
      <MenuItem component={Link} onClick={handleMobileNavClose} to="/create-pet">Create Pet</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-account-menu-mobile';
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
      <MenuItem onClick={handleMobileMenuClose}>
        <IconButton aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="secondary">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem onClick={handleMobileMenuClose}>
        <IconButton aria-label="show 11 new notifications" color="inherit">
          <Badge badgeContent={11} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleAccountMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  // getUserData();

  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
            aria-controls={mobileNavId}
            aria-haspopup="true"
            onClick={handleMobileNavOpen}
          >
            <MenuIcon />
          </IconButton>
          <Typography component={Link} className={classes.title} variant="h6" noWrap to="/">
            PetGram
          </Typography>
          <Typography className={classes.navbars}>
            <div className={classes.navlinks}>
              <Link to="/" className={classes.link}>
                Home
              </Link>
              <Link to="/create-pet" className={classes.link}>
                Create Pet
              </Link>
            </div>
          </Typography>

          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            {/* Add Account  */}
            {
              account ? (
                <Button
                  variant="contained"
                  className="connected-btn"
                  style={{ backgroundColor: "#15d636cc", color: "white", height: "2.5rem", marginTop: "0.8rem"}}
                  endIcon={<VerifiedUserSharpIcon />}
                >
                  {account.substring(0, 4)}...{account.substring(account.length - 4, account.length)}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  className="connect-wallet-btn"
                  style={{backgroundColor: "#06c2fbcc", fontSize: "0.7rem", color: "white", height: "2.5rem", marginTop: "0.8rem"}}
                  onClick={() => {
                    connectWallet()
                  }}
                >
                  Connect Wallet
                </Button>
              )
            }
            <IconButton aria-label="show 4 new mails" color="inherit">
              <Badge badgeContent={4} color="secondary">
                <MailIcon />
              </Badge>
            </IconButton>
            <IconButton aria-label="show 17 new notifications" color="inherit">
              <Badge badgeContent={17} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={accountMenuId}
              aria-haspopup="true"
              onClick={handleAccountMenuOpen}
              color="inherit"
            >
              {user ? (<Avatar alt="Account" src={user.avatar} />) : <AccountCircle />}
            </IconButton>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderAccountMenu}
      {renderMobileNav}
    </div>
  );
})

