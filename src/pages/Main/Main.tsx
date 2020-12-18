import { FC } from 'react';
import Dashboard from 'screens/Dashboard';
import MintrHome from 'screens/MintrHome';
import LiquidationBanner from 'components/BannerLiquidation';
import { makeStyles } from '@material-ui/core';

type MainProps = {
  wallet: string;
};

const useStyles = makeStyles(theme => ({
  root: {
    background: 'radial-gradient(#11263B, #120C1C);',
  },
}));

const Main: FC<MainProps> = ({ wallet }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <LiquidationBanner />
      <Dashboard />
      <MintrHome />
    </div>
  );
};

export default Main;
