import { useContext, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { doCreateUserWithEmailAndPassword, doSocialSignIn } from '../firebase/FirebaseFunctions';
import { validateDisplayName, validatePassword } from '../firebase/validation';
import { addUserApi } from '../api';

function SignUp() {
  const { currentUser, refreshUser } = useContext(AuthContext);
  const [error, setError] = useState('');
  // blocks redirect while signning up otherwise home briefly renders without displayname 
  // (because we have refreshuser to fix professor's code where it can display stale data without displayname)
  const [signingUp, setSigningUp] = useState(false);
  const navigate = useNavigate();

  if (currentUser && !signingUp) {
    return <Navigate to='/' />;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSigningUp(true);
    const form = e.currentTarget;
    const displayName = (form.elements.namedItem('displayName') as HTMLInputElement).value.trim();
    const email = (form.elements.namedItem('email') as HTMLInputElement).value.trim();
    const password = (form.elements.namedItem('password') as HTMLInputElement).value.trim();
    const confirmPassword = (form.elements.namedItem('confirmPassword') as HTMLInputElement).value.trim();

    if (!displayName || !email || !password || !confirmPassword) {
      setError('All fields are required.');
      setSigningUp(false);
      return;
    }

    const displayNameError = validateDisplayName(displayName);
    if (displayNameError) {
      setError(displayNameError);
      setSigningUp(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setSigningUp(false);
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      setSigningUp(false);
      return;
    }

    try {
      await doCreateUserWithEmailAndPassword(email, password, displayName);
      await addUserApi();
      await refreshUser();
      navigate('/dashboard');
    } catch (err) {
      setError((err as Error).message);
      setSigningUp(false);
    }
  }

  async function handleSocialSignIn() {
    try {
      await doSocialSignIn();
      await addUserApi();
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
              <input name='displayName' type='text' className="input input-bordered w-full" required />
            </div>
            <div className="form-control">
              <label className="label">Email</label>
              <input name='email' type='email' className="input input-bordered w-full" required />
            </div>
            <div className="form-control">
              <label className="label">Password</label>
              <input name='password' type='password' className="input input-bordered w-full" required />
            </div>
            <div className="form-control">
              <label className="label">Confirm Password</label>
              <input name='confirmPassword' type='password' className="input input-bordered w-full" required />
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
