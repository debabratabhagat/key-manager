// const axios = require("axios");
import axios from "axios";
const serverKey =
  "BFMPBroQEd4Bl5PV-VbCAaBlClizBohZrR-Nkr_G6odIU6jqkMhtyCLZssViUsk5TWtBtNWMoZ2sDAS73HNPy6w";
const recipientToken =
  "cAuE9hWegDYbHGrEAHpssv:APA91bHO8oZLm51e9q2_-NKNZmRqUBI79nH3ZLspWQjq3kg7vJ3RWGlurNa4u2gk0564hpvb0Y_TK9UbKuPMMVem7JQJjQUMBrZpWsGwa4KIEj7Xr_FKeBXeB3VZLXgzHhcM5MVbi6Uh";

const notification = {
  title: "New message ",
  body: "New body",
};

const data = {
  // custom data fields, if needed
};

const payload = {
  to: recipientToken,
  notification,
  data,
};

export default function post() {
  axios
    .post("https://fcm.googleapis.com/fcm/send", payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${serverKey}`,
      },
    })
    .then((response) => {
      console.log("Message sent successfully:", response.data);
    })
    .catch((error) => {
      console.error("Error sending message:", error);
    });
}
