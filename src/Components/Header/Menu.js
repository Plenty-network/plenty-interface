import Dropdown from 'react-bootstrap/Dropdown';

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
  const menu = ['Swap', 'Farms', 'Pools', 'Ponds'];
  return (
    <>
      {menu.map((menu, index) => {
        return (
          <li className="nav-menu-item" key={index}>
            <a href="#" className="nav-menu-item-link">
              {menu}
            </a>
          </li>
        );
      })}
    </>
  );
};
