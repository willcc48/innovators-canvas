import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  root: {
    marginLeft: 20,
    minWidth: 100,
    maxWidth: 200
  }
});

export default function OutlinedCard(props) {
  const classes = useStyles();
  return (
    <Card className={classes.root} variant="outlined">
      <CardContent>
        <Typography variant="h6">
          {props.firstName} {props.lastName}
        </Typography>
        <Typography color="textSecondary">
          {props.netid}
        </Typography>
      </CardContent>
    </Card>
  );
}