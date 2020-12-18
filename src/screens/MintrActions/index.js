import { ACTIONS_MAP } from 'constants/actions';
import Slider from 'components/ScreenSlider';

import Mint from './Mint';
import Burn from './Burn';
import Claim from './Claim';
import Trade from './Trade';
import Send from './Transfer';
import Track from './Track';

const getActionComponent = action => {
  switch (action) {
    case ACTIONS_MAP.mint:
      return Mint;
    case ACTIONS_MAP.burn:
      return Burn;
    case ACTIONS_MAP.claim:
      return Claim;
    case ACTIONS_MAP.trade:
      return Trade;
    case ACTIONS_MAP.transfer:
      return Send;
    case ACTIONS_MAP.track:
      return Track;
    default:
      return;
  }
};

const MintrAction = ({ action, ...props }) => {
  const ActionComponent = getActionComponent(action);

  if (!action) return null;

  return (
    <Slider screen={action}>
      <ActionComponent {...props} />
    </Slider>
  );
};

export default MintrAction;
