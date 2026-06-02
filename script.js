const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = "17df1db80ffed6701c2475154fc53eae";

let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
const movieContainer = document.getElementById("movies-container");
const icon = document.getElementById("xplore");

function getDetails() {
  if (watchlist.length === 0) {
    icon.classList.remove("display");
    movieContainer.innerHTML = "";
    return;
  }

  icon.classList.add("display");
  const fetches = watchlist.map((id) =>
    fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`).then((res) =>
      res.json(),
    ),
  );

  Promise.all(fetches).then((data) => {
    renderHtml(data);
  });
}

function renderHtml(movies) {
  let ihtml = "";
  for (let d of movies) {
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
            <p id="p-${d.id}" onclick="removeFromWatchlist(${d.id})"><i class="fa-solid fa-minus"></i> Remove</p>
          </div>
          <h3>${d.overview}</h3>
        </div>
      </div>
    `;
  }
  movieContainer.innerHTML = ihtml;
}

function removeFromWatchlist(movieId) {
  watchlist = watchlist.filter((id) => id !== movieId);
  localStorage.setItem("watchlist", JSON.stringify(watchlist));
  getDetails();
}

getDetails();
