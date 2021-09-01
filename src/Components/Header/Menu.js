import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { Link, useLocation } from 'react-router-dom';
import NavDropdown from "react-bootstrap/NavDropdown";
import clsx from "clsx";

export const ExternalMenu = (props) => {
  const menu = [
    {
      title: 'Docs',
      link: 'https://plenty-defi.notion.site/Plenty-Docs-004ba25f40b641a3a276b84ebdc44971',
    },
    {
      title: 'Blog',
      link: 'https://medium.com/plenty-defi',
    },
    {
      title: 'GitHub',
      link: 'https://github.com/Plenty-DeFi',
    },
    {
      title: "Node Selector",
    },
  ];
  return (
    <>
      {menu.map((menu, index) => {
        return (
          menu.title !== "Node Selector" ? <NavDropdown.Item href={menu.link} target="_blank" key={index}>
            {menu.title}
          </NavDropdown.Item> : (
              <NavDropdown.Item target="_blank" key={index} onClick={props.toggleNodeSelectorHandler}>
                {menu.title}
              </NavDropdown.Item>
            )
        );
      })}
    </>
  );
};

export const NavigationMenu = (props) => {
  const menu = ['swap', 'farms', 'pools', 'ponds'];
  const location = useLocation();
  const { pathname } = location;
  const splitLocation = pathname.split('/');

  return (
    <>
      {menu.map((menu, index) => {
        return (
          <li
            className={
              splitLocation[1] === menu ? "menu-active" : undefined
            }
            key={index}
          >
            <Link to={menu} className={clsx(
                "nav-menu-item-link")}>
              <p className={clsx("m-0",
                  props.isFrontPage && "text-white")
              }>{menu}</p>
            </Link>
          </li>
        );
      })}
    </>
  );
};
