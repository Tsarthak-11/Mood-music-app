import axios from 'axios';

const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/search';

// Map emotions to Bollywood/Hindi search queries
const EMOTION_QUERIES: Record<string, string> = {
  happy: 'Bollywood party songs',
  sad: 'Bollywood sad songs',
  angry: 'Bollywood energetic songs',
  neutral: 'Bollywood hits',
  surprised: 'Bollywood surprise songs',
  fearful: 'Bollywood emotional songs',
  disgusted: 'Bollywood breakup songs',
};

interface YouTubeVideo {
  videoId: string;
  title: string;
  thumbnail: string;
}

interface YouTubeSearchResult {
  videos: YouTubeVideo[];
  nextPageToken?: string;
}

export const getRecommendations = async (
  emotion: string,
  pageToken?: string
): Promise<YouTubeSearchResult> => {
  if (!YOUTUBE_API_KEY) {
    throw new Error('Missing YouTube API key. Please add REACT_APP_YOUTUBE_API_KEY to your .env file.');
  }
  // Use mapped query or fallback to 'Bollywood hits'
  const query = EMOTION_QUERIES[emotion] || 'Bollywood hits';
  try {
    const response = await axios.get<{ items: any[]; nextPageToken?: string }>(YOUTUBE_API_URL, {
      params: {
        key: YOUTUBE_API_KEY,
        q: query,
        part: 'snippet',
        type: 'video',
        maxResults: 10,
        regionCode: 'IN',
        ...(pageToken ? { pageToken } : {}),
      },
    });
    const items = response.data.items || [];
    const videos: YouTubeVideo[] = items.map((item: any) => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium.url,
    }));
    return {
      videos,
      nextPageToken: response.data.nextPageToken,
    };
  } catch (error: any) {
    console.error('YouTube search request failed:', error);
    return { videos: [] };
  }
}; 