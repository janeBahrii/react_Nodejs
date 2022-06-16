import React, { useState, useEffect, Fragment, useCallback } from 'react';
//import openSocket from "socket.io-client";

import Post from '../../components/Feed/Post/Post';
import Button from '../../components/Button/Button';
import FeedEdit from '../../components/Feed/FeedEdit/FeedEdit';
import Input from '../../components/Form/Input/Input';
import Paginator from '../../components/Paginator/Paginator';
import Loader from '../../components/Loader/Loader';
import ErrorHandler from '../../components/ErrorHandler/ErrorHandler';
import './Feed.css';
import { json } from 'stream/consumers';
interface PostType{
  _id: string;
  
    creator:{
    name: string;
  }
  createdAt: Date;
  title:string;
  image: string; 
  content: string;
  imagePath?: string
}

interface Props{
  userId: string;
  token: string;

}

const Feed: React.FC<Props> = (props)=> {

  const [isEditing,setIsEditing] = useState(false);
  const [posts,setPosts] = useState<PostType[]>([]);
  const [editPost, setEditPost] = useState<PostType|null>(null);
const [totalPosts,setTotalPosts] = useState(0);
const [status, setStatus] = useState('');
const [postPage, setPostPage] = useState(1);
const [postsLoading,setPostsLoading] = useState(true);
const [editLoading, seteditLoading] = useState(false);
const [error,setError] = useState<Error|null>(null);


//--------------------catchError------------------------------------
const catchError = (error: Error) => {
  setError(error);
};

//-----------------------loadPosts----------------------------------
 const loadPosts =useCallback( (direction?:string) => {
    if (direction) {
      setPostsLoading(true);
      setPosts([]);
 
    }
    let page = postPage;
    if (direction === 'next') {
      page++;
      setPostPage(page);
    }
    if (direction === 'previous') {
      page--;
      setPostPage(page);
    }

    const graphql = {query:`
      query getPosts($page: Int){
        getPosts(page: $page){
       posts{  
         _id
          title
          content
          imageUrl
          createdAt
          updatedAt
          creator{
            _id
            name
          }},
          totalItems
        }
      }
      `,
      variables: {
        page
      }
    }
    fetch('http://localhost:8080/graphql',{
    headers: {Authorization: "Bearer "+props.token,
    'Content-type': 'application/json'},
    method:"POST",
    body: JSON.stringify(graphql)
    })
      .then(res => {
      
        return res.json();
      })
      .then(result => {
        if (result.error ) {
          throw new Error('Failed to fetch posts.');
        }
        const resData = result.data.getPosts;
        setPosts(resData.posts.map((post: PostType&{imageUrl: string})=>{
          return{
            ...post,
            imagePath: post.imageUrl
          }

        }));
        setTotalPosts(resData.totalItems);
        setPostsLoading(false);
      })
      .catch(catchError);
  },[postPage]);

//-----------------------------addPost-------------------------------------
  const addPost  = (post:PostType)=>{
    setPosts((prevPosts )=>{
      const updatedPosts: PostType[] = [...prevPosts];
      if(postPage===1){
        if(prevPosts.length>=2){
          updatedPosts.pop();
          updatedPosts.unshift(post);
        }
      }
      return updatedPosts;
    })
    setTotalPosts(prevTotal=>prevTotal+1)
  }

//-----------------------------updatePost-------------------------------------
const updatePost  = (post:PostType)=>{
  setPosts((prevPosts )=>{
    const updatedPosts: PostType[] = [...prevPosts];
    const updatedPostIndex = updatedPosts.findIndex(postItem=>post._id ===postItem._id);
    if(updatedPostIndex >= -1)
    updatedPosts[updatedPostIndex] = post;
 
    return updatedPosts;
  })

}

//------------------useEffect([])-----------------------------------
  useEffect(()=>{
    const Graphql = {query: `
    query{
      getStatus{
        status
      }

    }
    `};
    fetch('http://localhost:8080/graphql',{
      headers: {Authorization: "Bearer "+props.token,
      "Content-type": "application/json" },
      method: "POST",
      body: JSON.stringify(Graphql)
  })
      .then(res => {
       
        return res.json();
      })
      .then(resData => {
        if (resData.error ) {
          throw new Error('Failed to fetch user status.');
        }
        setStatus(resData.data.getStatus.status);
      })
      .catch(catchError);

      loadPosts();
    // const socket =   openSocket("http://localhost:8080");
    // socket.on('posts',(data:{action:string, post:PostType})=>{
      // if(data.action==='create')
  //  addPost(data.post);
  //  if(data.action==='update')
  //  updatePost(data.post);
  //  if(data.action==='delete')
  //  loadPosts();
   // })
  },[loadPosts])

 

  //---------------statusUpdateHandler----------------------------------
  const statusUpdateHandler:React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const Graphql = {query:`
    mutation mutateStatus($status: String!){
      setStatus(status: $status){
        status
      }

    }`,
  variables:{
    status
  }};
    fetch('http://localhost:8080/graphql',{
      headers: {Authorization: "Bearer "+props.token,
      "Content-type": "application/json" },
      method: "POST",
      body: JSON.stringify(Graphql)
  })
      .then(res => {
       
        return res.json();
      })
      .then(resData => {
        if (resData.error) {
          throw new Error("Can't update status!");
        }
        setStatus(resData.data.setStatus.status);
        console.log(resData);
      })
      .catch(catchError);
  };

  //--------------------newPostHandler----------------------------------------------
  const newPostHandler = () => {
    setIsEditing(true);
  };

  //-------------------startEditPostHandler----------------------------------
  const startEditPostHandler = (postId: string) => {
    setPosts((prevPosts) => {
      const fetchedLoadedPost = prevPosts.find(p => p._id === postId) ;
      let loadedPost = null;
      if (fetchedLoadedPost)
      loadedPost =  JSON.parse(JSON.stringify(fetchedLoadedPost));
      setIsEditing(true);
      setEditPost(loadedPost);
      return prevPosts;
    });
  };

  //----------------------cancelEditHandler---------------------------
  const cancelEditHandler = () => {
    setIsEditing(false);
    setEditPost(null);
  };

  //---------------------finishEditHandler--------------------------
  const finishEditHandler = (postData: {title: string; content: string; image?: string, imagePath?: string}) => {
    seteditLoading(true);
  
    // Set up data (with image!)
    let method = 'POST';
    let url = 'http://localhost:8080/graphql';
  

   
 
  const formData = new FormData();
  if(editPost){
    if(postData.image)   
    formData.append('image',postData.image!);
    else{
      if (!postData.imagePath)
      throw new Error("No image ");
  }
  }
  else
  formData.append('image',postData.image!);


 
  fetch("http://localhost:8080/post-image",{
    headers: {Authorization: "Bearer "+props.token},
    method: "PUT",
    body: formData
  })
  .then((result)=>{
    return result.json();
  })
  .then(result=>{
    let img  = result.imagePath||postData.imagePath;
    let postIdQuery='';
    let coma= '';
    let create_updatePost = `createPost`;
    if(editPost){  
      postIdQuery = `,postId: "${editPost._id}" `;
      create_updatePost = `updatePost`;
    }
    
   
    const Graphql = {
      query: `mutation changePost($title: String!,$content: String!, $imageUrl: String!){
        ${create_updatePost}(
          postData:{
          title: $title,
          content: $content,
          imageUrl: $imageUrl
          

        } ${postIdQuery} )
       
        {
          title
          content 
          imageUrl
          creator {email 
            name
          _id}
          createdAt
          _id
        }
      }`,
      variables:{
        title: postData.title,
        content: postData.content, 
        imageUrl: img||"undefined"

      }
    }

    fetch(url,{
      headers: {Authorization: "Bearer "+props.token,
    'Content-type': "application/json"},
      method:"POST",
      body: JSON.stringify(Graphql)
    })
      .then(res => {
        
    
        return res.json();
      })
      .then(resData => {
        if (resData.errors) {
          console.log(resData);
          throw new Error('Creating or editing a post failed!');
        }
     
        const post = {
         
          _id: resData.data[create_updatePost]._id,
           title: resData.data[create_updatePost].title,
           createdAt: resData.data[create_updatePost].createdAt,
           content: resData.data[create_updatePost].content,
           creator: resData.data[create_updatePost].creator,
           image: resData.data[create_updatePost].imageUrl
        }

      

        setPosts(prevPosts=>{
          const updatedPosts = [...prevPosts];
          if (editPost){
         const indexToUpdate =    updatedPosts.findIndex(postItem=>post._id===postItem._id);
            updatedPosts[indexToUpdate] = post;

          }
          else{
                if (prevPosts.length >= 2) {
                    updatedPosts.pop();
                }
                updatedPosts.unshift(post);
            }
          
          setIsEditing( false);
          setEditPost (null);
          seteditLoading(false);
         return updatedPosts;
        })
       
    
      })
    })
      .catch(err => {
        console.log(err);
        setIsEditing(false);
        setEditPost(null);
        seteditLoading(false);
        setError(err);
      });
      
  };

  //------------------------statusInputChangeHandler------------------------------------
 const  statusInputChangeHandler:(arg0:{id:string, value:string})=>void = ({id, value}) => {
   setStatus(value);
  };

  //-----------------------deletePostHandler--------------------------------------------
  const deletePostHandler = (postId: string) => {
    setPostsLoading(true);
 const Graphql = {

  query: `mutation{
      deletePost(postId: "${postId}"){
        success
      }
    }`
 }
    
    fetch(`http://localhost:8080/graphql`,
    {method: 'POST',
    headers: {Authorization: "Bearer "+props.token,
  "Content-type": "application/json"},
  body: JSON.stringify(Graphql)
})
      .then(res => {
      
        return res.json();
      })
      .then(resData => {
        if (resData.error) {
          throw new Error('Deleting a post failed!');
        }
        console.log(resData);
    
        setPostsLoading(false);
        loadPosts();
      })
      .catch(err => {
        console.log(err);
        setPostsLoading(false);
      });
  };

  //----------------------------errorHandler------------------------------
  const errorHandler = () => {
    setError(null);
  };
    return (
      <>
        <ErrorHandler error={error} onHandle={errorHandler} />
        <FeedEdit
          editing={isEditing}
          selectedPost={{ title: editPost? editPost.title: '',
            imagePath: editPost? editPost.imagePath? editPost.imagePath: '':'',
            content: editPost? editPost.content: ''}}
          loading={editLoading}
          onCancelEdit={cancelEditHandler}
          onFinishEdit={finishEditHandler}
        />
        <section className="feed__status">
          <form onSubmit={statusUpdateHandler}>
            <Input
              id=''
              type="text"
              placeholder="Your status"
              control="input"
              onChange={statusInputChangeHandler}
              value={status}
            />
            <Button mode="flat" type="submit">
              Update
            </Button>
          </form>
        </section>
        <section className="feed__control">
          <Button mode="raised" design="accent" onClick={newPostHandler}>
            New Post
          </Button>
        </section>
        <section className="feed">
          {postsLoading && (
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <Loader />
            </div>
          )}
          {posts.length <= 0 && !postsLoading ? (
            <p style={{ textAlign: 'center' }}>No posts found.</p>
          ) : null}
          {!postsLoading && (
            <Paginator
              onPrevious={loadPosts.bind(null, 'previous')}
              onNext={loadPosts.bind(null, 'next')}
              lastPage={Math.ceil(totalPosts / 2)}
              currentPage={postPage}
            >
              {posts.map(post => (
                <Post
                  key={post._id}
                  id={post._id}
                  author={post.creator.name}
                  date={new Date(post.createdAt).toLocaleDateString('en-US')}
                  title={post.title}
                  image={post.image}
                  content={post.content}
                  onStartEdit={startEditPostHandler.bind(null, post._id)}
                  onDelete={deletePostHandler.bind(null, post._id)}
                />
              ))}
            </Paginator>
          )}
        </section>
      </>
    );
  }


export default Feed;
