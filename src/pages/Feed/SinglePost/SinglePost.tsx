import React, { useEffect,useState } from 'react';
import { useParams } from 'react-router-dom';

import Image from '../../../components/Image/Image';
import './SinglePost.css';

type   ResData={ 
post?:
  {title:string;
  creator:{
    name: string;
  };
  createdAt: Date;
  content: string;
  imageUrl: string;}


  error?:{
    message? :string,
    errors: []
    status: number;

  }
}

interface Props{
  userId: string;
  token:string;

}

const  SinglePost : React.FC<Props>= (props) => {
  const {postId} = useParams();
  const [state,setState] = useState({
    title: '',
    author: '',
    date: '',
    image: '',
    content: ''
  })

  useEffect(()=>{
    const Graphql = {
      query: `
      query {
       getPost(postId: "${postId}"){
        post { _id
           title
           content
           imageUrl
           createdAt
           updatedAt
           creator{
             _id
             name
           }}
          }
      }
      `
    }
    fetch(`http://localhost:8080/graphql`,{
      headers: {Authorization: "Bearer "+props.token,
      "Content-type": "application/json"
  },
  method: "POST",
  body: JSON.stringify(Graphql)
  })
      .then(res => {
      
        return res.json();
      })
      .then((result) => {
        
        const resData = result.data.getPost;
        if (resData.error ) {
          throw new Error('Failed to fetch status');
        }
        setState({
          title: resData.post!.title,
          author: resData.post!.creator.name,
          date: new Date(resData.post!.createdAt).toLocaleDateString('en-US'),
          content: resData.post!.content,
          image: resData.post.imageUrl
        });
      })
      .catch(err => {
        console.log(err);
      });

  },[postId]);

    return (
      <section className="single-post">
        <h1>{state.title}</h1>
        <h2>
          Created by {state.author} on {state.date}
        </h2>
        <div className="single-post__image">
          <Image contain imageUrl={"http://localhost:8080/"+state.image} />
        </div>
        <p>{state.content}</p>
      </section>
    );
  }


export default SinglePost;
