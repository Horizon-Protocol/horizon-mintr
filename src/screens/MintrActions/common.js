import styled from 'styled-components';
import clsx from 'clsx';
import { Paper, Typography, makeStyles } from '@material-ui/core';

export const Container = styled.div`
  width: 100%;
  height: 640px;
  max-width: 720px;
  margin: 0 auto 20px;
  padding: 64px 165px;
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

const useErrorStyles = makeStyles(({ palette }) => ({
  h5: {
    marginTop: 12,
    textTransform: 'none',
    marginBottom: 16,
  },
  h6: {
    marginBottom: 16,
    color: palette.error.light,
  },
  body1: {
    marginBottom: 16,
    color: palette.text.hint,
  },
}));

export const ErrorTitle = props => {
  const classes = useErrorStyles();
  return <Typography variant="h5" classes={classes} {...props} />;
};
export const ErrorCode = props => {
  const classes = useErrorStyles();
  return <Typography variant="h6" classes={classes} {...props} />;
};
export const ErrorDesc = props => {
  const classes = useErrorStyles();
  return <Typography variant="body1" classes={classes} {...props} />;
};

const useAmountCardStyles = makeStyles(() => ({
  root: {
    padding: 12,
    backgroundColor: '#0A171F',
    border: '1px solid #11263B',
    lineHeight: '16px',
  },
  value: {
    marginTop: 8,
    fontSize: ({ small }) => (small ? 18 : 24),
    lineHeight: '28px',
    color: ({ color }) => color,
  },
}));
export const AmountCard = ({ label, value, color, small, className, ...props }) => {
  const classes = useAmountCardStyles({ color, small });

  return (
    <Paper variant="outlined" className={clsx(classes.root, className)} {...props}>
      <Body2>{label}</Body2>
      <Typography classes={{ root: classes.value }}>{value}</Typography>
    </Paper>
  );
};
