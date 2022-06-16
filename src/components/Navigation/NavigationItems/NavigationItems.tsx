import React from 'react';
import { NavLink } from 'react-router-dom';

import './NavigationItems.css';

const navItems = [
  { id: 'feed', text: 'Feed', link: '/', auth: true },
  { id: 'login', text: 'Login', link: '/', auth: false },
  { id: 'signup', text: 'Signup', link: '/signup', auth: false }

];

interface Props {
  isAuth: boolean;
  mobile?: boolean;
  onChoose?: ()=>void;
  onLogout: ()=>void;
}

const navigationItems: React.FC<Props> = (props: Props )=>{
  const navItms = [
    ...navItems.filter(item => item.auth === props.isAuth).map(item => (
      <li
        key={item.id}
        className={['navigation-item', props.mobile ? 'mobile' : ''].join(' ')}
      >
        <NavLink  to={item.link} end onClick={props.onChoose}>
          {item.text}
        </NavLink>
      </li>
    )),
    props.isAuth && (
      <li className="navigation-item" key="logout">
        <button onClick={props.onLogout}>Logout</button>
      </li>
    )
  ];
  return(<>
  {navItms}
  </>)
} 

export default navigationItems;
