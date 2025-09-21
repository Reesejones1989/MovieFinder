import React, { useState } from "react";
import emailjs from "emailjs-com";
import "./About.css";

export default function About() {
  const [suggestion, setSuggestion] = useState("");

  const sendEmail = (event) => {
    event.preventDefault();

    emailjs
      .send(
        "service_5gnvwxa",
        "template_7ml4g2b",
        { suggestion, to_email: "mauricejonesjr@gmail.com" },
        "wBSHIUZfiN3buc8T6"
      )
      .then(
        () => {
          alert("Suggestion sent successfully!");
          setSuggestion("");
        },
        (error) => {
          console.log("Failed to send suggestion", error);
          alert("Failed to send suggestion.");
        }
      );
  };

  return (
    <div className="about-container">
      {/* About Section */}
      <section className="about-section">
        <h1>About This App</h1>
        <p>
          This app provides a place to search for TV show and movie links
          without egregious ads.  
          Features such as <strong>Favorites</strong> and{" "}
          <strong>Sign-Up/Log In</strong> are coming soon.
        </p>

        {/* Suggestion Box */}
        <div className="suggestion-box">
          <form onSubmit={sendEmail}>
            <label htmlFor="Suggestions">Suggestions:</label>
            <input
              id="Suggestions"
              type="text"
              value={suggestion}
              onChange={(e) => setSuggestion(e.target.value)}
              required
            />
            <button type="submit">Submit</button>
          </form>
        </div>
      </section>

      {/* Donation Section */}
      <section className="donations">
        <h2>Support Our Work</h2>
        <p>
          Your donations help fuel further improvements and development of this
          project. Every contribution makes a difference!
        </p>

        <div className="donation-method">
          <h3>Donate with PayPal</h3>
          <a
            href="https://paypal.me/Reesejones1332"
            target="_blank"
            rel="noopener noreferrer"
            className="donation-btn paypal"
          >
            PayPal
          </a>
        </div>

        <div className="donation-method">
          <h3>Donate with Venmo</h3>
          <a
            href="https://venmo.com/u/Reese-Jones"
            target="_blank"
            rel="noopener noreferrer"
            className="donation-btn venmo"
          >
            Venmo
          </a>
        </div>

        <div className="donation-method">
          <h3>Donate with Zelle</h3>
          <a
            href="mailto:mauricejonesjr@gmail.com"
            className="donation-btn zelle"
          >
            Zelle
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="about-footer">
        <p>© 2025 Maurice Jones</p>
        <a
          href="https://reesejones1989.github.io/Portfolio/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Visit My Portfolio
        </a>
      </footer>
    </div>
  );
}
