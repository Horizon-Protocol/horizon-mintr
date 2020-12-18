import styled from 'styled-components';
import { Button, Typography, makeStyles } from '@material-ui/core';

export const Container = styled.div`
  width: 100%;
  height: 640px;
  max-width: 720px;
  margin: 0 auto 20px;
  padding: 64px 180px;
  overflow: hidden;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  justify-content: space-around;
`;

export const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
`;
export const InfoCol = styled.div`
  display: flex;
  justify-content: center;
`;

export const ActionImage = styled.img`
  height: ${props => (props.big ? '64px' : '48px')};
  width: ${props => (props.big ? '64px' : '48px')};
  margin-bottom: 8px;
`;

export const Form = styled.div`
  margin: 0px 0px 10px 0px;
`;

export const Navigation = styled.div`
  width: 100%;
  display: flex;
  text-align: left;
`;

const useTextStyles = makeStyles(({ palette }) => ({
  h5: {
    marginBottom: 16,
  },
  body1: {
    marginBottom: 16,
    color: palette.text.secondary,
  },
  body2: {
    color: palette.text.hint,
    fontSize: 12,
  },
}));

export const Intro = styled.div`
  margin-bottom: 16px;
`;

export const Body2 = props => {
  const classes = useTextStyles();
  return <Typography variant="body2" classes={classes} {...props} />;
};

export const IntroTitle = props => {
  const classes = useTextStyles();
  return <Typography variant="h5" classes={classes} {...props} />;
};

export const IntroDesc = props => {
  const classes = useTextStyles();
  return <Typography variant="body1" classes={classes} {...props} />;
};
