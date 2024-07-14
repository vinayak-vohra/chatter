import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { FaGoogle } from "react-icons/fa6";
import { auth } from "../../config/firebase";

export default function GoogleSignInButton() {
  async function handleClick() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).catch(console.log);
  }
  return (
    <button type="button" className="btn btn-error" onClick={handleClick}>
      <FaGoogle /> Sign In with Google
    </button>
  );
}
