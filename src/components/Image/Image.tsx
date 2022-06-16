
import React from 'react';

import './Image.css';
interface Props {
  imageUrl: string|ArrayBuffer;
  contain?: boolean;
  left?: boolean;

}

const image: React.FC<Props> = props => (
  <div
    className="image"
    style={{
      backgroundImage: `url('${props.imageUrl}')`,
      backgroundSize: props.contain ? 'contain' : 'cover',
      backgroundPosition: props.left ? 'left' : 'center'
    }}
  />
);

export default image;
