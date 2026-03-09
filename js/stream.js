// Video streaming player code (detailed in section 5)

import { getEpisodeSources, getAnimeInfo } from './api.js';
import { showError } from './utils.js';

const video = document.getElementById('video-player');
const nextBtn = document.getElementById('next-ep');
const prevBtn = document.getElementById('prev-ep');
const episodeList = document.getElementById('episode-sidebar');
let episodes = [];
let currentEpIndex = 0;

async function loadStream() {
  const params = new URLSearchParams(location.search);
  const animeId = params.get('animeId');
  const episodeId = params.get('episode');
  if (!animeId || !episodeId) return showError(document.body, 'Missing params');

  // Load anime info for episodes
  const info = await getAnimeInfo(animeId);
  if (!info) return showError(document.body, 'Failed to load anime info');
  episodes = info.episodes;
  currentEpIndex = episodes.findIndex(ep => ep.id === episodeId);

  // Render episode list
  episodeList.innerHTML = episodes.map((ep, i) => `
    <a href="?animeId=\( {animeId}&episode= \){ep.id}" class="${i === currentEpIndex ? 'neon-text' : ''}">Episode ${ep.number}</a>
  `).join('');

  // Load sources
  const sources = await getEpisodeSources(episodeId);
  if (!sources) return showError(video, 'Failed to load stream');
  const source = sources.sources.find(s => s.quality === 'default')?.url;  // Or '1080p'

  if (source) {
    video.src = source;
    video.load();
    video.play();

    // Resume from localStorage
    const key = `progress_\( {animeId}_ \){episodeId}`;
    if (localStorage.getItem(key)) video.currentTime = localStorage.getItem(key);

    // Save progress
    video.addEventListener('timeupdate', () => localStorage.setItem(key, video.currentTime));

    // Autoplay next
    video.addEventListener('ended', () => loadNextEpisode());

    // Watch history
    localStorage.setItem(`history_${animeId}`, JSON.stringify({ lastEpisode: episodeId, timestamp: Date.now() }));
  } else {
    showError(video, 'No streaming source available');
  }
}

function loadNextEpisode() {
  if (currentEpIndex < episodes.length - 1) {
    location.href = `stream.html?animeId=\( {episodes[0].animeId}&episode= \){episodes[currentEpIndex + 1].id}`;  // Simplified
  }
}

function loadPrevEpisode() {
  if (currentEpIndex > 0) {
    location.href = `stream.html?animeId=\( {episodes[0].animeId}&episode= \){episodes[currentEpIndex - 1].id}`;
  }
}

nextBtn.onclick = loadNextEpisode;
prevBtn.onclick = loadPrevEpisode;

document.addEventListener('DOMContentLoaded', loadStream);