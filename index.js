const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = "17df1db80ffed6701c2475154fc53eae";

let id = null;
let detailsArray = null;
const form = document.getElementById("search");
const input = document.getElementById("search-input");
const icon = document.getElementById("xplore");
const movieContainer = document.getElementById("movies-container");

function getDetails() {
  if (id.length === 0) {
    icon.classList.remove("display");
    document.getElementById("xplore").innerHTML =
      `<h3>Unable to find what you’re looking for. Please try another search.</h3>`;
    return;
  }

  icon.classList.add("display");
  const fetches = id.map((i) =>
    fetch(`${BASE_URL}/movie/${i}?api_key=${API_KEY}`).then((res) =>
      res.json(),
    ),
  );

  Promise.all(fetches).then((data) => {
    detailsArray = data.filter((movie) => movie.runtime >= 60);
    renderHtml(detailsArray);
  });
}

function getMovie() {
  id = [];
  movieContainer.innerHTML = "";
  fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${input.value}`)
    .then((res) => res.json())
    .then((data) => {
      const res = data.results;
      for (let r of res) {
        if (r.poster_path && !r.genre_ids.includes(10402)) {
          id.push(r.id);
        }
      }
      getDetails();
    });
}

function renderHtml(detailsArray) {
  let ihtml = "";
  for (let d of detailsArray) {
    const paratext = d.genres.map((g) => g.name).join(", ");
    ihtml += `
        <div class="movie-containers">
        <img
          class="movy-image"
          src="https://image.tmdb.org/t/p/w500${d.poster_path}"
          alt="Movie Image"
        />
        <div class="detail-container">
          <h2>${d.title}</h2>
          <div class="para-container">
            <p>${d.runtime}min</p>
            <p>${paratext}</p>
            <p id="p-${d.id}" onclick="addToWatchlist(${d.id})"><i class="fa-solid fa-plus"></i> Watchlist</p>
          </div>
          <h3>${d.overview}</h3>
        </div>
        </div>
      `;
  }
  movieContainer.innerHTML = ihtml;
}

function addToWatchlist(movieId) {
  let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
  const pTag = document.getElementById(`p-${movieId}`);

  if (!watchlist.includes(movieId)) {
    watchlist.push(movieId);
    pTag.style.color = "lime";
    pTag.innerHTML = '<i class="fa-solid fa-check"></i> Added';
  } else {
    watchlist = watchlist.filter((id) => id !== movieId);
    pTag.style.color = "";
    pTag.innerHTML = '<i class="fa-solid fa-plus"></i> Watchlist';
  }

  localStorage.setItem("watchlist", JSON.stringify(watchlist));
}

function handleSearch() {
  if (input.value) {
    getMovie();
  }
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  handleSearch();
});
