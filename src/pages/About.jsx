import React, { useState } from "react";
import emailjs from "emailjs-com";

export default function About() {
    const [suggestion, setSuggestion] = useState("");

    const sendEmail = (event) => {
        event.preventDefault();

        emailjs.send(
            "service_5gnvwxa",  // Replace with your EmailJS service ID
            "template_7ml4g2b", // Replace with your EmailJS template ID
            {
                suggestion: suggestion,
                to_email: "mauricejonesjr@gmail.com"
            },
            "wBSHIUZfiN3buc8T6" // Replace with your EmailJS user ID (public key)
        ).then(
            (response) => {
                alert("Suggestion sent successfully!");
                setSuggestion(""); // Clear input
            },
            (error) => {
                console.log("Failed to send suggestion", error);
                alert("Failed to send suggestion.");
            }
        );
    };

    return (
        <div className="about-container">
            <p>
                This app is to bring a place to search for TV show and movie links without the potential ads all over the place.
            </p>

            <h3>Features to come soon: Favorites </h3>

            {/* Suggestion Box Form */}
            <form onSubmit={sendEmail}>
                <label>Suggestions: </label>
                <input
                    id="Suggestions"
                    type="text"
                    value={suggestion}
                    onChange={(e) => setSuggestion(e.target.value)}
                    required
                />
                <button type="submit">Submit</button>
            </form>

            {/* Footer */}
            <footer className="about-footer">
                <p>© 2025 Maurice Jones</p>
                <a href="https://reesejones1989.github.io/Portfolio/" target="_blank" rel="noopener noreferrer">
                    Visit My Portfolio
                </a>
            </footer>
        </div>
    );
}
