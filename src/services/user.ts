import { db } from "../lib/firestore.js";

export const UserService = {
  async addUser({ uid, name, email, photo } : {uid: string; name: string ; email: string; photo: string}) {
    const userr = await this.getUser(uid);
    if(userr.id){
        console.log('User already exists');
        return;
    }

    const user = {
        uid, name, email, photo,
        createdAt: Date.now()
    };
    console.log(user)

    await db.collection('users').doc(uid).set(user);

    return user;
  },

  async getUser(userId: string) {
    const doc = await db
      .collection("users")
      .doc(userId)
      .get();

    return {
        id: doc.id,
        ...doc.data()
    };
  },
};