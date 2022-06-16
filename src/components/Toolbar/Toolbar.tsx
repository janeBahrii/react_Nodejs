import React from 'react';

import './Toolbar.css';

interface Props{
    children: React.ReactNode;
}

const toolbar: React.FC<Props> = props => (
    <div className="toolbar">
       {props.children}
    </div>
);

export default toolbar;