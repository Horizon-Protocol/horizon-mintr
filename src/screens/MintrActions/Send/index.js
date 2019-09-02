import React from 'react';
import Action from './Action';
import Confirmation from './Confirmation';
import Complete from './Complete';

const Send = ({ onDestroy }) => {
  const props = {
    onDestroy,
  };
  return [Action, Confirmation, Complete].map((SlideContent, i) => (
    <SlideContent key={i} {...props} />
  ));
};

export default Send;