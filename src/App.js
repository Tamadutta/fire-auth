import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfiguration from './firebase.configuration';


firebase.initializeApp(firebaseConfiguration);

function App() {

  const [user, setUser] = useState({
    isSignedIn : false,
    name : '',
    email : '',
    photo : ''
  })

  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSignIn = () => {
    firebase.auth().signInWithPopup(provider)
    .then(res => {
      const {displayName, email, photoURL} = res.user
      const IsSignedInUser = {
        isSignedIn : true,
        name : displayName,
        email : email,
        photo : photoURL
      }
      setUser(IsSignedInUser)
      console.log(displayName, email, photoURL)
    })
    .catch(err => {
      console.log(err);
      console.log(err.message)
    })
  }
   const handleSignOut = () =>{
    firebase.auth().signOut()
    .then(res => {
      const signedOutUser = {
        isSignedIn : false,
        name : '',
        email : '',
        photo : '',
        password: '',
        error : '',
        isValid : false,
        existingUser : false

      }
      setUser(signedOutUser)
      console.log(res)
    })
  }
  const switchForm = event => {
       const createdUser = {...user}
       createdUser.existingUser = event.target.checked;
       setUser(createdUser)
  }
  // debugger;
   const is_valid_email =email =>  /(.+)@(.+){2,}\.(.+){3,}/.test(email);
   const hasNumber = input => /\d/.test(input);
  

  const handleChange = event => {
    const newUserInfo = {
      ...user
    };
    let isValid = true;
    if(event.target.name === 'email'){
      isValid = is_valid_email(event.target.value)
    }
    if(event.target.name === 'password'){
      isValid = event.target.value.length > 8 && hasNumber(event.target.value);
    }

    newUserInfo[event.target.name] = event.target.value
    newUserInfo.isValid = isValid
    setUser(newUserInfo)
  }
  const createAccount = (event) => {
    if(user.isValid){
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(res => {
        console.log(res);
        const createdUser = {...user}
        createdUser.isSignedIn = true;
        createdUser.error = '';
        console.log(createdUser)
      })
      .catch(err => {
        console.log(err.message)
        const createdUser = {...user}
        createdUser.isSignedIn = false;
        createdUser.error = err.message
        setUser(createdUser);
      })
    }
    event.preventDefault();
    event.target.reset();
  }
  const signInUser = event => {
    if(user.isValid){
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then(res => {
        console.log(res);
        const createdUser = {...user}
        createdUser.isSignedIn = true;
        createdUser.error = '';
        console.log(createdUser)
      })
      .catch(err => {
        console.log(err.message)
        const createdUser = {...user}
        createdUser.isSignedIn = false;
        createdUser.error = err.message
        setUser(createdUser);
      })
    event.preventDefault();
    event.target.reset();
  }
}
  return (
    <div className="App">
      {
        user.isSignedIn ? <button onClick = {handleSignOut}>Sign Out</button> :
        <button onClick = {handleSignIn}>Sign In</button>
      }
      {
        user.isSignedIn && <div> 
          <p>Welcome {user.name}</p> 
          <p>your email : {user.email}</p>
          </div>
      }
      <h1>Our Authentication form </h1>
      <input type="checkbox" name="switchForm" onChange = {switchForm} id="switchForm"/>
     <label htmlFor = "switchForm"> returning User
    </label>
      <form style = {{display : user.existingUser ? 'block' : 'none'}} onSubmit ={signInUser}> 
      <input type="text" onBlur ={handleChange} name ="email" placeholder ="Your email" required/>
      <br/>
      <input type="password" onBlur ={handleChange} name ="password" placeholder ="Your password" required/>
      <br/>
      <input type="submit" value="Sign In"/>
      </form>


      <form style = {{display : user.existingUser ? 'none' : 'block'}} onSubmit ={createAccount}>
      <input type="text" onBlur ={handleChange} name ="name" placeholder ="Your name" required/>
      <br/>
      <input type="text" onBlur ={handleChange} name ="email" placeholder ="Your email" required/>
      <br/>
      <input type="password" onBlur ={handleChange} name ="password" placeholder ="Your password" required/>
      <br/>
      <input type="submit" value="Create Account"/>
      </form>
      {
        user.error && <p style ={{color: 'red'}}>{user.error}</p>
      }
    </div>
  );
    }
  

export default App;
