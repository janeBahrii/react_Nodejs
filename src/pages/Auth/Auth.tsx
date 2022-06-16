import React from 'react';

import './Auth.css';
interface Props{
    children?: React.ReactNode;
}

const auth:React.FC<Props> = props => <section className="auth-form">{props.children}</section>;

export default auth;
