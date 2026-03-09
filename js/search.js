import { getSearchResults } from './api.js';
import { renderAnimeCard, debounce, showLoading, showError } from './utils.js';

const searchInput = document.getElementById('search-input');
const resultsGrid = document.getElementById('search-results');

const performSearch = debounce(async (query) => {
  if (!query) return;
  showLoading(resultsGrid);
  const results = await getSearchResults(query);
  if (results) {
    resultsGrid.innerHTML = '';
    results.results.forEach(anime => renderAnimeCard(anime, resultsGrid));
  } else showError(resultsGrid, 'No results found');
}, 500);

searchInput.addEventListener('input', (e) => performSearch(e.target.value));