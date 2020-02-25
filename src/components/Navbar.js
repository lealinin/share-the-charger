import React from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MailIcon from '@material-ui/icons/Mail';
import EventRoundedIcon from '@material-ui/icons/EventRounded';
import EvStationRoundedIcon from '@material-ui/icons/EvStationRounded';
import AddLocationRoundedIcon from '@material-ui/icons/AddLocationRounded';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Button from '@material-ui/core/Button';
import logo from '../assets/Logo.png';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    backgroundColor: '#66CDAA'      
  },
  // button: {
  //   marginRight: 'right',
  //   textAlign: 'right',
  //   marginLeft: theme.spacing(110),
  // },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  typography: {
    flex: 1,
    marginLeft: '1rem',
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

export default function PersistentDrawerLeft(props) {


  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  // console.log(`1st props name : ${props}`)
  
  function LoginButton() {
    if (props.userState.isAuthenticated) {
     return <Button color="inherit" onClick={props.logoutClick} userState={props.userState} setUserState={props.setUserState}>Logout</Button>    
    } else {
      return (
      <>
        <Button color="inherit" open={open} onClick={props.loginClick} userState={props.userState} setUserState={props.setUserState}>Login</Button> |
        <Button color="inherit" open={open} onClick={props.signUpClick} userState={props.userState} setUserState={props.setUserState}>Sign Up</Button> 
      </>
      )
    }
  }


  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
        { props.userState.isAuthenticated ? 
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
            
          </IconButton>
          : '' }
          <img src={logo} height="30px" alt="Logo" />
          <Typography variant="h6" noWrap className={classes.typography}>
            Share the Charger{ props.userState.isAuthenticated ? `, ${props.userState.firstName}`  : "" }
          </Typography>          

          <LoginButton  />
        </Toolbar>
      </AppBar>



      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton  onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>  
          

        </div>
        <Divider />
        <List>
          
          {['My Bookings'].map((text, index) => (
            <ListItem button key={text} open={open} onClick={props.myBookingsClick}>
              <ListItemIcon>{index % 2 === 0 ? <EventRoundedIcon /> : <MailIcon />}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {['Add a Charger'].map((text, index) => (
            <ListItem button key={text} open={open} onClick={props.addChargerClick}>
              <ListItemIcon>{index % 2 === 0 ? <AddLocationRoundedIcon /> : <EvStationRoundedIcon />}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
        <List>
          {['My Chargers'].map((text, index) => (
            <ListItem button key={text} open={open} onClick={props.myChargersClick}  userState={props.userState} setUserState={props.setUserState}>
              <ListItemIcon>{index % 2 === 0 ? <EvStationRoundedIcon /> : < AddLocationRoundedIcon/>}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {['My Account'].map((text, index) => (
            <ListItem button key={text} open={open} onClick={props.myAccountClick}>
              <ListItemIcon>{index % 2 === 0 ? <AccountCircleIcon /> : <MailIcon />}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>

      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
      </main>
    </div>
    

  );
}