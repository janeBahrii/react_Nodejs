import React from 'react';

import './Loader.css';

interface Props{

}

const loader: React.FC<Props> = props => (
  <div className="loader">
    <div />
    <div />
    <div />
    <div />
  </div>
);

export default loader;
