import './LogoutButton.css';
import { getAuth, signOut } from "firebase/auth";

export default function LogoutButton() {
  const handleLogout = async () => {
    await signOut(getAuth());
  };

  return <button className="logout-button" onClick={handleLogout}>Logout</button>;
}
