import Dropdown from 'react-bootstrap/Dropdown';
import { Link, useLocation } from 'react-router-dom';

export const ExternalMenu = () => {
  const menu = [
    {
      title: 'Docs',
      link: 'https://www.notion.so/Plenty-Docs-082b61c1859e4c4f86d01c3daa0db9ed',
    },
    {
      title: 'Blog',
      link: 'https://medium.com/plenty-defi',
    },
    {
      title: 'Github',
      link: 'https://github.com/Plenty-DeFi',
    },
    {
      title: 'Roadmap',
      link: 'https://www.notion.so/Roadmap-3d24ab4912c04d48859c332059c665ca',
    },
  ];
  return (
    <>
      {menu.map((menu, index) => {
        return (
          <Dropdown.Item href={menu.link} target="_blank" key={index}>
            {menu.title}
          </Dropdown.Item>
        );
      })}
    </>
  );
};

export const NavigationMenu = () => {
  //const menu = ['swap', 'farms', 'pools', 'ponds'];
  const menu = ['swap'];
  const location = useLocation();
  const { pathname } = location;
  const splitLocation = pathname.split('/');

  return (
    <>
      {menu.map((menu, index) => {
        return (
          <li
            className={
              splitLocation[1] === menu
                ? 'nav-menu-item menu-active'
                : 'nav-menu-item'
            }
            key={index}
          >
            <Link to={menu} className="nav-menu-item-link">
              {menu}
            </Link>
          </li>
        );
      })}
    </>
  );
};
