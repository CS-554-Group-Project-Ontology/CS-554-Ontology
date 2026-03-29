import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from 'firebase/auth';

async function doCreateUserWithEmailAndPassword(
  email: string,
  password: string,
  displayName: string
) {
  const auth = getAuth();
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(user, { displayName });
  await user.reload();
}

async function doSignInWithEmailAndPassword(email: string, password: string) {
  const auth = getAuth();
  await signInWithEmailAndPassword(auth, email, password);
}

async function doSocialSignIn() {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider);
}

async function doPasswordReset(email: string) {
  const auth = getAuth();
  await sendPasswordResetEmail(auth, email);
}

async function doChangePassword(
  email: string,
  oldPassword: string,
  newPassword: string
) {
  const auth = getAuth();
  const credential = EmailAuthProvider.credential(email, oldPassword);
  if (auth.currentUser) {
    await reauthenticateWithCredential(auth.currentUser, credential);
    await updatePassword(auth.currentUser, newPassword);
  }
}

async function doSignOut() {
  const auth = getAuth();
  await signOut(auth);
}

export {
  doCreateUserWithEmailAndPassword,
  doSignInWithEmailAndPassword,
  doSocialSignIn,
  doPasswordReset,
  doChangePassword,
  doSignOut,
};
