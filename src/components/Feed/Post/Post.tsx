import React from 'react';

import Button from '../../Button/Button';
import './Post.css';

interface Props{
  author: string;
  date: string;
  title: string;
  id?: string;
  image?: string;
  content?: string;
  onStartEdit: ()=>void;
  onDelete: ()=>void;

}

const post: React.FC<Props> = props => (
  <article className="post">
    <header className="post__header">
      <h3 className="post__meta">
        Posted by {props.author} on {props.date}
      </h3>
      <h1 className="post__title">{props.title}</h1>
    </header>
    {/* <div className="post__image">
      <Image imageUrl={props.image} contain />
    </div>
    <div className="post__content">{props.content}</div> */}
    <div className="post__actions">
      <Button mode="flat" link={props.id?props.id: null }>
        View
      </Button>
      <Button mode="flat" onClick={props.onStartEdit}>
        Edit
      </Button>
      <Button mode="flat" design="danger" onClick={props.onDelete}>
        Delete
      </Button>
    </div>
  </article>
);

export default post;
