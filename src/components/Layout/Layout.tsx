import React, { Fragment, ReactElement } from 'react';

import './Layout.css';

interface Props{
  header: ReactElement;
  mobileNav: ReactElement;
  children?: React.ReactNode;
}

const layout:React.FC<Props> = props => (
  <Fragment>
    <header className="main-header">{props.header}</header>
    {props.mobileNav}
    <main className="content">{props.children}</main>
  </Fragment>
);

export default layout;
