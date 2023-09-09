import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase";
import React, { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../auth";
import Signout from "../signout";
import "./style.css";
// import PhoneIcon from "./phone.svg";
// import UserIcon from "./user.svg";
import LoadingSign from "../loader/loader";


const Name =  () => {
  // const [ keyHolder, setKeyHolder ] = useState({id:'', name:''});
  const keyHolder = useRef({id:'', name:''})
  // const [ userIsKeyHolder, setUserIsKeyHolder ] = useState(false);
  const userIsKeyHolder = useRef(false);
  const isLoading = useRef(true);
  // console.log(isLoading.current);
  
  const user = useContext(AuthContext);
  
  useEffect( ()=> {
      const func = async () => {
      const q = query(collection(db, 'users'), where('haskey', '==', true));  //querying who has keys
      const keyHolderDocRef = await getDocs(q);
      const keyHolderDoc = keyHolderDocRef.docs[0];
      
      keyHolder.current = ({name: keyHolderDoc.data().name, id: keyHolderDoc.id , phone: keyHolderDoc.data().phone});
      

      if (keyHolderDoc.id === user.id){
        userIsKeyHolder.current = true;
      }
      isLoading.current = false;
      console.log(isLoading.current, "inside useEffect hook");
    }
    
    func();
    
  }, [user.id] );
  
  




  
  const newOwner = async () => {
    isLoading.current = true;
    const keyHolderDocRef = doc(db, 'users', keyHolder.current.id);
    
    const currentUserDocRef = doc(db, "users", user.id);
    const currentUserDoc = await getDoc(currentUserDocRef);
    
    await Promise.all([
      updateDoc(currentUserDocRef, { haskey: true }),
      updateDoc(keyHolderDocRef, { haskey: false }),
    ]);
    
    keyHolder.current = {id: currentUserDoc.id, name: currentUserDoc.data().name , phone: currentUserDoc.data().phone};
    userIsKeyHolder.current = true;
    isLoading.current = false;

  }

  

  return (
    <>
      {isLoading.current ? (<LoadingSign />) : null}
      <div>
          <div className="user-info">
            <div>
              {/* <UserIcon /> */}
              {/* <svg  width="40" height="40" xmlns="./user.svg" alt="user"></svg> */}
              {user.name}
            </div>
          <h3>CYBORG</h3>
          <Signout></Signout>
          </div>



          <div className="container">
            <div className="container-box">
              <h2 className="header">
                Keys with <span className="highlighted">{keyHolder.current.name}</span>{" "}
              </h2>
              <div className="phone-number">
                {/* <PhoneIcon /> */}
                {/* <svg width="40" height="40" xmlns="./phone.svg" alt="phone"></svg> */}
                <h3>+91 {keyHolder.current.phone}</h3>
              </div>
              {(userIsKeyHolder.current) ? null : <button onClick={newOwner}><h1>I've the Key</h1></button>}
            </div>
          </div> 
      </div>



    </>
    
  );
}

export default Name;