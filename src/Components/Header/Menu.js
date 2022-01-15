import PropTypes from 'prop-types';
import React from 'react';
import { NavDropdown } from 'react-bootstrap';

export const ExternalMenu = (props) => {
  const menu = [
    {
      title: 'Docs',
      link: 'https://plenty-defi.notion.site/Plenty-Docs-004ba25f40b641a3a276b84ebdc44971',
    },
    {
      title: 'Blog',
      link: 'https://plentydefi.medium.com/',
    },
    {
      title: 'GitHub',
      link: 'https://github.com/Plenty-DeFi',
    },
    {
      title: 'Node Selector',
    },
  ];
  return (
    <>
      {menu.map((menu, index) => {
        return menu.title !== 'Node Selector' ? (
          <NavDropdown.Item href={menu.link} key={index}>
            {menu.title}
          </NavDropdown.Item>
        ) : (
          <NavDropdown.Item key={index} onClick={props.toggleNodeSelectorHandler}>
            {menu.title}
          </NavDropdown.Item>
        );
      })}
    </>
  );
};

ExternalMenu.propTypes = {
  toggleNodeSelectorHandler: PropTypes.func,
};
