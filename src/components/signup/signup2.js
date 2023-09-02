import React from "react";
import { db, auth } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Link } from "react-router-dom";
import { query, collection, where, doc, setDoc } from "firebase/firestore";
import "./signup.css";

const Signup = () => {
  //   const [checked, setChecked] = useState(false);
  //   function handleChange(e) { setChecked(e.target.checked); }

  //   const q = await query(collection(db, "users"), where("haskey", "==", true));
  //   console.log(`q=${(q!= null)}`);
  //   const [haskey, setHaskey] = useState((q != null));

  return (
    <>
      <h1 className="signup-title">Sign Up</h1>
      <div className="form-group">
        <label className="form-label" htmlFor="userName">
          Name:
        </label>
        <input className="form-input" type="text" id="userName" />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="userEmail">
          Email:
        </label>
        <input className="form-input" type="text" id="userEmail" />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="userPasswd">
          Password:
        </label>
        <input className="form-input" type="text" id="userPasswd" />
      </div>

      {/* {haskey? null : <>
            <input type = "checkbox" id="checkBox" onChange = {handleChange} />
            <label htmlFor="checkBox">Do you have the key ?</label>
        </>} */}

      <button
        className="signup-button"
        onClick={() => {
          const email = document.getElementById("userEmail").value;
          const passwd = document.getElementById("userPasswd").value;
          const name = document.getElementById("userName").value;

          createUserWithEmailAndPassword(auth, email, passwd).then(
            async (cred) => {
              await setDoc(doc(db, "users", cred.user.uid), {
                name: name,
                haskey: false,
              });
              console.log("added succesfully");
            }
          );
        }}
      >
        Sign Up
      </button>

      <div>
        <h3 className="signup-login-link">
          Already signed in?<Link to="/Login">Login</Link>
        </h3>
      </div>
    </>
  );
};

export default Signup;
