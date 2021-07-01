import { createGlobalStyle } from 'styled-components';

export const lightTheme = {
  body: '#F9FAFA',
};
export const darkTheme = {
  body: '#202231',
};

export const GlobalStyles = createGlobalStyle`
  body {
    background-color: ${(props) => props.theme.body};
  }
`;
