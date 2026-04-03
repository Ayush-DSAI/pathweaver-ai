import Exa from 'exa-js';

export interface Resource {
  title: string;
  url: string;
  type: "article" | "video" | "repo" | "doc";
  quality: 1 | 2 | 3;
}

// Instantiate Exa client using the API key from environment variables
const exa = new Exa(process.env.NEXT_PUBLIC_EXA_API_KEY);
/**
 * Utility function to infer resource type based on URL patterns.
 * Defaults to "article".
 */
function inferType(url: string): "article" | "video" | "repo" | "doc" {
  if (!url) return "article";
  
  const lowerUrl = url.toLowerCase();
  
  if (lowerUrl.includes("youtube.com") || lowerUrl.includes("youtu.be") || lowerUrl.includes("vimeo.com")) {
    return "video";
  }
  
  if (lowerUrl.includes("github.com") || lowerUrl.includes("gitlab.com")) {
    return "repo";
  }
  
  if (lowerUrl.includes("docs.") || lowerUrl.includes("/docs") || lowerUrl.endsWith(".pdf") || lowerUrl.includes("documentation")) {
    return "doc";
  }
  
  return "article";
}

/**
 * Utility to randomly assign a quality score of 1, 2, or 3.
 */
function getRandomQuality(): 1 | 2 | 3 {
  return (Math.floor(Math.random() * 3) + 1) as 1 | 2 | 3;
}

/**
 * Fetches search results for a given topic and maps them to the Resource interface.
 */
export async function getLootDrops(topic: string, tags: string[]): Promise<Resource[]> {
  try {
    const response = await exa.search(topic, {
      useAutoprompt: true,
      numResults: 5,
      type: 'keyword'
    });

    return response.results.map((item: any) => ({
      title: item.title || "Untitled",
      url: item.url,
      type: inferType(item.url),
      quality: getRandomQuality(),
    }));
  } catch (error) {
    console.error("Failed fetching loot drops from Exa API:", error);
    // Return empty array to handle network errors cleanly
    return [];
  }
}
