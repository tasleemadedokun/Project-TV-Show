let allEpisodes = [];
let allShows = [];
const episodeCache = {};

function setup() {
  showLoadingMessage();

  fetch("https://api.tvmaze.com/shows")
    .then((response) => response.json())
    .then((data) => {
      allShows = data.sort((a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
      );
      populateShowSelector();
      loadEpisodesForShow(allShows[0].id);
    })
    .catch(showErrorMessage);

  document
    .getElementById("tvShowSelector")
    .addEventListener("change", function (e) {
      loadEpisodesForShow(e.target.value);
    });

  document
    .getElementById("selectEpisode")
    .addEventListener("change", function (e) {
      const selectedId = e.target.value;
      if (!selectedId) {
        makePageForEpisodes(allEpisodes);
      } else {
        const selectedEpisode = allEpisodes.find((ep) => ep.id == selectedId);
        makePageForEpisodes([selectedEpisode]);
      }
    });

  document.getElementById("searchInput").addEventListener("input", function () {
    const searchValue = this.value.toLowerCase();
    if (!searchValue) {
      makePageForEpisodes(allEpisodes);
    } else {
      const filtered = allEpisodes.filter((episode) => {
        const name = episode.name.toLowerCase();
        const summary = (episode.summary || "").toLowerCase();
        return name.includes(searchValue) || summary.includes(searchValue);
      });
      makePageForEpisodes(filtered);
    }
  });
}

function populateShowSelector() {
  const tvShowSelector = document.getElementById("tvShowSelector");
  tvShowSelector.innerHTML = allShows
    .map((show) => `<option value="${show.id}">${show.name}</option>`)
    .join("");
}

function loadEpisodesForShow(showId) {
  if (episodeCache[showId]) {
    allEpisodes = episodeCache[showId];
    createOptions(allEpisodes);
    makePageForEpisodes(allEpisodes);
    updateEpisodeCount();
    document.getElementById("searchInput").value = "";
    return;
  }

  showLoadingMessage();

  fetch(`https://api.tvmaze.com/shows/${showId}/episodes`)
    .then((response) => response.json())
    .then((data) => {
      episodeCache[showId] = data;
      allEpisodes = data;
      createOptions(allEpisodes);
      makePageForEpisodes(allEpisodes);
      updateEpisodeCount();
      document.getElementById("searchInput").value = "";
    })
    .catch(showErrorMessage);
}

function updateEpisodeCount() {
  document.getElementById("allEpisodesLength").innerText =
    `${allEpisodes.length} episodes`;
}

function showLoadingMessage() {
  const root = document.getElementById("root");
  root.innerHTML = "<p>Loading episodes... please wait</p>";
}

function showErrorMessage() {
  const root = document.getElementById("root");
  root.innerHTML = "<p>Failed to load episodes. Please try again later.</p>";
}

function formatEpisodeCode(season, episode) {
  const seasonStr = String(season).padStart(2, "0");
  const episodeStr = String(episode).padStart(2, "0");
  return `S${seasonStr}E${episodeStr}`;
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "";

  episodeList.forEach((episode) => {
    const card = document.createElement("div");
    card.className = "episode-card";

    const title = document.createElement("h2");
    title.textContent = `${episode.name} - ${formatEpisodeCode(episode.season, episode.number)}`;

    const img = document.createElement("img");
    img.src = episode.image?.medium || "";
    img.alt = episode.name;

    const summary = document.createElement("p");
    summary.innerHTML = episode.summary || "";

    card.appendChild(title);
    card.appendChild(img);
    card.appendChild(summary);
    rootElem.appendChild(card);
  });

  const credit = document.createElement("p");
  credit.innerHTML = `Data originally from <a href="https://tvmaze.com/" target="_blank">TVMaze.com</a>`;
  rootElem.appendChild(credit);

  document.getElementById("searchResultDisplaying").innerText =
    episodeList.length;
}

function createOptions(episodesList) {
  const episodeSelector = document.getElementById("selectEpisode");
  episodeSelector.innerHTML =
    `<option value="">All Episodes</option>` +
    episodesList
      .map((episode) => {
        const code = formatEpisodeCode(episode.season, episode.number);
        return `<option value="${episode.id}">${code} - ${episode.name}</option>`;
      })
      .join("");
}

window.onload = setup;
