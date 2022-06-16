import React from 'react';

import { useReducer} from "react";
import Input from '../../components/Form/Input/Input';
import Button from '../../components/Button/Button';
import { required, length, email } from '../../util/validators';
import Auth from './Auth';



interface Props{
  loading: boolean;
  onLogin: (e: React.FormEvent<HTMLFormElement>,credentials:{email:string;
                                                    password: string;})=>void;

}
type RequiredType = typeof required;
type EmailType = typeof email;
type LengthType =ReturnType< typeof length>;

interface LoginForm{
  email: {
    value: string;
    valid: boolean;
    touched: boolean;
    validators: (RequiredType| EmailType)[];
  },
  password: {
    value: string,
    valid: boolean,
    touched: boolean,
    validators: (RequiredType| LengthType)[];
  }
  
}


interface LoginState {
  loginForm: LoginForm,
    formIsValid: boolean
}
type Action={
 type: 'CHANGE_EMAIL'|'CHANGE_PASSWORD';
 value: string;
}|
{type: 'BLUR_EMAIL'|'BLUR_PASSWORD';}


const validate =(value:string, validators: (RequiredType| EmailType|LengthType)[])=>{
  let isValid = true;
  for (const validator of validators) {
    isValid = isValid && validator(value);
  }
  return isValid;
}

const validateForm =(logForm:LoginForm)=>{ 
   let formIsValid = true;
   (Object.keys(logForm) as Array<keyof  LoginForm>).forEach(inputName=>
    formIsValid = formIsValid && logForm[inputName].valid)
 return formIsValid;

}

const deepStateCopy = (state: LoginState)=>{
  const newState = {...state,
                     
}
newState.loginForm.email = {...state.loginForm.email}
newState.loginForm.email.validators=[... state.loginForm.email.validators];
newState.loginForm.password = {...state.loginForm.password}
newState.loginForm.password.validators=[... state.loginForm.password.validators];


  return newState;
}

const loginReducer = (state:LoginState,action:Action)=>{
  switch(action.type){

    case 'CHANGE_EMAIL':
      let newState: LoginState = deepStateCopy(state);
      let isValid = validate(action.value,state.loginForm.email.validators);
      newState.loginForm.email.value = action.value;
      newState.loginForm.email.valid = isValid;
      newState.formIsValid = validateForm(newState.loginForm);
      return newState;

      case 'CHANGE_PASSWORD':
         newState = deepStateCopy(state);
       isValid = validate(action.value,state.loginForm.password.validators);
       newState.loginForm.password.value = action.value;
       newState.loginForm.password.valid = isValid;
       newState.formIsValid = validateForm(newState.loginForm);
        return newState;

        case 'BLUR_EMAIL':
         newState = deepStateCopy(state);
         newState.loginForm.email.touched = true;
         return newState;

        case 'BLUR_PASSWORD':
         newState = deepStateCopy(state);
         newState.loginForm.password.touched = true;
         return newState;

        default: return state;
  }
}
 


const Login: React.FC<Props> = (props)=>{


  const initualState = {
    loginForm: {
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
      }
    },
       formIsValid: false
  };

  const [state, dispatch] = useReducer(loginReducer,initualState);
  const inputChangeHandler:(arg0:{id:string, value: string})=>void = ({id, value}) => {
    if(id==='email')
    dispatch({type: 'CHANGE_EMAIL',value })
    else 
    if(id==='password')
    dispatch({type: 'CHANGE_PASSWORD',value })
  };

  const inputBlurHandler = (input: string) => {
    if(input==='email')
    dispatch({type: 'BLUR_EMAIL' })
    else 
    if(input==='password')
    dispatch({type: 'BLUR_PASSWORD' })
  };

  
    return (
      <Auth>
        <form
          onSubmit={e =>
            props.onLogin(e, {
              email: state.loginForm.email.value,
              password: state.loginForm.password.value
            })
          }
        >
          <Input
            id="email"
            label="Your E-Mail"
            type="email"
            control="input"
            onChange={inputChangeHandler}
            onBlur={inputBlurHandler.bind(null, 'email')}
            value={state.loginForm['email'].value}
            valid={state.loginForm['email'].valid}
            touched={state.loginForm['email'].touched}
          />
          <Input
            id="password"
            label="Password"
            type="password"
            control="input"
            onChange={inputChangeHandler}
            onBlur={inputBlurHandler.bind(this, 'password')}
            value={state.loginForm['password'].value}
            valid={state.loginForm['password'].valid}
            touched={state.loginForm['password'].touched}
          />
          <Button design="raised" type="submit" loading={props.loading}>
            Login
          </Button>
        </form>
      </Auth>
    );
  }


export default Login;
