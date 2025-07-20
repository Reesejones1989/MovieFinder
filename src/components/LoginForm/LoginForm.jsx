import './LoginForm.css'
import React, { useState, useEffect } from "react";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // State for tracking authentication
  const [userNameLoggedIn, setUserNameLoggedIn] = useState(""); // State to store the logged-in user's username

  // Handle username change
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  // Handle password change
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  // Handle user sign up
  const handleCreateAccount = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      alert("Please fill in both username and password.");
      return;
    }

    try {
      const response = await fetch("https:localhost:5000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Account created successfully!");
        setUsername(""); // Clear the input
        setPassword(""); // Clear the input
      } else {
        alert(data.error || "Failed to create account.");
      }
    } catch (error) {
      console.error("Error creating account:", error);
      alert("Server error. Please try again later.");
    }
  };

  // Handle login submission
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      alert("Please fill in both username and password.");
      return;
    }

    try {
      const response = await fetch("https:localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        // Store the token and user info
        localStorage.setItem("token", data.token);
        setUserNameLoggedIn(username);
        setIsAuthenticated(true); // Set user as authenticated
        alert("Logged in successfully!");
        Navigate("/Home");
      } else {
        alert(data.error || "Failed to log in.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("Server error. Please try again later.");
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove the token from local storage
    setIsAuthenticated(false); // Set user as not authenticated
    setUserNameLoggedIn(""); // Clear the username
  };

  // Check if user is already logged in on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      setUserNameLoggedIn(localStorage.getItem("username")); // Set username if already logged in
    }
  }, []);

  return (
    <div className="login-page">
      {isAuthenticated ? (
        <div>
          <p>Welcome, {userNameLoggedIn}!</p>
          <button onClick={handleLogout}>Log Out</button>
        </div>
      ) : (
        <form>
          {isCreatingAccount ? (
            <>
              <label>Username:</label>
              <input
                type="text"
                name="username"
                value={username}
                onChange={handleUsernameChange}
              />
              <br />
              <br />
              <label>Password:</label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={handlePasswordChange}
              />
              <br />
              <br />
              <button onClick={handleCreateAccount}>Create Account</button>
              <button onClick={() => setIsCreatingAccount(false)}>
                Back to Login
              </button>
            </>
          ) : (
            <>
              <label>Username:</label>
              <input
                type="text"
                name="username"
                value={username}
                onChange={handleUsernameChange}
              />
              <br />
              <br />
              <label>Password:</label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={handlePasswordChange}
              />
              <br />
              <br />
              <button onClick={handleLogin}>Sign In</button>
              <button onClick={() => setIsCreatingAccount(true)}>
                Create Account
              </button>
            </>
          )}
        </form>
      )}
    </div>
  );
}
