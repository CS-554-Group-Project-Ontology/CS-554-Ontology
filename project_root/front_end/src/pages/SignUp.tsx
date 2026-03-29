import { useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { doCreateUserWithEmailAndPassword, doSocialSignIn } from '../firebase/FirebaseFunctions';

function SignUp() {
  const { currentUser, refreshUser } = useContext(AuthContext);
  const [error, setError] = useState('');

  if (currentUser) {
    return <Navigate to='/home' />;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const displayName = (form.elements.namedItem('displayName') as HTMLInputElement).value;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
    const confirmPassword = (form.elements.namedItem('confirmPassword') as HTMLInputElement).value;

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      await doCreateUserWithEmailAndPassword(email, password, displayName);
      await refreshUser();
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
    <div className="flex min-h-screen items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl">Sign Up</h2>
          {error && <p className="text-error">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">Display Name</label>
              <input name='displayName' type='text' className="input input-bordered" required />
            </div>
            <div className="form-control">
              <label className="label">Email</label>
              <input name='email' type='email' className="input input-bordered" required />
            </div>
            <div className="form-control">
              <label className="label">Password</label>
              <input name='password' type='password' className="input input-bordered" required />
            </div>
            <div className="form-control">
              <label className="label">Confirm Password</label>
              <input name='confirmPassword' type='password' className="input input-bordered" required />
            </div>
            <button type='submit' className="btn btn-primary w-full">Sign Up</button>
          </form>
          <button className="btn btn-outline w-full" onClick={handleSocialSignIn}>
            Sign Up with Google
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
