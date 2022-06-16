import React from 'react';
import ReactDOM from 'react-dom';

import './Backdrop.css';
interface Props {
  open?: boolean;
  onClick: ()=>void;

}

const backdrop: React.FC<Props> = props =>
  ReactDOM.createPortal(
    <div
      className={['backdrop', props.open ? 'open' : ''].join(' ')}
      onClick={props.onClick}
    />,
    document.getElementById('backdrop-root')!
  );

export default backdrop;
