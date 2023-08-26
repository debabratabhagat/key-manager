import { collection, getDocs } from "firebase/firestore";
import {db} from './firebase';
import React,{useEffect, useState}from 'react';
   
function Name (){

  const [name,setName] = useState("")
  useEffect(()=>{
    getName()
  },[])
  
  const getName = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => { 
      if (doc.data().haskey) {
        console.log(doc.data().name)
        setName(doc.data().name)
      }
    });
  }

  const newOwner =()=>{    

  }

  return (
    <div>
      <h1>{name}</h1>
      <button onClick={()=>newOwner()}>I have the key </button>
    </div>
  )
}

export default Name;