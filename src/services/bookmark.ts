import { analyzePage, generateTitle, summarizePage } from "../lib/ai.js";
import { db, FieldValue, firebaseAdmin } from "../lib/firestore.js";
import { BookmarkType } from "../types/index.js";
import { scrapePage } from "../utils/scrape.js";

export const BookmarkService = {
  async createBookmark({ url, userId } : {url: string; userId: string }) {
    const rawText = await scrapePage(url);
    const {summary, title, tags} = await analyzePage(rawText);
    const subTitle = new URL(url).hostname;    
    const domain = new URL(url).hostname;
    const favicon = `https://www.google.com/s2/favicons?sz=128&domain=${domain}`;


    const data : BookmarkType = {
      url,
      title,
      subTitle,
      summary,
      tags,
      userId,
      favicon,
      createdAt: Date.now(),
      lastViewed: Date.now(),
      pinned: false,
      views: 0,
      archived: false
    };
    console.log(data)
    try {
      await db.collection("bookmarks").add(data);
    } catch (error) {
      console.error('Error creating bookmark', error)
    }
    return data;
  },

  async getBookmarks(userId: string, pageParam?: number) {
    const PAGE_SIZE = 6;
    let q;
    if(!pageParam) {
        q =  db
      .collection("bookmarks")
      .where("userId", "==", userId).where("pinned", '==' , false).where("archived", '==', false)
      .orderBy("createdAt", "desc").limit(PAGE_SIZE);
    } else {
        q =  db
      .collection("bookmarks")
      .where("userId", "==", userId).where("pinned", '==' , false).where("archived", '==', false)
      .orderBy("createdAt", "desc").limit(PAGE_SIZE).startAfter(pageParam);
    }
    try {
        const querySnapshot = await q.get();
        
        if(!querySnapshot.empty){
            const bookmarks =  querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })) as BookmarkType[];
            const lastVisible = querySnapshot ? querySnapshot.docs[querySnapshot.docs.length - 1]?.data().createdAt : null;
            return {
                bookmarks,
                lastVisible
            }
        } else {
            return {
                bookmarks: [],
                lastVisible: null
            };
        }
    } catch (error) {
        console.error('Error fetching  user bookmarks:', error);
        throw error;
    }
},
  async getArchivedBookmarks(userId: string, pageParam?: number) {
    const PAGE_SIZE = 6;
    let q;
    if(!pageParam) {
        q =  db
      .collection("bookmarks")
      .where("userId", "==", userId).where("archived", '==', true)
      .orderBy("createdAt", "desc").limit(PAGE_SIZE);
    } else {
        q =  db
      .collection("bookmarks")
      .where("userId", "==", userId).where("archived", '==', true)
      .orderBy("createdAt", "desc").limit(PAGE_SIZE).startAfter(pageParam);
    }
    try {
        const querySnapshot = await q.get();
        
        if(!querySnapshot.empty){
            const bookmarks =  querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })) as BookmarkType[];
            const lastVisible = querySnapshot ? querySnapshot.docs[querySnapshot.docs.length - 1]?.data().createdAt : null;
            return {
                bookmarks,
                lastVisible
            }
        } else {
            return {
                bookmarks: [],
                lastVisible: null
            };
        }
    } catch (error) {
        console.error('Error fetching archived bookmarks:', error);
        throw error;
    }
},

  async getPinnedBookmarks(userId: string){
    try {
      const snapshot = await db.collection("bookmarks")
      .where("userId", "==", userId).where("pinned", '==' , true).where("archived", '==', false).orderBy("createdAt", "desc").get();
      if(!snapshot.empty){
        const bookmarks =  snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as BookmarkType[];
        return bookmarks ;
    } else {
        return []
    }
    } catch (error) {
      console.error('Error fetching pinned bookmarks:', error);
      throw error;
    }
  },

  async deleteBookmark(id: string) {
    await db.collection("bookmarks").doc(id).delete();
    return { success: true };
  },

  async incrementViews(id: string) {
    await db.collection("bookmarks").doc(id).update({
      views: FieldValue.increment(1),
      lastViewed: Date.now()
    });
  },

  async pinToTop(id: string) {
    await db.collection("bookmarks").doc(id).update({
      pinned: true
    });
  },
  async unPin(id: string) {
    await db.collection("bookmarks").doc(id).update({
      pinned: false
    });
  },
  async archiveBookmark(id: string) {
    await db.collection("bookmarks").doc(id).update({
      archived: true
    });
  },
  async unarchiveBookmark(id: string) {
    await db.collection("bookmarks").doc(id).update({
      archived: false
    });
  },
};

async function generateSummaryAndTags(text: string) {
    const data = await summarizePage(text);
    return data;
}
async function generateBookmarkTitle(text: string) {
    const title: string = await generateTitle(text);
    return title;
}