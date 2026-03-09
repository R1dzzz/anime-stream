// API modules for Jikan, Consumet, and AniList

const JIKAN_BASE = 'https://api.jikan.moe/v4';
const CONSUMET_BASE = 'https://api.consumet.org/anime/gogoanime';
const ANILIST_GRAPHQL = 'https://graphql.anilist.co';

// Helper fetch with error handling
async function apiFetch(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('API error');
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

// Jikan APIs
export async function getTrendingAnime() {
  return apiFetch(`${JIKAN_BASE}/top/anime?filter=airing&limit=10`);
}

export async function getPopularAnime() {
  return apiFetch(`${JIKAN_BASE}/top/anime?filter=bypopularity&limit=10`);
}

export async function getAnimeDetails(malId) {
  return apiFetch(`\( {JIKAN_BASE}/anime/ \){malId}`);
}

// Consumet APIs
export async function getRecentEpisodes() {
  return apiFetch(`${CONSUMET_BASE}/recent-episodes`);
}

export async function getSearchResults(query) {
  return apiFetch(`\( {CONSUMET_BASE}/ \){encodeURIComponent(query)}`);
}

export async function getAnimeInfo(gogoId) {
  return apiFetch(`\( {CONSUMET_BASE}/info/ \){gogoId}`);
}

export async function getEpisodeSources(episodeId) {
  return apiFetch(`\( {CONSUMET_BASE}/watch/ \){episodeId}`);
}

// AniList GraphQL example (for genres/synopsis if needed)
export async function getAniListDetails(title) {
  const query = `
    query {
      Media(search: "${title}", type: ANIME) {
        id
        title { romaji english }
        description
        genres
        averageScore
        startDate { year }
      }
    }
  `;
  try {
    const res = await fetch(ANILIST_GRAPHQL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    const { data } = await res.json();
    return data.Media;
  } catch (err) {
    console.error(err);
    return null;
  }
}