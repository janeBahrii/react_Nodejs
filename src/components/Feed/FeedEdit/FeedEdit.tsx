import React, { useState, Fragment, useEffect,useRef } from 'react';
import isDeepEqual from "fast-deep-equal";

import Backdrop from '../../Backdrop/Backdrop';
import Modal from '../../Modal/Modal';
import Input from '../../Form/Input/Input';
import FilePicker from '../../Form/Input/FilePicker';
import Image from '../../Image/Image';
import { required, length } from '../../../util/validators'; 
import { generateBase64FromImage } from  '../../../util/image';

const POST_FORM = {
  postForm:{
  title: {
    value: '',
    valid: false,
    touched: false,
    validators: [required, length({ min: 5 })]
  },
  image: {
    value: '',
    valid: false,
    touched: false,
    validators: [required]
  },
  content: {
    value: '',
    valid: false,
    touched: false,
    validators: [required, length({ min: 5 })]
  }
},
formIsValid: false
};

type  PostFormType = typeof POST_FORM.postForm;
type KeysOfPostForm = keyof PostFormType ;
interface PostType{
  title: string;
  imagePath?: string;
  content: string;
  image?: string;
}
interface Props{
  editing: boolean;
  loading: boolean;
  selectedPost?: PostType|null;
    onFinishEdit: (post:PostType) => void;
    onCancelEdit: () => void;
  
}
//type PostForm =typeof POST_FORM;

const FeedEdit: React.FC<Props> =(props)=>  {
  const [statePostForm,setPostForm] = useState(POST_FORM);
  const [imagePreview, setImagePreview] = useState<null|string|ArrayBuffer>(null);

 const changedPostEditing = props.selectedPost&&props.editing;

 const selectedPost = useRef(props.selectedPost);

if (!isDeepEqual(selectedPost.current, props.selectedPost)) {
  selectedPost.current = props.selectedPost
 }
 const editAndPost = props.editing&&selectedPost.current;

  useEffect(()=>{
    if (editAndPost) {
      setPostForm((prevState )=>{
        const postForm = {
          title: {
            ...prevState.postForm.title,
            value: selectedPost.current!.title,
            valid: true
          },
          image: {
            ...prevState.postForm.image,
            value: selectedPost.current!.imagePath! ,
            valid: true
          },
          content: {
            ...prevState.postForm.content,
            value: selectedPost.current!.content,
            valid: true
          }
        };
        return {postForm,formIsValid:true};
    })
  }
},[changedPostEditing,
  editAndPost])


  const postInputChangeHandler :(arg0:{id:string;value: string; files?:FileList|null})=>void = ({id, value, files}) => {
    if (files) {
      generateBase64FromImage(files[0])
        .then(b64 => {
          setImagePreview(b64 );
        })
        .catch(e => {
          setImagePreview( null );
        });
    }  
    setPostForm(prevState => {
      let isValid = true;
      for (const validator of prevState.postForm[id as KeysOfPostForm].validators) {
        isValid = isValid && validator(value);
      }
      const updatedForm = {
        ...prevState.postForm,
        [id]: {
          ...prevState.postForm[id as KeysOfPostForm],
          valid: isValid,
          value: files ? files[0] : value
        }
      };
      let formIsValid = true;
      (Object.keys(updatedForm) as Array<KeysOfPostForm>)
      .forEach(inputName=>formIsValid = formIsValid && updatedForm[inputName].valid)
      return {
        postForm: updatedForm,
        formIsValid: formIsValid
      };
    });
  };

 const  inputBlurHandler = (input:KeysOfPostForm) => {
   
  setPostForm(prevState => {
      return {
        postForm: {
          ...prevState.postForm,
          [input]: {
            ...prevState.postForm[input],
            touched: true
          }
        },
        formIsValid: prevState.formIsValid
      };
    });
  };

  const cancelPostChangeHandler = () => {
    setPostForm(POST_FORM);
    props.onCancelEdit();
  };

 const acceptPostChangeHandler = () => {
    const post = {
      title: statePostForm.postForm.title.value,
      image: statePostForm.postForm.image.value,
      content: statePostForm.postForm.content.value
    };
    props.onFinishEdit(post);
    setPostForm(POST_FORM);
    setImagePreview(null);
  };
    return props.editing ? (
      <Fragment>
        <Backdrop onClick={cancelPostChangeHandler} />
        <Modal
          title="New Post"
          acceptEnabled={statePostForm.formIsValid}
          onCancelModal={cancelPostChangeHandler}
          onAcceptModal={acceptPostChangeHandler}
          isLoading={props.loading}
        >
          <form>
            <Input
              id="title"
              label="Title"
              control="input"
              onChange={postInputChangeHandler}
              onBlur={inputBlurHandler.bind(null, 'title')}
              valid={statePostForm.postForm['title'].valid}
              touched={statePostForm.postForm['title'].touched}
              value={statePostForm.postForm['title'].value}
            />
            <FilePicker
              id="image"
              label="Image"
              control="input"
              onChange={postInputChangeHandler}
              onBlur={inputBlurHandler.bind(this, 'image')}
              valid={statePostForm.postForm['image'].valid}
              touched={statePostForm.postForm['image'].touched}
            />
            <div className="new-post__preview-image">
              {!imagePreview && <p>Please choose an image.</p>}
              {imagePreview && (
                <Image imageUrl={imagePreview} contain left />
              )}
            </div>
            <Input
              id="content"
              label="Content"
              control="textarea"
              rows = {5}
              onChange={postInputChangeHandler}
              onBlur={inputBlurHandler.bind(null, 'content')}
              valid={statePostForm.postForm['content'].valid}
              touched={statePostForm.postForm['content'].touched}
              value={statePostForm.postForm['content'].value}
            />
          </form>
        </Modal>
      </Fragment>
    ) : null;
  }


export default FeedEdit;
