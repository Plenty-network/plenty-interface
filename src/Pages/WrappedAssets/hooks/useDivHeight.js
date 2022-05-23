import { useLayoutEffect, useMemo, useState } from 'react';
import debounce from 'lodash/debounce';

/**
 * @Hook
 * Function to compute the main div height of wrapped asset module for bg image fit to screen.
 * @returns {string} Computed height of the main div.
 */
const useDivHeight = () => {
  const [divHeight, setDivHeight] = useState('87vh');

  const heightHandler = () => {
    const headerHeight = document.getElementsByClassName('header')[0].clientHeight;
    const viewportHeight = document.documentElement.clientHeight;
    const waDivHeight = viewportHeight - headerHeight - 1;
    // Calculate the height including margins for the swap components
    const swapComponent = document.getElementsByClassName('wrapped-assets-margin-top')[0];
    const swapComponentsMargins =
      parseFloat(window.getComputedStyle(swapComponent)['marginTop']) +
      parseFloat(window.getComputedStyle(swapComponent)['marginBottom']);
    const swapComponentsHeight = swapComponent.clientHeight + swapComponentsMargins + 20;
    // For cases when the swap components overflow the screen, then their height is more than viewport. Hence choose that height as main div height. (Mobile landscape orientation)
    const finalWADivHeight =
      waDivHeight > swapComponentsHeight ? waDivHeight : swapComponentsHeight;
    //Assign the final height to the div. Supporting older browsers as well.
    setDivHeight(`${finalWADivHeight}px`);
  };

  // Debounce to avoid unnecessary multiple resize events triggered by various browsers.
  const updateHeight = useMemo(() => debounce(heightHandler, 50), []);

  // Event listener to listen to window resize event for changing the wrapped assets main div height.
  useLayoutEffect(() => {
    window.addEventListener('resize', updateHeight);
    updateHeight();
    return () => {
      window.removeEventListener('resize', updateHeight);
      updateHeight.cancel();
    };
  }, []);

  return divHeight;
};

export default useDivHeight;
