import { getTrendingAnime, getPopularAnime, getRecentEpisodes } from './api.js';
import { renderAnimeCard, showLoading, showError } from './utils.js';

async function loadHome() {
  const trendingGrid = document.getElementById('trending-grid');
  const popularGrid = document.getElementById('popular-grid');
  const recentGrid = document.getElementById('recent-grid');
  const heroBanner = document.getElementById('hero-banner');

  // Load trending
  showLoading(trendingGrid);
  const trending = await getTrendingAnime();
  if (trending) {
    trendingGrid.innerHTML = '';
    trending.data.forEach(anime => renderAnimeCard(anime, trendingGrid));
  } else showError(trendingGrid, 'Failed to load trending anime');

  // Load popular
  showLoading(popularGrid);
  const popular = await getPopularAnime();
  if (popular) {
    popularGrid.innerHTML = '';
    popular.data.forEach(anime => renderAnimeCard(anime, popularGrid));
    // Hero banner from first few popular
    heroBanner.innerHTML = popular.data.slice(0, 3).map(anime => `
      <div class="w-full h-96 bg-cover bg-center" style="background-image: url(${anime.images.jpg.large_image_url});"></div>
    `).join('');
    // Simple slider logic (cycle every 5s)
    let index = 0;
    setInterval(() => {
      heroBanner.style.transform = `translateX(-${index * 100}%)`;
      index = (index + 1) % 3;
    }, 5000);
  } else showError(popularGrid, 'Failed to load popular anime');

  // Load recent
  showLoading(recentGrid);
  const recent = await getRecentEpisodes();
  if (recent) {
    recentGrid.innerHTML = '';
    recent.results.forEach(anime => renderAnimeCard(anime, recentGrid));
  } else showError(recentGrid, 'Failed to load recent updates');
}

document.addEventListener('DOMContentLoaded', loadHome);