import { createGlobalStyle } from 'styled-components';
import styled from 'styled-components';

export const lightTheme = {
  body: '#F9FAFA',
  p: '#4e5d78',
  span: '#4e5d78',
  hr: '#d2d2d2',
  logo: '#5603AD',
  logoFrontPage: '#FFFFFF',
  frontPageGradient: 'linear-gradient(178.62deg, #7028E4 16.71%, #E5B2CA 217.99%)',
  bg: '#FFFFFF',
  bgAlt: '#FFFFFF',
  backgroundLight: '#F9FAFA',
  borderDarkNone: '1px solid rgba(44, 9, 11, 0.08)',
  border: '1px solid rgba(44, 9, 11, 0.08)',
  btnFrontPage: '#823DE0',
  dropdownThemed: '#FFFFFF'
};
export const darkTheme = {
  body: 'linear-gradient(108.61deg, #04152E -24.15%, #343C49 99.76%)',
  p: '#FFFFFF',
  span: '#FFFFFF',
  hr: '#f1f1f1',
  logo: '#FFFFFF',
  logoFrontPage: '#FFFFFF',
  frontPageGradient: 'transparent',
  bg: '#2D3751',
  bgAlt: '#2C3645',
  backgroundLight: '#394460',
  borderDarkNone: 'none',
  border: '1px solid rgba(44, 9, 11, 0.08)',
  btnFrontPage: '#19263A',
  dropdownThemed: 'rgba(255, 255, 255, 0.14)'
};

export const FrontPageGradientDiv = styled.div`
  background: ${(props) => props.theme.frontPageGradient};
`

export const GlobalStyles = createGlobalStyle`
  body {
    background: ${(props) => props.theme.body};
  }
  
  p {
    color: ${(props) => props.theme.p};
  }
  
  hr {
    border-top: 1px solid ${(props) => props.theme.hr}
    opacity: 0.1;
  }
  
  .span-themed {
    color: ${(props) => props.theme.span} !important;
  }
  
  .bg-themed {
    background: ${(props) => props.theme.bg} !important;
  }
  
  .bg-themed-alt {
    background: ${(props) => props.theme.bgAlt};
  }
  
  .bg-themed-light {
    background: ${(props) => props.theme.backgroundLight};
  }
  
  .modal-themed {
    .modal-content {
      background-color: ${(props) => props.theme.bg} !important;
    }
  }
  
  .border-themed-dark-none {
    border: ${(props) => props.theme.borderDarkNone};
  }
  
  .border-bottom-themed-dark-none {
    border-bottom: ${(props) => props.theme.borderDarkNone};
  }
  
  .border-bottom-themed {
    border-bottom: ${(props) => props.theme.border};
  }
  
  .dropdown-themed {
    background: ${(props) => props.theme.dropdownThemed};
  }
  
  .logo {
    fill: ${(props) => props.theme.logo};
  }
  
  .logo-frontPage {
    fill: ${(props) => props.theme.logoFrontPage};
  }
  
  .btn-frontPage {
    color: ${(props) => props.theme.btnFrontPage};
  }
`;
