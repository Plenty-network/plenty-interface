import ctez from '../assets/images/ctez.png';
import xtz from '../assets/images/tez.png';

export const stableSwapTokens = [
  {
    name: 'tez',
    image: xtz,
    new: true,
  },
  {
    name: 'CTEZ',
    image: ctez,
    new: false,
    extra: {
      text: 'Get ctez',
      link: 'https://ctez.app',
    },
  },
];
