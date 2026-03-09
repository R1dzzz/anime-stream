import { getAnimeDetails, getSearchResults, getAnimeInfo, getAniListDetails } from './api.js';
import { showLoading, showError } from './utils.js';

async function loadDetail() {
  const params = new URLSearchParams(location.search);
  const malId = params.get('id');
  if (!malId) return showError(document.body, 'No anime ID');

  const container = document.getElementById('anime-detail');
  showLoading(container, 1);

  const jikanDetails = await getAnimeDetails(malId);
  if (!jikanDetails) return showError(container, 'Failed to load details');

  // Get Consumet ID by searching title
  const search = await getSearchResults(jikanDetails.data.title);
  const gogoId = search?.results[0]?.id;

  const consumetInfo = gogoId ? await getAnimeInfo(gogoId) : null;

  // Get AniList for extra
  const anilist = await getAniListDetails(jikanDetails.data.title);

  container.innerHTML = `
    <img src="\( {jikanDetails.data.images.jpg.large_image_url}" alt=" \){jikanDetails.data.title}" class="w-64 rounded-xl">
    <h1 class="text-3xl neon-text">${jikanDetails.data.title}</h1>
    <p>${anilist?.description || jikanDetails.data.synopsis}</p>
    <p>Genres: ${anilist?.genres.join(', ') || jikanDetails.data.genres.map(g => g.name).join(', ')}</p>
    <p>Rating: ${anilist?.averageScore / 10 || jikanDetails.data.score}</p>
    <p>Year: ${anilist?.startDate.year || jikanDetails.data.year}</p>
    <div id="episode-list" class="grid grid-cols-4 gap-4">
      ${consumetInfo?.episodes.map(ep => `
        <a href="stream.html?animeId=\( {gogoId}&episode= \){ep.id}" class="bg-gray-800 p-2 rounded">Episode ${ep.number}</a>
      `).join('') || '<p>No episodes available</p>'}
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', loadDetail);