import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { FaGoogle } from "react-icons/fa6";
import { auth } from "../../config/firebase";
import { toast } from "sonner";
import { useAppStore } from "../../context";

export default function GoogleSignInButton() {
  const loading = useAppStore((state) => state.loading);
  const setLoading = useAppStore((state) => state.setLoading);

  async function handleClick() {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).catch((error) => {
      toast.error(error.code);
      setLoading(false);
    });
  }
  return (
    <button
      type="button"
      className="btn btn-error"
      onClick={handleClick}
      disabled={loading}
    >
      {loading && <span className="loading loading-dots loading-md" />}
      {!loading && (
        <>
          <FaGoogle /> Sign In with Google
        </>
      )}
    </button>
  );
}
