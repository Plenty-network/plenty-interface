import { createGlobalStyle } from 'styled-components';
import styled from 'styled-components';

export const lightTheme = {
  body: '#F9FAFA',
  p: '#4e5d78',
  hr: '#d2d2d2',
  logo: '#5603AD',
  logoFrontPage: '#FFFFFF'
};
export const darkTheme = {
  body: '#202231',
  p: '#FFFFFF',
  hr: '#d2d2d2',
  logo: '#FFFFFF',
  logoFrontPage: '#FFFFFF'
};

export const StyledDiv = styled.div`
  background-color: ${(props) => props.theme.body};
`

export const GlobalStyles = createGlobalStyle`
  body {
    background-color: ${(props) => props.theme.body};
  }
  
  p {
    color: ${(props) => props.theme.p};
  }
  
  hr {
    border-top: 1px solid ${(props) => props.theme.hr}
  }
  
  .logo {
    fill: ${(props) => props.theme.logo}
  }
  
  .logoFrontPage {
    fill: ${(props) => props.theme.logoFrontPage}
  }
`;
