import React from 'react'
import { db, auth } from '../firebase';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const Signup = () => {
  const [checked, setChecked] = React.useState(false); 
  function handleChange(e) { setChecked(e.target.checked); }
  return (
    <>
        <h1>Sign Up</h1>
        <div>
            <label htmlFor="userName">Name:</label>
            <input type="text" id="userName"/>
        </div>
        <div>
            <label htmlFor="userEmail">Email:</label>
            <input type="text" id="userEmail"/>
        </div>
        <div>
            <label htmlFor="userPasswd">Password:</label>
            <input type="text" id="userPasswd"/>
        </div>
        <div>
            <input type = "checkbox" id="checkBox" onChange = {handleChange} />
            <label htmlFor="checkBox">Do you have the key ?</label>
        </div>
        
        <button
            onClick={
                () => {
                    const email = document.getElementById('userEmail').value;
                    const passwd = document.getElementById('userPasswd').value;
                    const name = document.getElementById('userName').value;

                    createUserWithEmailAndPassword(auth, email, passwd).then(async cred => {
                        await setDoc(doc(db, "users", cred.user.uid), {
                            name: name,
                            haskey: checked,
                          });
                        console.log('added succesfully');
                        }
                    );
                }
            }>
            Sign Up</button>
    </>
  )
}

export default  Signup