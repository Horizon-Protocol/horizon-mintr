import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#3481B7',
      // light: '#6cb0e9',
      // dark: '#005587',
    },
    secondary: {
      main: '#122e42',
      // light: '#3e576d',
      // dark: '#00031c',
    },
    background: {
      default: '#09161F',
      paper: '#101A2A',
    },
    text: {
      disabled: 'rgba(255, 255, 255, 0.5)',
      hint: '#88ABC3',
      primary: '#fff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
});

export default theme;
