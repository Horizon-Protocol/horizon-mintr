import React from 'react';
import { Button } from '@material-ui/core';
import { withTranslation } from 'react-i18next';

import { ButtonPrimaryLabelSmall } from '../Typography';

const ButtonMax = ({ t, onClick }) => {
  return (
    <Button variant="contained" color="primary" size="small" onClick={onClick}>
      <ButtonPrimaryLabelSmall>{t('button.max')}</ButtonPrimaryLabelSmall>
    </Button>
  );
};

export default withTranslation()(ButtonMax);
