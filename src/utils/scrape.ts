export async function scrapePage(url: string) {
    const res = await fetch(url);
    const html = await res.text();

    const cleaned = html
        .replace(/<script[\s\S]*?<\/script>/gi, "")
        .replace(/<style[\s\S]*?<\/style>/gi, "");

    let output = "";

    const titleMatch = cleaned.match(/<title[^>]*>(.*?)<\/title>/i);
    if (titleMatch && titleMatch[1]) {
        output += titleMatch[1].trim() + "\n\n";
    }

    const metaMatch = cleaned.match(
        /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["'][^>]*>/i
    );
    if (metaMatch && metaMatch[1]) {
        output += metaMatch[1].trim() + "\n\n";
    }

    const paragraphMatches = [...cleaned.matchAll(/<p[^>]*>(.*?)<\/p>/gi)];
    const paragraphs = paragraphMatches
        .map(m => (m[1] ? m[1].replace(/<[^>]+>/g, "").trim() : ""))
        .filter(Boolean);

    if (paragraphs.length > 0) {
        output += paragraphs.join("\n\n") + "\n\n";
    }

    const headingMatches = [...cleaned.matchAll(/<h([1-4])[^>]*>(.*?)<\/h[1-4]>/gi)];
    const headings = headingMatches
        .map(m => (m[2] ? m[2].replace(/<[^>]+>/g, "").trim() : ""))
        .filter(Boolean);

    if (headings.length > 0) {
        output += headings.join("\n") + "\n";
    }

    return output.replace(/\s+\n/g, "\n").trim();
}
