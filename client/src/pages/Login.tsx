import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import chat from "../assets/chat.svg";
import logo from "../assets/logo.svg";

import { auth } from "../config/firebase";
import { FormValues, FormVariant } from "../types/Form";

import GoogleSignInButton from "../components/buttons/GoogleSignIn";
import FormInput from "../components/inputs/FormInput";

// for component to switch form type
const switcher = {
  "Sign In": {
    prompt: "Don't have an account?",
    alt: "Sign Up",
  },
  "Sign Up": {
    prompt: "Already have an account?",
    alt: "Sign In",
  },
};

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  const [variant, setVariant] = useState<FormVariant>("Sign In");

  function toggleVariant(): void {
    (document.getElementById("form")! as HTMLFormElement).reset();
    setVariant(switcher[variant].alt as FormVariant);
  }

  async function onSubmit(data: FormValues) {
    try {
      if (variant === "Sign In")
        await signInWithEmailAndPassword(auth, data.email, data.password);
      else
        await createUserWithEmailAndPassword(auth, data.email, data.password);
    } catch (error: any) {
      console.log(error);
    }
  }

  return (
    <div className="flex h-dvh">
      <img src={chat} className="w-1/2 hidden p-10 md:block bg-sky-200" />

      <div className="flex flex-col grow bg-white p-2 gap-2">
        <div className="flex gap-1 p-5 mx-auto md:mx-0">
          <img src={logo} alt="logo" className="-mb-1 w-12" />
          <h2 className="mt-auto text-4xl font-Playwrite text-slate-600 font-semibold">
            chatter
          </h2>
        </div>

        <form
          id="form"
          className="flex flex-col justify-center gap-4 m-auto px-5 py-2 w-full sm:w-2/3"
          onSubmit={handleSubmit(onSubmit)}
        >
          <p className="text-2xl font-semibold text-gray-800 mb-3 dark:text-gray-300">
            {variant}
          </p>

          {variant === "Sign Up" && (
            <FormInput
              id="name"
              label="Name"
              placeholder="John Doe"
              required
              autoComplete="name"
              hooks={{ errors, register }}
            />
          )}

          <FormInput
            id="email"
            label="Email"
            placeholder="someone@example.com"
            required
            autoComplete="email"
            regex={{
              value: /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/,
              message: "Invalid Email",
            }}
            hooks={{ errors, register }}
          />

          <FormInput
            id="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            required
            autoComplete={
              variant === "Sign In" ? "current-password" : "new-password"
            }
            hooks={{ errors, register }}
            bottomLabel={
              variant === "Sign In" ? (
                <span className="ms-auto text-sm text-gray-400 hover:underline hover:text-primary  cursor-pointer">
                  Forgot Password?
                </span>
              ) : (
                <span />
              )
            }
          />

          <button type="submit" className="btn btn-primary">
            {variant}
          </button>

          <div className="divider -my-0 text-neutral">or</div>
          <GoogleSignInButton />
          <div className="flex text-gray-400 justify-center gap-2">
            <span>{switcher[variant].prompt}</span>
            <span
              onClick={toggleVariant}
              className="hover:underline hover:text-primary cursor-pointer"
            >
              {switcher[variant].alt}
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
