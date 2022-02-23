const moviesContainer = document.querySelector('.movies');
const btnPrev = document.querySelector('.btn-prev');
const btnNext = document.querySelector('.btn-next');
const searchMoviesInput = document.querySelector('.input');
const modalMovie = document.querySelector('.modal');

let currentPage = 0;
let currentMovies = [];

const searchMovie = event => {
  if (event.key !== 'Enter') return;

  currentPage = 0;

  searchMoviesInput.value ? listSearchMovies(searchMoviesInput.value) : listMovies();
    

  searchMoviesInput.value = '';
}

searchMoviesInput.addEventListener('keydown', searchMovie);

const previousPageMovies = () => {
  currentPage === 0 ? (currentPage = 3) : currentPage--;

  displayMovies();
}

const nextPageMovies = () => {
  currentPage === 3 ? (currentPage = 0) : currentPage++;

  displayMovies();
}

btnPrev.addEventListener('click', previousPageMovies);
btnNext.addEventListener('click', nextPageMovies);

function displayMovies() {
  moviesContainer.textContent = '';

  for (let i = currentPage * 5; i < (currentPage + 1) * 5; i++) {
    const movie = currentMovies[i];

    const divPosterMovie = document.createElement('div');
    divPosterMovie.classList.add('movie');
    divPosterMovie.style.backgroundImage = `url('${movie.poster_path}')`;

    divPosterMovie.addEventListener('click', () => {
      modalMovies(movie.id);
    })

    const divMovieInfo = document.createElement('div');
    divMovieInfo.classList.add('movie__info');

    const spanMovieTitle = document.createElement('span');
    spanMovieTitle.classList.add('movie__title');
    spanMovieTitle.textContent = movie.title;

    const spanRating = document.createElement('span');
    spanRating.classList.add('movie__rating');

    const starRatingImage = document.createElement('img');
    starRatingImage.src = './assets/estrela.svg';
    starRatingImage.alt = 'Estrela';

    spanRating.append(starRatingImage, movie.vote_average);
    divMovieInfo.append(spanMovieTitle, spanRating);
    divPosterMovie.append(divMovieInfo);
    moviesContainer.append(divPosterMovie);
  }
}

async function listSearchMovies(search) {
  const promiseApi = await fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=${search}`);

  const promiseJson = promiseApi.json();

  promiseJson.then(jsonBody => {
    currentMovies = jsonBody.results;
    displayMovies();
  })
}

async function listMovies() {
  const promiseApi = await fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false')
  const promiseJson = promiseApi.json();

  promiseJson.then(jsonBody => {
    currentMovies = jsonBody.results;
    displayMovies();
  })
}

listMovies();

const highlightVideo_link = document.querySelector('.highlight__video-link');
const highlightVideo = document.querySelector('.highlight__video');
const highlightTitle = document.querySelector('.highlight__title');
const highlightRating = document.querySelector('.highlight__rating');
const highlightGenres = document.querySelector('.highlight__genres');
const highlightLaunch = document.querySelector('.highlight__launch');
const highlightDescription = document.querySelector('.highlight__description');

async function loadHighlightMovie() {
  const promiseApi = await fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR');
  const promiseJson = promiseApi.json();

  promiseJson.then(jsonBody => {
    highlightVideo.style.background = `linear-gradient(rgba(0, 0, 0, 0.6) 100%, rgba(0, 0, 0, 0.6) 100%),
       url('${jsonBody.backdrop_path}') no-repeat center/cover`;

    highlightTitle.textContent = jsonBody.title;
    highlightRating.textContent = jsonBody.vote_average;
    highlightGenres.textContent = jsonBody.genres.map(genre => genre.name).join(', ');

    highlightLaunch.textContent = new Date(
      jsonBody.release_date
    ).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    highlightDescription.textContent = jsonBody.overview;

    loadHighlightMovieLink();
  })
}

async function loadHighlightMovieLink() {
  const promiseApi = await fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR');
  const promiseJson = promiseApi.json();

  promiseJson.then(jsonBody => {
    highlightVideo_link.href = `https://www.youtube.com/watch?v=${jsonBody.results[0].key}`
  });
}

const modalGenres = document.querySelector('.modal__genres');
const modalTitle = document.querySelector('.modal__title');
const modalImage = document.querySelector('.modal__img');
const modalDescription = document.querySelector('.modal__description');
const modalAverage = document.querySelector('.modal__average');
const modalClose = document.querySelector('.modal__close');
const body = document.querySelector('body')

async function modalMovies(id) {
  modalMovie.classList.remove('hidden');

  const promiseApi = await fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${id}?language=pt-BR`);
  const promiseJson = promiseApi.json();

  promiseJson.then(jsonBody => {
    modalTitle.textContent = jsonBody.title;
    modalImage.src = jsonBody.backdrop_path;
    modalImage.alt = jsonBody.title;
    modalDescription.textContent = jsonBody.overview;
    modalAverage.textContent = jsonBody.vote_average;

    jsonBody.genres.forEach(genre => {
      const modalGenre = document.createElement('span');
      modalGenre.textContent = genre.name;
      modalGenre.classList.add('modal__genre');

      modalGenres.appendChild(modalGenre);
    })
  })
}

const removeModal = () => modalMovie.classList.add('hidden');
const removeModalClose = () => modalMovie.classList.add('hidden');
modalMovie.addEventListener('click', removeModal);

listMovies();
loadHighlightMovie();
