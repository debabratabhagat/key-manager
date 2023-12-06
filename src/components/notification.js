// const axios = require("axios");
import axios from "axios";

const push = (props) => {
  fcmToken = props.fcmToken;
  KeyHolderName = props.name;
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
