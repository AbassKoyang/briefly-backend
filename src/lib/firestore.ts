import admin from 'firebase-admin';

import serviceAccount from '../../brieflyServiceAccountKey.json' with { type: 'json' };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

export const db = admin.firestore();
export const FieldValue = admin.firestore.FieldValue;