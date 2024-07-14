import { AxiosError } from "axios";
import { FirebaseError } from "firebase/app";
import { toast } from "sonner";

export default function errorLogger(error: any) {
  let message; // error toast message to be displayed

  // firebase error
  if (error instanceof FirebaseError) {
    message = error.code;
  }

  // api call error
  if (error instanceof AxiosError) {
    message = error.response
      ? error.response.data.message || "Something went wrong"
      : error.code;
  }

  toast.error(message);

  // log in dev env
  if (import.meta.env.DEV) console.log(error);
}
