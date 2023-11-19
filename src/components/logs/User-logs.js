import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";

const Logs = () => {
  // console.log("inside logs");
  const [logs, setLogs] = useState([]);
  /******toggle logs****** */
  const showLogsDetail = (key) => {
    // console.log(key);

    try {
      const element = document.getElementById(`logs${key}`);
      element.classList.toggle("reg-mem-hidden");
    } catch (e) {}
  };
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
                      <>
                        <li
                          key={element}
                          className="logs-list-li"
                          onClick={() => {
                            showLogsDetail(logs[element][0]);
                          }}
                        >
                          <p>{`${logs[element][1].name}`}</p>
                          <p>{`${new Date(logs[element][1].time).toLocaleString(
                            undefined,
                            {
                              hour24: true,
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "numeric",
                              minute: "numeric",
                            }
                          )}`}</p>
                        </li>
                        {Number(element) + 1 < logs.length ? (
                          <>
                            <ul
                              // id={`reg-mem-${docKey}-drop-down`}
                              className="reg-mem-drop-down-ul-element drop-down-ul-element reg-mem-hidden"
                              id={`logs${logs[element][0]}`}
                              // hidden={true}
                            >
                              <li key="1">{`Last Owner: ${
                                logs[Number(element) + 1][1].name
                              }`}</li>
                              <li key="2">{`Phone: ${
                                logs[Number(element) + 1][1].phone
                              }`}</li>
                              <li key="3">{`RollNo: ${
                                logs[Number(element) + 1][1].rollNo
                              }`}</li>
                            </ul>
                          </>
                        ) : null}
                      </>
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
