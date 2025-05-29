const select = document.getElementById('language-select');
const selectedLang = document.getElementById('selected-language');
const loadingBox = document.getElementById('loading-box');
const refreshBtn = document.getElementById('refresh-btn');
const errorMsg = document.getElementById('error-message');
const errorLanguage = document.getElementById('error-language');
const retryStatic = document.getElementById('retry-static');
const repoContainer = document.getElementById('repo-container');
const selectedLanguageBar = document.getElementById('selected-language-bar');

let currentLanguage = '';
let lastErrorWasRefresh = false;

select.addEventListener('change', () => {
  currentLanguage = select.value;

  resetUI();

  if (!currentLanguage) return;

  selectedLang.innerHTML = currentLanguage;
  loadingBox.style.display = 'block';

 
  errorLanguage.innerHTML = `Lenguaje seleccionado: ${currentLanguage}`;
  errorMsg.innerHTML = '⚠️ Error fetching repositories';
  retryStatic.style.display = 'none';

  setTimeout(() => {
    errorMsg.innerHTML = '';
    fetchRepository(currentLanguage);
    lastErrorWasRefresh = false;
  }, 1500);
});

refreshBtn.addEventListener('click', () => {
  if (!currentLanguage) return;

  resetUI();

  selectedLang.innerHTML = currentLanguage;
  errorLanguage.innerHTML = `Lenguaje seleccionado: ${currentLanguage}`;
  loadingBox.style.display = 'none';


  errorMsg.innerHTML = '❌ No se pudo acceder al repositorio';
  retryStatic.style.display = 'block';
  repoContainer.innerHTML = '';
  
  lastErrorWasRefresh = true;
});

retryStatic.addEventListener('click', () => {
  if (!currentLanguage) return;

  resetUI();
  selectedLang.innerHTML = currentLanguage;
  loadingBox.style.display = 'block';
  errorLanguage.innerHTML = `Lenguaje seleccionado: ${currentLanguage}`;
  errorMsg.innerHTML = '';
  retryStatic.style.display = 'none';

  fetchRepository(currentLanguage);
  lastErrorWasRefresh = false;
});

async function fetchRepository(language) {
  try {
    
    if (!lastErrorWasRefresh && Math.random() < 0.3) {
      throw new Error("❌ Error simulado al obtener el repositorio");
    }

    const response = await fetch(`https://api.github.com/search/repositories?q=language:${language}&sort=stars&order=desc&per_page=30`);
    
    if (!response.ok) {
      throw new Error("❌ Error real al obtener datos de GitHub");
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      throw new Error("⚠️ No se encontraron repositorios para este lenguaje.");
    }

    const repo = data.items[Math.floor(Math.random() * data.items.length)];

    loadingBox.style.display = 'none';
    errorMsg.innerHTML = '';
    retryStatic.style.display = 'none';
    errorLanguage.innerHTML = `Lenguaje seleccionado: ${language}`;

    selectedLanguageBar.innerHTML = `Repositorio aleatorio de ${language}:`;
    repoContainer.innerHTML = `
      <div class="repo-card">
        <h4><a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">${repo.name}</a></h4>
        <p>${repo.description || 'Sin descripción.'}</p>
        
       🌟 ${repo.stargazers_count}  
       🍴 ${repo.forks_count}  
       🐞 ${repo.open_issues_count}
      </div>
    `;
  } catch (error) {
    showError(error.message);
    console.error(error);
  }
}

function showError(message) {
  loadingBox.style.display = 'none';
  errorMsg.innerHTML = message;
  retryStatic.style.display = 'block';

  selectedLang.innerHTML = currentLanguage;
  errorLanguage.innerHTML = `Lenguaje seleccionado: ${currentLanguage}`;
  selectedLanguageBar.innerHTML = `Lenguaje seleccionado: ${currentLanguage}`;
  repoContainer.innerHTML = '';
}

function resetUI() {
  loadingBox.style.display = 'none';
  errorMsg.innerHTML = '';
  errorLanguage.innerHTML = '';
  retryStatic.style.display = 'none';
  repoContainer.innerHTML = '';
  selectedLanguageBar.innerHTML = '';
  selectedLang.innerHTML = 'Ninguno';
}