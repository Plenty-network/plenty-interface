import { createGlobalStyle } from 'styled-components';
import styled from 'styled-components';

export const lightTheme = {
  body: '#F9FAFA',
  p: '#4e5d78'
};
export const darkTheme = {
  body: '#202231',
  p: '#4e5d78'
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
`;
