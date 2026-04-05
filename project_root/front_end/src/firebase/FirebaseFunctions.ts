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
  type User,
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
  return user
}

async function doSignInWithEmailAndPassword(email: string, password: string) {
  const auth = getAuth();
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user
}

async function doSocialSignIn() {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user;
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

async function getAuthToken(user: User) {
  return await user.getIdToken();
}

export {
  doCreateUserWithEmailAndPassword,
  doSignInWithEmailAndPassword,
  doSocialSignIn,
  doPasswordReset,
  doChangePassword,
  doSignOut,
  getAuthToken,
};
