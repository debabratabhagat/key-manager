import React, { useEffect, useState } from "react";
import { auth } from "../../firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        console.log("user in");
        setUser(user);
        console.log(authUser);
      } else {
        setUser(null);
        console.log("not logged in");
      }
    });
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("logged in");
    } catch (error) {
      console.log(error);
    }
  };

  const handleSignout = async () => {
    signOut(auth);
    console.log("signed out");
  };

  return (
    <div>
      <h1>login</h1>

      <input
        type="email"
        placeholder="email"
        value={email}
        onChange={(val) => {
          setEmail(val.target.value);
        }}
      />
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(val) => {
          setPassword(val.target.value);
        }}
      />
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleSignout}>signout</button>
    </div>
  );
}

export default Login;
