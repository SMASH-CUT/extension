import 'libs/polyfills';
import React from 'react';
import ReactDOM from 'react-dom';
import PopupButton from 'components/PopupButton';
import defaultTheme from 'themes/default';
import { ThemeProvider } from 'styled-components';
import Box from 'components/Box';

const Popup = () => (
  <ThemeProvider theme={defaultTheme}>
    <Box width="200px" padding={3} style={{ backgroundColor: 'rgb(33, 33, 31)' }}>
      <h1 style={{ color: 'white', textDecoration: 'underline' }}>ScreenplaySubs</h1>
      <a href="https://screenplaysubs.com/movies" target="_blank">
        <PopupButton>Supported Movies</PopupButton>
      </a>
    </Box>
  </ThemeProvider>
);

document.body.style.margin = 0;

const root = document.createElement('div');
document.body.appendChild(root);

ReactDOM.render(<Popup />, root);
