import { analyzePage, generateTitle, summarizePage } from "../lib/ai.js";
import { db } from "../lib/firestore.js";
import { scrapePage } from "../utils/scrape.js";

export const BookmarkService = {
  async createBookmark({ url, userId } : {url: string; userId: string }) {
    const rawText = await scrapePage(url);
    const {summary, title, tags} = await analyzePage(rawText);
    // const summary = "This webpage introduces the Play CDN for Tailwind CSS v4.1, detailing how developers can use it to quickly experiment with Tailwind's utility classes directly in the browser without a build step. It provides practical code examples for integrating the CDN script and adding custom CSS, explicitly noting its suitability for development rather than production environments. Additionally, the page serves as a comprehensive reference, listing a vast array of Tailwind's styling capabilities across categories such as layout, typography, backgrounds, effects, and interactivity."
    // const tags = [ "Tailwind CSS", "CSS Framework", "Front-end Development", "Web Development", "CDN" ]
    const subTitle = new URL(url).hostname;
    // const title = 'Tailwind CSS CDN';
    
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
    try {
      await db.collection("bookmarks").add(data);
    } catch (error) {
      console.error('Error creating bookmark', error)
    }
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