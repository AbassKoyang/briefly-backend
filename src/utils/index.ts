import { DecodedIdToken } from "firebase-admin/auth";
import { firebaseAdmin } from "../lib/firestore.js";

export const verifyFirebaseToken = async (idToken: string) : Promise<DecodedIdToken | null> => {
    try {
      const decoded = await firebaseAdmin.auth().verifyIdToken(idToken);
      return decoded;
    } catch (err) {
      console.error("Invalid Firebase token:", err);
      return null;
    }
}