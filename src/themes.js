import { createGlobalStyle } from 'styled-components';
import styled from 'styled-components';
import lineBg from './assets/images/banner-bg.png';

export const lightTheme = {
  name: 'light',
  body: '#F9FAFA',
  p: '#4e5d78',
  span: '#4e5d78',
  hr: '#d2d2d2',
  logo: '#5603AD',
  logoFrontPage: '#FFFFFF',
  // frontPageGradient: `linear-gradient(178.62deg, #7028E4 16.71%, #E5B2CA 217.99%)`,
  // frontPageBottomGradient: `linear-gradient(94.97deg, #7028E4 4%, #E5B2CA 142.86%)`,
  frontPageGradient: `url(${lineBg}), linear-gradient(180.62deg,#7028E4 100.71%,#E5B2CA 0%)`,
  frontPageBottomGradient: `url(${lineBg}), linear-gradient(180.62deg,#7028E4 100.71%,#E5B2CA 0%)`,
  topGradient: 'linear-gradient(178.62deg, #7028E4 16.71%, #E5B2CA 217.99%)',
  bg: '#FFFFFF',
  bgAlt: '#FFFFFF',
  backgroundLight: '#F9FAFA',
  borderDarkNone: '1px solid rgba(44, 9, 11, 0.08)',
  border: '1px solid rgba(44, 9, 11, 0.08)',
  btnFrontPage: '#823DE0',
  dropdownThemed: '#FFFFFF',
  dropdownThemedHighlight: '#eeeeee',
  iconFill: '#4E5D78',
  iconHoverFill: '#6202ef',
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
  frontPageGradient: `url(${lineBg})`,
  frontPageBottomGradient: `url(${lineBg})`,
  topGradient: 'transparent',
  // frontPageGradient: ``,
  // frontPageBottomGradient: ``,
  bg: '#201c41',
  bgAlt: '#252146',
  backgroundLight: '#343052',
  borderDarkNone: 'none',
  border: '1px solid rgba(44, 9, 11, 0.08)',
  btnFrontPage: '#19263A',
  dropdownThemed: '#514b6b',
  dropdownThemedHighlight: '#5e6884',
  iconFill: '#4E5D78',
  iconHoverFill: '#6202ef',
  iconBgStartColor: '#D2D5DB',
  iconBgEndColor: '#D2D5DB',
  iconHoverBgStartColor: '#7028E4',
  iconHoverBgEndColor: '#E5B2CA',
};

export const FrontPageGradientDiv = styled.div`
  background-image: ${(props) => props.theme.frontPageGradient};
`;

export const TopGradientDiv = styled.div`
  background-image: ${(props) => props.theme.topGradient};
`;

export const FrontPageBottomGradientDiv = styled.div`
  background-image: ${(props) => props.theme.frontPageBottomGradient};
`;

export const GlobalStyles = createGlobalStyle`
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
       
      // > defs stop:first-child {
      //   stop-color: ${(props) => props.theme.iconHoverBgStartColor};
      // }
      
      // > defs stop:last-child {
      //   stop-color: ${(props) => props.theme.iconHoverBgEndColor};
      // }
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
    
    &:hover {
          background: ${(props) => props.theme.dropdownThemedHighlight};
    };
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
