// Utility functions

// Render anime card template
export function renderAnimeCard(anime, container) {
  const card = document.createElement('div');
  card.className = 'anime-card w-40 rounded-xl overflow-hidden shadow-lg cursor-pointer transition-transform';
  card.innerHTML = `
    <img src="\( {anime.image || anime.coverImage?.large}" alt=" \){anime.title}" class="w-full h-56 object-cover" loading="lazy">
    <div class="p-2 bg-gray-800">
      <h3 class="text-white truncate">${anime.title}</h3>
      <p class="text-gray-400 text-sm">${anime.genres?.join(', ') || ''}</p>
    </div>
  `;
  card.onclick = () => location.href = `anime-detail.html?id=${anime.mal_id || anime.id}`;
  container.appendChild(card);
}

// Debounce for search
export function debounce(func, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
}

// Loading skeleton
export function showLoading(container, count = 10) {
  container.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const skel = document.createElement('div');
    skel.className = 'w-40 h-72 rounded-xl loading-skeleton';
    container.appendChild(skel);
  }
}

// Error message
export function showError(container, msg) {
  container.innerHTML = `<p class="text-red-500">${msg}</p>`;
}