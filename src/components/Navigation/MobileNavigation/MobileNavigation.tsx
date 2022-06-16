import React from 'react';

import NavigationItems from '../NavigationItems/NavigationItems';
import './MobileNavigation.css';

interface Props{
  open: boolean;
  onChooseItem: () => void;
  isAuth: boolean;
  onLogout: () => void;
  mobile: boolean;
}

const mobileNavigation : React.FC<Props>= props => (
  <nav className={['mobile-nav', props.open ? 'open' : ''].join(' ')}>
    <ul
      className={['mobile-nav__items', props.mobile ? 'mobile' : ''].join(' ')}
    >
      <NavigationItems
        mobile
        onChoose={props.onChooseItem}
        isAuth={props.isAuth}
        onLogout={props.onLogout}
      />
    </ul>
  </nav>
);

export default mobileNavigation;
