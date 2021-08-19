import { createGlobalStyle } from 'styled-components';
import styled from 'styled-components';

export const lightTheme = {
  name: 'light',
  body: '#F9FAFA',
  p: '#4e5d78',
  span: '#4e5d78',
  hr: '#d2d2d2',
  logo: '#5603AD',
  logoFrontPage: '#FFFFFF',
  frontPageGradient: 'linear-gradient(178.62deg, #7028E4 16.71%, #E5B2CA 217.99%)',
  frontPageBottomGradient: 'linear-gradient(94.97deg, #7028E4 4%, #E5B2CA 142.86%)',
  bg: '#FFFFFF',
  bgAlt: '#FFFFFF',
  backgroundLight: '#F9FAFA',
  borderDarkNone: '1px solid rgba(44, 9, 11, 0.08)',
  border: '1px solid rgba(44, 9, 11, 0.08)',
  btnFrontPage: '#823DE0',
  dropdownThemed: '#FFFFFF',
  iconFill: '#4E5D78',
  iconHoverFill: '#FFFFFF',
  iconBgStartColor: '#D2D5DB',
  iconBgEndColor: '#D2D5DB',
  iconHoverBgStartColor: '#7028E4',
  iconHoverBgEndColor: '#E5B2CA',
};

// body: 'linear-gradient(108.61deg, #A060D9 -24.15%, #7028E4 99.76%)',


export const darkTheme = {
  name: 'dark',
  body: 'linear-gradient(108.61deg, #04152E -24.15%, #343C49 99.76%)',
  p: '#FFFFFF',
  span: '#FFFFFF',
  hr: '#f1f1f1',
  logo: '#FFFFFF',
  logoFrontPage: '#FFFFFF',
  frontPageGradient: 'transparent',
  frontPageBottomGradient: 'transparent',
  bg: '#2D3751',
  bgAlt: '#2C3645',
  backgroundLight: '#394460',
  borderDarkNone: 'none',
  border: '1px solid rgba(44, 9, 11, 0.08)',
  btnFrontPage: '#19263A',
  dropdownThemed: 'rgba(255, 255, 255, 0.14)',
  iconFill: '#4E5D78',
  iconHoverFill: '#FFFFFF',
  iconBgStartColor: '#D2D5DB',
  iconBgEndColor: '#D2D5DB',
  iconHoverBgStartColor: '#7028E4',
  iconHoverBgEndColor: '#E5B2CA',
};

const themeColorsLight = {
  '--theme-primary-1': '#5C0FAE',
  '--theme-primary-2': '#D0BDE6',
  '--theme-secondary-1': '#E3D1FF',
  '--theme-primary-gradient-1': '#7028E4',
  '--theme-primary-gradient-2': '#E5B2CA',
  '--theme-secondary-gradient-1': '#F5F0FD',
  '--theme-secondary-gradient-2': '#FDFAFB',
  '--theme-card-bg': '#FFFFFF',
  '--theme-input-bg': '#F9FAFA',
  '--theme-text-1': '#4E5D78',
  '--theme-text-inactive': '#B0B7C3',
  '--theme-text-3': '#8A94A6',
  '--theme-text-4': '#B0B7C3',
  '--theme-bg-1': '#F9FAFA',
  '--theme-bg-2': '#F3F3F3',
  '--theme-bg-3': '#FAFBFC',
  '--theme-bg-4': '#FFFFFF',
  '--theme-border': '#F1F1F1',
  '--theme-default-btn': '#5C0FAE'
}

const themeColorsDark = {
  '--theme-primary-1': '#FFFFFF',
  '--theme-primary-2': '#8A94A6',
  '--theme-secondary-1': '#E3D1FF',
  '--theme-primary-gradient-1': '#7028E4',
  '--theme-primary-gradient-2': '#E5B2CA',
  '--theme-secondary-gradient-1': '#3A537B',
  '--theme-secondary-gradient-2': '#8F9AAC',
  '--theme-card-bg': '#2D3751',
  '--theme-input-bg': '#51596F',
  '--theme-text-1': '#FFFFFF',
  '--theme-text-inactive': '#B0B7C3', // TODO
  '--theme-text-3': '#8A94A6', // TODO
  '--theme-text-4': '#B0B7C3', // TODO
  '--theme-bg-1': '#394460',
  '--theme-bg-2': '#F3F3F3', // TODO
  '--theme-bg-3': '#FAFBFC', // TODO
  '--theme-bg-4': '#59617A',
  '--theme-border': '#4E576C',
  '--theme-default-btn': '#FFFFFF'
}

export const FrontPageGradientDiv = styled.div`
  background: ${(props) => props.theme.frontPageGradient};
`

export const FrontPageBottomGradientDiv = styled.div`
  background: ${(props) => props.theme.frontPageBottomGradient};
`

export const GlobalStyles = createGlobalStyle`
  body {
    background: ${(props) => props.theme.body};
  }
  
  p {
    color: ${(props) => props.theme.p};
  }
  
  .start-color {
    stop-color: ${(props) => props.theme.iconBgStartColor};
  }
  
  .end-color {
    stop-color: ${(props) => props.theme.iconBgEndColor};
  }
  
  .icon-themed {
    > .icon-fill-themed {
        fill: ${(props) => props.theme.iconFill};
      }
    
    &:hover {
      > .icon-fill-themed {
        fill: ${(props) => props.theme.iconHoverFill};
      }
       
      > defs stop:first-child {
        stop-color: ${(props) => props.theme.iconHoverBgStartColor};
      }
      
      > defs stop:last-child {
        stop-color: ${(props) => props.theme.iconHoverBgEndColor};
      }
    }
  }
  
  #medium-icon-bg {
    fill: url(#medium-icon-bg-gradient);
  }
 
  #twitter-icon-bg {
    fill: url(#twitter-icon-bg-gradient);
  }
  
  #discord-icon-bg {
    fill: url(#discord-icon-bg-gradient);
  }
  
  #telegram-icon-bg {
    fill: url(#telegram-icon-bg-gradient);
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
  
  :root {
    ${props => {
      const themeObject = props.theme.name === 'light' ? themeColorsLight : themeColorsDark;
      return Object.entries(themeObject).map(x => `${x[0]}: ${x[1]}`).join(';')
    }}
`;
