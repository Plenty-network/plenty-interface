import React from 'react';
import { ReactComponent as Discord } from '../../assets/images/footer/discord.svg';
import { ReactComponent as Twitter } from '../../assets/images/footer/twitter.svg';
import { ReactComponent as TezosIcon } from '../../assets/images/footer/building_on_tezos.svg';

const Footer = () => {
  return (
    <div className="col ">
      <div>
        <div className="row justify-content-center mb-2">
          <a href={'https://discord.gg/9wZ4CuvkuJ'} target="_blank" rel="noreferrer">
            <Discord className="mx-2 icon-themed" />
          </a>

          <a href={'https://twitter.com/plenty_network/'} target="_blank" rel="noreferrer">
            <Twitter className="mx-2 icon-themed" />
          </a>
        </div>
        <div className="row justify-content-center mb-2">
          <span className="text-white d-flex align-items-center">
            <span>Made with&nbsp;</span>
            <span className="material-icons-round small">favorite</span>
            <span>&nbsp;by Tezsure</span>
          </span>
        </div>
      </div>
      <div className="row justify-content-center mb-2">
        <a href={'https://tezos.com/'} target="_blank" rel="noreferrer">
          <TezosIcon className="mx-2 icon-themed" style={{ height: '50px' }} />
        </a>
      </div>
    </div>
  );
};

export default Footer;
