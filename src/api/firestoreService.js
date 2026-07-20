import {
  collection,
  addDoc,
  updateDoc,
  setDoc,
  doc,
  deleteDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';

const ALERTS_collection = 'search_alerts';
const TOKENS_collection = 'fcm_tokens';
const NOTIFIED_collection = 'notified_jobs';

export const saveFCMToken = async (token, userId) => {
  const tokenRef = doc(db, TOKENS_collection, token);
  await setDoc(tokenRef, {
    token,
    userId,
    updatedAt: serverTimestamp(),
  }, { merge: true });
};

export const createAlert = async (alertData) => {
  const docRef = await addDoc(collection(db, ALERTS_collection), {
    ...alertData,
    enabled: true,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

export const updateAlert = async (alertId, alertData) => {
  const alertRef = doc(db, ALERTS_collection, alertId);
  await updateDoc(alertRef, alertData);
};

export const deleteAlert = async (alertId) => {
  const alertRef = doc(db, ALERTS_collection, alertId);
  await deleteDoc(alertRef);
};

function notifiedDocId(userId, source, externalJobId) {
  return `${userId}_${source}_${externalJobId}`;
}

export const markJobSeen = async (userId, source, externalJobId) => {
  const docRef = doc(db, NOTIFIED_collection, notifiedDocId(userId, source, externalJobId));
  await setDoc(docRef, {
    userId,
    source,
    externalJobId,
    seen: true,
    seenAt: serverTimestamp(),
  }, { merge: true });
};

export const markJobUnseen = async (userId, source, externalJobId) => {
  const docRef = doc(db, NOTIFIED_collection, notifiedDocId(userId, source, externalJobId));
  await setDoc(docRef, {
    seen: false,
  }, { merge: true });
};

export const hideJob = async (userId, source, externalJobId) => {
  const docRef = doc(db, NOTIFIED_collection, notifiedDocId(userId, source, externalJobId));
  await setDoc(docRef, {
    userId,
    source,
    externalJobId,
    hidden: true,
    hiddenAt: serverTimestamp(),
  }, { merge: true });
};

export const getUserJobStates = async (userId) => {
  const q = query(
    collection(db, NOTIFIED_collection),
    where('userId', '==', userId)
  );
  const snapshot = await getDocs(q);
  const states = {};
  for (const doc of snapshot.docs) {
    const data = doc.data();
    const key = `${data.source}_${data.externalJobId}`;
    states[key] = {
      seen: !!data.seen,
      hidden: !!data.hidden,
    };
  }
  return states;
};
