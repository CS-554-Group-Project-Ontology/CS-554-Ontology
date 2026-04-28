import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  doSignInWithEmailAndPassword,
  doPasswordReset,
  doSocialSignIn,
} from "../firebase/FirebaseFunctions";

function SignIn() {
  const { currentUser } = useContext(AuthContext);
  const [error, setError] = useState("");

  if (currentUser) {
    return <Navigate to='/' />;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (
      form.elements.namedItem("email") as HTMLInputElement
    ).value.trim();
    const password = (
      form.elements.namedItem("password") as HTMLInputElement
    ).value.trim();

    if (!email || !password) {
      setError("All fields are required.");
      return;
    }

    try {
      await doSignInWithEmailAndPassword(email, password);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function handlePasswordReset() {
    const email = (
      document.getElementById("email") as HTMLInputElement
    )?.value.trim();
    if (!email) {
      setError("Please enter your email address first.");
      return;
    }
    try {
      await doPasswordReset(email);
      alert("Password reset email sent!");
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function handleSocialSignIn() {
    try {
      await doSocialSignIn();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-base-200'>
      <div className='card w-96 bg-base-100 shadow-xl'>
        <div className='card-body'>
          <h2 className='card-title text-2xl'>Sign In</h2>
          {error && <p className='text-error'>{error}</p>}
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='form-control'>
              <label className='label'>Email</label>
              <input
                id='email'
                name='email'
                type='email'
                className='input input-bordered w-full'
                required
              />
            </div>
            <div className='form-control'>
              <label className='label'>Password</label>
              <input
                name='password'
                type='password'
                className='input input-bordered w-full'
                required
              />
            </div>
            <button type='submit' className='btn btn-primary w-full'>
              Sign In
            </button>
          </form>
          <button
            className='btn btn-outline w-full'
            onClick={handleSocialSignIn}
          >
            Sign In with Google
          </button>
          <button className='btn btn-link btn-sm' onClick={handlePasswordReset}>
            Forgot Password?
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
