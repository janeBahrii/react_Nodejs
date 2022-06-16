import React from 'react';

import Image from './Image';
import './Avatar.css';
interface Props{
  image: string;
  size: string;
}

const avatar: React.FC<Props> = props => (
  <div
    className="avatar"
    style={{ width: props.size + 'rem', height: props.size + 'rem' }}
  >
    <Image imageUrl={props.image} />
  </div>
);

export default avatar;
