import { FC } from 'react';
import Dashboard from 'screens/Dashboard';
import MintrHome from 'screens/MintrHome';
import LiquidationBanner from 'components/BannerLiquidation';

type MainProps = {
  wallet: string;
};

const Main: FC<MainProps> = ({ wallet }) => {
  return (
    <>
      <LiquidationBanner />
      <Dashboard />
      <MintrHome />
    </>
  );
};

export default Main;
