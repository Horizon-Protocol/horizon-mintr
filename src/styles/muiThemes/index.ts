import { createMuiTheme, Theme } from '@material-ui/core/styles';

const theme: Theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#3481B7',
    },
    background: {
      default: '#09161F',
    },
  },
});

export default theme;
