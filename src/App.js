//import logo from './logo.svg';
import React ,{useRef,useState} from 'react'
import './App.css';
import  firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/analytics';
import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';
const APIKey=process.env.REACT_APP_API_KEY;

firebase.initializeApp({
  apiKey: APIKey,
  authDomain: "superchat-14688.firebaseapp.com",
  projectId: "superchat-14688",
  storageBucket: "superchat-14688.appspot.com",
  messagingSenderId: "1096139837369",
  appId: "1:1096139837369:web:43d438affe75413f923068",
  measurementId: "G-9VMENJK1W1"
})
firebase.firestore().settings({ experimentalForceLongPolling: true });
const auth=firebase.auth();
const firestore=firebase.firestore();
const analytics=firebase.analytics();
//const [user]=useAuthState(auth)
function SignIn(){

const signInWithGoogle=()=>{
  const provider=new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider);
}
  return(
    <button onClick={signInWithGoogle}>Sign with Google</button>
  )


}
function SignOut(){
  return auth.currentUser && (
    <button onClick={()=>auth.signOut()}>Sign out</button>
  )
 
}

function ChatRoom(){
  const dummy=useRef();
 const messagesRef=firestore.collection('messages');
 const query=messagesRef.orderBy('createdAt').limit(25);
 const [messages]=useCollectionData(query,{idField:'id'});
 const [form,setForm]=useState('');
 const sendingMessage=async(e)=>{
   e.preventDefault();
   const {uid,photoURL}=auth.currentUser;
   await messagesRef.add({
     text:form,
     createdAt:firebase.firestore.FieldValue.serverTimestamp(),
     uid,
     photoURL
   })
   setForm('')
   dummy.current.scrollIntoView({behavior:'smooth'})
 }
 return(<>
   <main>
     {messages&&messages.map(msg=><Messages key={msg.id} message={msg}/>)}
     <span ref={dummy}></span>
   </main>
   <form onSubmit={sendingMessage}>
    <input value={form}  onChange={(e)=>setForm(e.target.value)} placeholder ='write here'/>
    <button type='submit' >Send</button>
   </form>
   </>
 )
}
function Messages(props){
const {text,uid,photoURL}=props.message;
const messageClass=uid===auth.currentUser.uid?'sent':'received';
return(<>
<div className={`message ${messageClass}`}>
  <img src={photoURL } referrerpolicy="no-referrer"/>
<p>{text}</p>
</div>
</>
)
}

function App() {
 
  const [user]=useAuthState(auth)
  return (
    <div className="App">
      
      <header >
      <h1> DimChat</h1>
       <SignOut/>
     
      </header>
      <section>
      
        {user ?<ChatRoom/>:<SignIn/>}
      </section>
     
    </div>
  );
}

export default App;
