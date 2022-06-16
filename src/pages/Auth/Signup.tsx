import React, { useState } from 'react';

import Input,{InputChangeProps} from '../../components/Form/Input/Input';
import Button from '../../components/Button/Button';
import { required, length, email } from '../../util/validators';
import Auth from './Auth';


type RequiredType = typeof required;
type EmailType = typeof email;
type LengthType =ReturnType< typeof length>;

interface SignupForm{
  email: {
    value: string;
    valid: boolean;
    touched: boolean;
    validators: (RequiredType| EmailType)[];
  },
  password: {
    value: string;
    valid: boolean;
    touched: boolean;
    validators: (RequiredType| LengthType)[];
  },
  name: {
    value: string;
    valid: boolean;
    touched: boolean;
    validators: RequiredType[];
  }
  
}


export interface SignupState {
  signupForm: SignupForm;
    formIsValid: boolean;
}


type KeyOfSF= keyof SignupForm;


interface Props{
  onSignup : (e:React.FormEvent<HTMLFormElement>, s: {name:string,
                                                   email: string,
                                                      password: string})=> void;
  loading: boolean;

}

const Signup: React.FC<Props> =(props)=> {
 const initualState = {
    signupForm: {
      email: {
        value: '',
        valid: false,
        touched: false,
        validators: [required, email]
      },
      password: {
        value: '',
        valid: false,
        touched: false,
        validators: [required, length({ min: 5 })]
      },
      name: {
        value: '',
        valid: false,
        touched: false,
        validators: [required]
      }
    },
    formIsValid: false
  };

  const [state, setState] = useState(initualState);


  const inputChangeHandler:(arg0: InputChangeProps)=>void = ({id, value}) => {
    setState(prevState => {
      let isValid = true;
      for (const validator of prevState.signupForm[id as KeyOfSF ].validators) {
        isValid = isValid && validator(value);
      }
      const updatedForm = {
        ...prevState.signupForm,
        [id]: {
          ...prevState.signupForm[id as KeyOfSF ],
          valid: isValid,
          value: value
        }
      };
      let formIsValid = true;
      for (const inputName in updatedForm) {
        formIsValid = formIsValid && updatedForm[inputName as KeyOfSF ].valid;
      }
      return {
        signupForm: updatedForm,
        formIsValid: formIsValid
      };
    });
  };

 const inputBlurHandler = (input: string) => {
    setState(prevState => {
      return {
        signupForm: {
          ...prevState.signupForm,
          [input]: {
            ...prevState.signupForm[input as KeyOfSF ],
            touched: true
          }
        },
        formIsValid: prevState.formIsValid
      };
    });
  };
  const userData = {name: state.signupForm.name.value,
    email: state.signupForm.email.value,
    password: state.signupForm.password.value}
 
    return (
      <Auth>
        <form onSubmit={e => props.onSignup(e, userData)}>
          <Input
            id="email"
            label="Your E-Mail"
            type="email"
            control="input"
            onChange={inputChangeHandler}
            onBlur={inputBlurHandler.bind(this, 'email')}
            value={state.signupForm['email'].value}
            valid={state.signupForm['email'].valid}
            touched={state.signupForm['email'].touched}
          />
          <Input
            id="name"
            label="Your Name"
            type="text"
            control="input"
            onChange={inputChangeHandler}
            onBlur={inputBlurHandler.bind(this, 'name')}
            value={state.signupForm['name'].value}
            valid={state.signupForm['name'].valid}
            touched={state.signupForm['name'].touched}
          />
          <Input
            id="password"
            label="Password"
            type="password"
            control="input"
            onChange={inputChangeHandler}
            onBlur={inputBlurHandler.bind(this, 'password')}
            value={state.signupForm['password'].value}
            valid={state.signupForm['password'].valid}
            touched={state.signupForm['password'].touched}
          />
          <Button design="raised" type="submit" loading={props.loading}>
            Signup
          </Button>
        </form>
      </Auth>
    );
  }


export default Signup;
