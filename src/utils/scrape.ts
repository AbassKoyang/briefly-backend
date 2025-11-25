export async function scrapePage(url: string) {
    const res = await fetch(url);
    const html = await res.text();

    const cleaned = html
        .replace(/<script[\s\S]*?<\/script>/g, "")
        .replace(/<style[\s\S]*?<\/style>/g, "");
        console.log(cleaned);

    return cleaned
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}
