import React from 'react';
import { ReactComponent as Discord } from '../../assets/images/footer/discord.svg';
import { ReactComponent as Telegram } from '../../assets/images/footer/telegram.svg';
import { ReactComponent as Twitter } from '../../assets/images/footer/twitter.svg';

const Footer = () => {
  return (
    <div>
      <div className="row justify-content-center mb-2">
        <a href={'https://discord.gg/9wZ4CuvkuJ'} target="_blank" rel="noreferrer">
          <Discord className="mx-2 icon-themed" />
        </a>
        <a href={'https://t.me/PlentyDeFi'} target="_blank" rel="noreferrer">
          <Telegram className="mx-2 icon-themed" />
        </a>
        <a href={'https://twitter.com/PlentyDeFi'} target="_blank" rel="noreferrer">
          <Twitter className="mx-2 icon-themed" />
        </a>
      </div>
      <div>
        <span className="text-white d-flex align-items-center">
          <span>Made with&nbsp;</span>
          <span className="material-icons-round small">favorite</span>
          <span>&nbsp;by Tezsure & DGH</span>
        </span>
      </div>
    </div>
  );
};

export default Footer;
