export default function About() {
   /* function sendToMyEmail(event) {
        event.preventDefault(); // Prevent form from refreshing
    
        const suggestion = document.getElementById("Suggestions").value;
        const email = "your_email@example.com"; // Replace with your actual email
        const subject = "New Suggestion for MovieFinder";
        const body = `Suggestion: ${encodeURIComponent(suggestion)}`;
    
        window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${body}`;
    }
    */


    return (
        <div className="about-container">
            <p>
                This app is to bring a place to search for TV show and movie links without the potential ads all over the place.
            </p>

            <h3>Features to come soon: Anime and Adding to Favorites</h3>

            {/*<form>
                <label>Suggestions: </label> <input id="Suggestions"></input>
                <button type="submit" onClick={sendToMyEmail}>Submit</button>
            </form>
                */}





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
