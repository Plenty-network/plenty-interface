import { useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme, GlobalStyles } from './themes';

import Header from './Components/Header/Header';

import './App.scss';

function App() {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    console.log(theme);
    theme === 'light' ? setTheme('dark') : setTheme('light');
  };

  return (
    <>
      <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
        <GlobalStyles />
        <Header toggleTheme={toggleTheme} />
      </ThemeProvider>
    </>
  );
}

export default App;
