import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateEmail,
  updatePassword,
  deleteUser,
} from 'firebase/auth';
import { auth } from './firebase';

export const register = async (email, password) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

export const login = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const logout = async () => {
  return await signOut(auth);
};

export const changeEmail = async (newEmail) => {
  if (auth.currentUser) {
    return await updateEmail(auth.currentUser, newEmail);
  }
};

export const changePassword = async (newPassword) => {
  if (auth.currentUser) {
    return await updatePassword(auth.currentUser, newPassword);
  }
};

export const deleteAccount = async () => {
  if (auth.currentUser) {
    return await deleteUser(auth.currentUser);
  }
};
