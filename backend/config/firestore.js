let firestoreInstance = null;
let firestoreInitErrorLogged = false;

const normalizePrivateKey = (privateKey) => privateKey?.replace(/\\n/g, "\n");

const buildFirebaseCredential = async () => {
  if (
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY
  ) {
    const { cert } = await import("firebase-admin/app");
    return cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY),
    });
  }

  return null;
};

export const getFirestoreDb = async () => {
  if (firestoreInstance) {
    return firestoreInstance;
  }

  try {
    const { initializeApp, getApps } = await import("firebase-admin/app");
    const { getFirestore } = await import("firebase-admin/firestore");

    const existingApp = getApps()[0];
    if (existingApp) {
      firestoreInstance = getFirestore(existingApp);
      return firestoreInstance;
    }

    const credential = await buildFirebaseCredential();
    const app = credential ? initializeApp({ credential }) : initializeApp();
    firestoreInstance = getFirestore(app);
    return firestoreInstance;
  } catch (error) {
    if (!firestoreInitErrorLogged) {
      console.error("Firestore is not available:", error.message);
      firestoreInitErrorLogged = true;
    }
    return null;
  }
};

export const saveMessageLog = async (entry) => {
  const db = await getFirestoreDb();
  if (!db) {
    return null;
  }

  const collectionName =
    process.env.FIRESTORE_MESSAGES_COLLECTION || "message_chain_logs";

  const payload = {
    ...entry,
    service: "yecid-users-api",
    createdAt: new Date().toISOString(),
  };

  const docRef = await db.collection(collectionName).add(payload);
  return docRef.id;
};
