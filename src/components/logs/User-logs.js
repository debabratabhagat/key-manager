import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";

const Logs = () => {
  // console.log("inside logs");
  const [logs, setLogs] = useState([]);
  useEffect(() => {
    const logsCollectionRef = collection(db, "Logs");
    getDocs(logsCollectionRef).then((collection) => {
      const object = {};
      collection.docs.forEach((doc) => {
        object[doc.id] = doc.data();
      });
      const logsArr = Object.entries(object);
      logsArr.sort((a, b) => new Date(b[1].time) - new Date(a[1].time));
      setLogs(logsArr);
    });
  }, []);

  return (
    <>
      <div className="container">
        <div className="admin-main-body">
          <>
            <div className="nav-bar">
              <ul className="nav-bar-list">
                <li id="logs" className="Logs selected-nav-bar-li-element">
                  <p className="admin-panel-p">Logs </p>
                </li>
              </ul>
            </div>
            <div className="members-list ">
              <>
                {/* {console.log(logs)} */}
                <ul className="logs-list-ul">
                  {Object.keys(logs).map((element) => {
                    // console.log(logs[element][1]);
                    return (
                      <li key={element} className="logs-list-li">
                        <p>{`${logs[element][1].name}`}</p>
                        <p>{`${logs[element][1].time}`}</p>
                      </li>
                    );
                  })}
                </ul>
              </>
            </div>
          </>
        </div>
      </div>
    </>
  );
};

export default Logs;
