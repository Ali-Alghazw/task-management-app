import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
} from 'firebase/firestore';
import { db } from './firebase';
import { auth } from './firebase';
//Tasks Services Logic
const getUserTasksRef = () => {
  const userId = auth.currentUser.uid;
  return collection(db, 'users', userId, 'tasks');
};

export const addTask = async (task) => {
  const tasksRef = getUserTasksRef();
  return await addDoc(tasksRef, task);
};

export const getTasks = async () => {
  const tasksRef = getUserTasksRef();
  const q = query(tasksRef);
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const updateTask = async (taskId, updatedTask) => {
  const tasksRef = getUserTasksRef();
  const taskDoc = doc(tasksRef, taskId);
  return await updateDoc(taskDoc, updatedTask);
};

export const deleteTask = async (taskId) => {
  const tasksRef = getUserTasksRef();
  const taskDoc = doc(tasksRef, taskId);
  return await deleteDoc(taskDoc);
};
