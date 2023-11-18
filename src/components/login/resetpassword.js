import React, { useState } from "react";
import { auth } from "../../firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import toast from "react-hot-toast";

const PasswordReset = () => {
  const [email, setEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleResetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
      toast.success("Reset email sent. Check your inbox.");
    } catch (error) {
      switch (error.code) {
        case "auth/invalid-email":
          toast.error("Invalid email address. Please check and try again.");
          break;
        case "auth/user-not-found":
          toast.error("User not found. Please check the email address.");
          break;
        case "auth/user-disabled":
          toast.error("This user account has been disabled.");
          break;
        case "auth/network-request-failed":
          toast.error("Network error. Please check your internet connection.");
          break;
        default:
          toast.error("Error sending reset email. Please try again.");
      }
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Reset Password</h1>
      {!resetSent ? (
        <div>
          <p style={styles.description}>
            Enter your email to receive a password reset link:
          </p>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
            style={styles.input}
          />
          <button onClick={handleResetPassword} style={styles.button}>
            Send Reset Email
          </button>
        </div>
      ) : (
        <p style={styles.successMessage}>
          Reset email sent. Check your inbox for further instructions.
        </p>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "400px",
    margin: "auto",
    textAlign: "center",
    marginTop: "100px",
  },
  title: {
    fontSize: "24px",
    marginBottom: "20px",
  },
  description: {
    fontSize: "16px",
    marginBottom: "10px",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    boxSizing: "border-box",
  },
  button: {
    backgroundColor: " #0A3C5F",
    color: "white",
    padding: "10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  successMessage: {
    color: "#4CAF50",
    fontSize: "18px",
    marginTop: "20px",
  },
};

export default PasswordReset;
