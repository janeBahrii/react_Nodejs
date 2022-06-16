import React from 'react';

import './MobileToggle.css';
interface Props{
  onOpen: ()=> void;
}

const mobileToggle: React.FC<Props> = props => (
  <button className="mobile-toggle" onClick={props.onOpen}>
    <span className="mobile-toggle__bar" />
    <span className="mobile-toggle__bar" />
    <span className="mobile-toggle__bar" />
  </button>
);

export default mobileToggle;
