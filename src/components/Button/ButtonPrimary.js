import React from 'react';
import styled from 'styled-components';
import { Button, makeStyles } from '@material-ui/core';
import { ButtonPrimaryLabelMedium } from '../Typography';

const useStyles = makeStyles(({ typography }) => ({
  label: {
    fontWeight: 'inherit',
  },
  containedSizeLarge: {
    fontSize: typography.fontSize * 1.15,
    fontWeight: typography.fontWeightBold,
  },
  outlinedSizeLarge: {
    fontSize: typography.fontSize * 1.15,
    fontWeight: typography.fontWeightBold,
  },
  textSizeLarge: {
    fontSize: typography.fontSize * 1.15,
    fontWeight: typography.fontWeightBold,
  },
}));

export const ButtonPrimary = ({ children, onClick, disabled, ...props }) => {
  const classes = useStyles();
  return (
    <Button
      variant="contained"
      color="primary"
      size="large"
      fullWidth
      onClick={onClick}
      disabled={disabled}
      classes={classes}
      {...props}
    >
      {children}
    </Button>
  );
};

export const ButtonPrimaryMedium = ({ children, onClick, disabled }) => {
  return (
    <ButtonMedium disabled={disabled} onClick={onClick}>
      <ButtonPrimaryLabelMedium>{children}</ButtonPrimaryLabelMedium>
    </ButtonMedium>
  );
};

// const Button = styled.button`
//   width: ${props => (props.width ? props.width : '400px')};
//   height: ${props => (props.height ? props.height : '56px')};
//   border-radius: 5px;
//   text-transform: uppercase;
//   border: none;
//   cursor: pointer;
//   background-color: ${props => props.theme.colorStyles.buttonPrimaryBg};
//   transition: all ease-in 0.1s;
//   &:disabled {
//     opacity: 0.5;
//     cursor: not-allowed;
//   }
//   &:hover:not(:disabled) {
//     background-color: ${props => props.theme.colorStyles.buttonPrimaryBgFocus};
//   }
// `;

const ButtonMedium = styled(Button)`
  width: 162px;
  height: 48px;
  :disabled {
    opacity: 0.4;
    pointer-events: none;
  }
`;
