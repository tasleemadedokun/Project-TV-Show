let allEpisodes = [];
let allShows = [];

const episodeCache = {};
let showCache = null;

let currentView = "shows";

function setup() {
  showLoadingMessage();

  document.getElementById("tvShowSelector").style.display = "none";
  document.getElementById("selectEpisode").style.display = "none";

  fetchShows().then(() => {
    renderShowsView();
  });

  setupListeners();
}

function setupListeners() {
  document.getElementById("tvShowSelector").addEventListener("change", (e) => {
    loadEpisodesForShow(e.target.value);
  });

  document.getElementById("selectEpisode").addEventListener("change", (e) => {
    const id = e.target.value;

    if (!id) {
      makePageForEpisodes(allEpisodes);
    } else {
      const ep = allEpisodes.find((x) => x.id == id);
      if (ep) makePageForEpisodes([ep]);
    }
  });

  document.getElementById("searchInput").addEventListener("input", function () {
    const term = this.value.toLowerCase();

    if (currentView === "shows") {
      const filtered = allShows.filter(
        (show) =>
          show.name.toLowerCase().includes(term) ||
          (show.summary || "").toLowerCase().includes(term) ||
          show.genres.join(" ").toLowerCase().includes(term),
      );

      renderShowsList(filtered);
    }

    if (currentView === "episodes") {
      const filtered = allEpisodes.filter(
        (ep) =>
          ep.name.toLowerCase().includes(term) ||
          (ep.summary || "").toLowerCase().includes(term),
      );

      makePageForEpisodes(filtered);
    }
  });
}

function fetchShows() {
  if (showCache) {
    allShows = showCache;
    return Promise.resolve();
  }

  return fetch("https://api.tvmaze.com/shows")
    .then((res) => res.json())
    .then((data) => {
      showCache = data.sort((a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
      );
      allShows = showCache;
    });
}

function renderShowsView() {
  currentView = "shows";

  document.getElementById("tvShowSelector").style.display = "none";
  document.getElementById("selectEpisode").style.display = "none";

  document.getElementById("searchInput").value = "";

  document.getElementById("navBar").innerHTML = "";

  renderShowsList(allShows);
}

function renderShowsList(shows) {
  const root = document.getElementById("root");
  root.innerHTML = "";

  shows.forEach((show) => {
    const card = document.createElement("div");
    card.className = "show-card";

    card.innerHTML = `
      <h2>${show.name}</h2>
      <img src="${show.image?.medium || ""}" />
      <p>${show.summary || ""}</p>
      <p><strong>Genres:</strong> ${show.genres.join(", ")}</p>
      <p><strong>Status:</strong> ${show.status}</p>
      <p><strong>Rating:</strong> ${show.rating?.average || "N/A"}</p>
      <p><strong>Runtime:</strong> ${show.runtime || "N/A"}</p>
    `;

    card.addEventListener("click", () => {
      loadEpisodesForShow(show.id);
      renderEpisodesView(show.name);
    });

    root.appendChild(card);
  });

  updateEpisodeCount(0);
}

function renderEpisodesView(showName) {
  currentView = "episodes";

  document.getElementById("tvShowSelector").style.display = "inline-block";
  document.getElementById("selectEpisode").style.display = "inline-block";

  showBackButton(showName);
}

function showBackButton(showName) {
  const nav = document.getElementById("navBar");

  nav.innerHTML = `
    <button id="backButton">← Back to shows</button>
    <h2>${showName}</h2>
  `;

  document.getElementById("backButton").onclick = renderShowsView;
}

function loadEpisodesForShow(showId) {
  if (episodeCache[showId]) {
    allEpisodes = episodeCache[showId];

    createOptions(allEpisodes);
    makePageForEpisodes(allEpisodes);
    updateEpisodeCount(allEpisodes.length);

    return;
  }

  showLoadingMessage();

  fetch(`https://api.tvmaze.com/shows/${showId}/episodes`)
    .then((res) => res.json())
    .then((data) => {
      episodeCache[showId] = data;
      allEpisodes = data;

      createOptions(allEpisodes);
      makePageForEpisodes(allEpisodes);
      updateEpisodeCount(allEpisodes.length);
    });
}

function makePageForEpisodes(list) {
  const root = document.getElementById("root");
  root.innerHTML = "";

  list.forEach((ep) => {
    const card = document.createElement("div");
    card.className = "episode-card";

    card.innerHTML = `
      <h2>${ep.name}</h2>
      <p>S${ep.season}E${ep.number}</p>
      <img src="${ep.image?.medium || ""}" />
      <p>${ep.summary || ""}</p>
    `;

    root.appendChild(card);
  });

  updateEpisodeCount(list.length);
}

function createOptions(list) {
  const sel = document.getElementById("selectEpisode");

  sel.innerHTML =
    `<option value="">All Episodes</option>` +
    list
      .map(
        (ep) => `
      <option value="${ep.id}">
        S${String(ep.season).padStart(2, "0")}E${String(ep.number).padStart(2, "0")} - ${ep.name}
      </option>
    `,
      )
      .join("");
}

function updateEpisodeCount(n) {
  const el = document.getElementById("allEpisodesLength");

  if (currentView === "shows") {
    el.innerText = `${allShows.length} shows`;
  } else {
    el.innerText = `${n} episodes`;
  }
}

function showLoadingMessage() {
  document.getElementById("root").innerHTML = "<p>Loading...</p>";
}

window.onload = setup;
