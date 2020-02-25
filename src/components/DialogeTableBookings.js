import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import clsx from 'clsx';

import TableBookings from './TableBookings'

const useStyles = makeStyles(theme => ({
  appBar: {
    position: 'relative',
    backgroundColor: '#66CDAA'
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


export default function FullScreenDialog(props) {
  const classes = useStyles();

  return (
    <div>
      <Dialog fullScreen open={props.open} onClose={props.handleClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={props.handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              My Bookings
            </Typography>
            <Button autoFocus color="inherit" onClick={props.handleClose}>
              close
            </Button>
          </Toolbar>
        </AppBar>

      <TableBookings userState={props.userState}/>  

      </Dialog>
    </div>
  );
}
