import React,{useState,useEffect, useCallback} from 'react';
import './App.css';
 import { Route,Routes,Navigate } from 'react-router-dom';

import Layout from './components/Layout/Layout';
import Backdrop from './components/Backdrop/Backdrop';
import Toolbar from './components/Toolbar/Toolbar';
import MainNavigation from './components/Navigation/MainNavigation/MainNavigation';
import MobileNavigation from './components/Navigation/MobileNavigation/MobileNavigation';
import ErrorHandler from './components/ErrorHandler/ErrorHandler';
import FeedPage from './pages/Feed/Feed';
import SinglePostPage from './pages/Feed/SinglePost/SinglePost';
import LoginPage from './pages/Auth/Login';
import SignupPage from './pages/Auth/Signup';
import { useNavigate } from 'react-router-dom';
import './App.css';
//import auth from './pages/Auth/Auth';

interface AuthState {
  isAuth: boolean;
  token: null|string;
  userId: null|string;
 authLoading: boolean;

}

interface SignupUserState  {
  name: string;
  email: string;
  password: string;
}



const  App : React.FC =() => {
  let navigate = useNavigate();
  const [showBackdrop,setShowBackdrop] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState( false);
  const initualAuthState: AuthState = {isAuth: false,
                            token: null,
                            userId: null,
                             authLoading: false};
 const [authState,setAuthState]  = useState<AuthState>(initualAuthState); 
 const [error,setError] = useState<null|Error>(null);



 const mobileNavHandler = (isOpen:boolean) => {
  setShowBackdrop(isOpen);
  setShowMobileNav(isOpen);
  };

const  backdropClickHandler = () => {
  setShowBackdrop(false);
  setShowMobileNav(false);
  setError(null);
  };

const  logoutHandler = () => {
    setAuthState((prev)=>{return {...prev, isAuth: false, token: null }});
    localStorage.removeItem('token');
    localStorage.removeItem('expiryDate');
    localStorage.removeItem('userId');
  };
 
 const loginHandler = (event:React.FormEvent<HTMLFormElement>, authData:{email:string;
  password: string;}) => {
    event.preventDefault();
    setAuthState((prev)=>{return {...prev, authLoading: true }});

    const graphqlQuery = {query: `query Login($email: String!, $password: String!){
      login( email: "$email", password:"$.password")
      {
        token
        userId
      }
      
    }
    `,
  variables: {
    authData: authData.email,
    password: authData.password
  }}

    fetch('http://localhost:8080/graphql',{
      method: 'POST',
      headers:{'Content-type': 'application/json'},
      body: JSON.stringify(graphqlQuery)
      
    })
      .then(res => {

        return res.json();
      })
      .then(resData => {
        if (resData.errors &&resData.errors[0].status === 422) {
          throw new Error(
            "Validation failed. Make sure the email address isn't used yet!"
          );
        }
        if (resData.errors ) {
          console.log('Error!');
          throw new Error('User login failed!');
        }
        console.log(resData);
        setAuthState({
          isAuth: true,
          token: resData.data.login.token,
          authLoading: false,
          userId: resData.data.login.userId
        });
        localStorage.setItem('token', resData.data.login.token);
        localStorage.setItem('userId', resData.data.login.userId);
        const remainingMilliseconds = 60 * 60 * 1000;
        const expiryDate = new Date(
          new Date().getTime() + remainingMilliseconds
        );
        localStorage.setItem('expiryDate', expiryDate.toISOString());
        setAutoLogout(remainingMilliseconds);
      })
      .catch((err)  => {
        console.log(err);
        setAuthState(prev=> {return {...prev, isAuth: false, authLoading: false}});
        if(err instanceof Error)
        setError(err);
  
      });
  };

 const signupHandler = (event:React.FormEvent<HTMLFormElement>, authData:SignupUserState) => {
    event.preventDefault();
    setAuthState((prev)=>{return {...prev, authLoading: true }});
   
     const graphqlQuery = {query:`mutation {
      createUser(userInput:{   email: "${authData.email}",
        name: "${authData.name}",
        password: "${authData.password}"})
      {_id
        email}
      
    }
    `}

    fetch('http://localhost:8080/graphql',{
      method: "POST",
      headers: {'Content-type': 'application/json'},
      body: JSON.stringify(graphqlQuery)
    })
      .then(res => {
 
        return res.json();
      })
      .then(resData => {
        if (resData.errors &&resData.errors[0].status === 422) {
          throw new Error(
            "Validation failed. Make sure the email address isn't used yet!"
          );
        }
        if (resData.errors ) {
          console.log('Error!');
          throw new Error('Creating a user failed!');
        }
        console.log(resData);
        setAuthState((prev)=>{return { ...prev,isAuth: false, authLoading: false }});
        //this.props.history.replace('/');
        navigate('/', { replace: true });
      })
      .catch(err => {
        console.log(err);
        setAuthState((prev)=>{return {...prev, isAuth:false, authLoading: false}})
        setError(err);
      });
  };

 const setAutoLogout =useCallback( (milliseconds:number) => {
    setTimeout(() => {
      logoutHandler();
    }, milliseconds);
  },[]);

 const errorHandler = () => {
    setError(null);
  };

  useEffect(()=>{
    console.log("useEffect[]");
    const token = localStorage.getItem('token');
    const expiryDate = localStorage.getItem('expiryDate');
    if (!token || !expiryDate) {
      return;
    }
    if (new Date(expiryDate) <= new Date()) {
      logoutHandler();
      return;
    }
    const userId = localStorage.getItem('userId');
    const remainingMilliseconds =
      new Date(expiryDate).getTime() - new Date().getTime();
      setAuthState((prev)=>{ return {isAuth: true, token: token, userId: userId ,authLoading: prev.authLoading}});
    setAutoLogout(remainingMilliseconds);
  },[]) ;

    let routes = (
      <Routes>
        <Route
          path="/"
          
          element={ <LoginPage
              onLogin={loginHandler}
              loading={authState.authLoading}
            />
          }
        />
        <Route
          path="/signup"
          
          element={
            <SignupPage
              onSignup={signupHandler}
              loading={authState.authLoading}
            />
          }
        />
         <Route
        path="*"
        element={<Navigate to="/" replace />}
    />
      </Routes>
    );
    if (authState.isAuth) {
      routes = (
        <Routes>
          <Route
            path="/"
            element={ <FeedPage userId={authState.userId!} token={authState.token!} />}
          />
          <Route
            path="/:postId"
            element={ <SinglePostPage
                userId={authState.userId!}
                token={authState.token!}
              />
            }
          />
           <Route
        path="*"
        element={<Navigate to="/" replace />}
        />
        </Routes>
      );
            }
    return (
      <>
        {showBackdrop && (
          <Backdrop onClick={backdropClickHandler} />
        )}
        <ErrorHandler error={error} onHandle={errorHandler} />
        <Layout
          header={
            <Toolbar>
              <MainNavigation
                onOpenMobileNav={mobileNavHandler.bind(this, true)}
                onLogout={logoutHandler}
                isAuth={authState.isAuth}
              />
            </Toolbar>
          }
          mobileNav={
            <MobileNavigation
              open={showMobileNav}
              mobile
              onChooseItem={mobileNavHandler.bind(this, false)}
              onLogout={logoutHandler}
              isAuth={authState.isAuth}
            />
          }
        />
        
        {routes}
      
        
      </>
    );
  }
  export default App;

