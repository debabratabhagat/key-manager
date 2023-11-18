import React, { useState } from "react";
import "./request.css";
import { db } from "../../firebase";
import { writeBatch, doc } from "firebase/firestore";

const Requests = (props) => {
  
  return props.trigger ? (
    <div className="popup-container">
      <div className="popup">
        <div className="popup-content">
          <div className="request-info">
            Have you passed on the keys to any of them?
          </div>
          {props.keyClaimersCollection.map((doc) => {
            return (
              <div
                className="individual-keys-possesion-claimers key-claimers-list"
                key={doc.id}
              >
                <div className="key-claimers-name">{doc.name}</div>
                <button
                  className="key-claimers-button"
                  id={doc.id}
                  onClick={(e) => {
                    props.newOwner(e.target.id); // need to test
                  }}
                >
                  yes
                </button>
              </div>
            );
          })}

          <div className="request-delete-div">
            <button
              className="request-delete-btn"
              onClick={async () => {
                const batch = writeBatch(db);
                props.keyClaimersCollection.forEach((member) => {
                  batch.delete(doc(db, "key-claimers", member.id));
                });
                await batch.commit();
              }}
            >
              None of them
            </button>
          </div>

          <button
            className="request-close-button"
            onClick={() => {
              props.setTrigger(false);
            }}
          >
            X
          </button>
          <ul className="element-list"></ul>
        </div>
      </div>
    </div>
  ) : null;
};

export default Requests;
