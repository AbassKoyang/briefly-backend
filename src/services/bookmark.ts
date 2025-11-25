import { generateTitle, summarizePage } from "../lib/ai.js";
import { db } from "../lib/firestore.js";
import { scrapePage } from "../utils/scrape.js";

export const BookmarkService = {
  async createBookmark({ url, userId } : {url: string; userId: string }) {
    const rawText = await scrapePage(url);
    const {summary, tags} = await generateSummaryAndTags(rawText);
    const subTitle = new URL(url).hostname;
    const title = await generateBookmarkTitle(rawText)
    
    const domain = new URL(url).hostname;
    const favicon = `https://www.google.com/s2/favicons?sz=128&domain=${domain}`;


    const data = {
      url,
      title,
      subTitle,
      summary,
      tags,
      userId,
      favicon,
      createdAt: Date.now(),
    };
    console.log(data)

    await db.collection("bookmarks").add(data);

    return data;
  },

  async getBookmarks(userId: string) {
    const snapshot = await db
      .collection("bookmarks")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async deleteBookmark(id: string) {
    await db.collection("bookmarks").doc(id).delete();
    return { success: true };
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