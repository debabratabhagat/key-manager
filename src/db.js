import { collection, getDoc } from "firebase/firestore";
import {db} from './firebase';
   
const addTodo = async (e) => {
        e.preventDefault();  
       
        try {
            const docRef = await collection(db, "users"); 
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            } else {
            // docSnap.data() will be undefined in this case
            console.log("No such document!");
            }
          } catch (e) {
            console.error("Error adding document: ", e);
          }
    }

export default addTodo;