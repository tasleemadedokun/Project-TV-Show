//You can edit ALL of the code here
let allEpisodes = [];

function setup() {
  showLoadingMessage();

  fetch("https://api.tvmaze.com/shows/82/episodes")
    .then((response) => response.json())
    .then((episodeList) => {
      allEpisodes = episodeList;

      makePageForEpisodes(allEpisodes);
      createOptions(allEpisodes);
      setupSearch();

      const episodeSelector = document.getElementById("selectEpisode");

      episodeSelector.addEventListener("change", function (e) {
        const selectedId = e.target.value;

        if (!selectedId) {
          return makePageForEpisodes(allEpisodes);
        }

        const selectedEpisode = allEpisodes.find(
          (episode) => episode.id == selectedId,
        );

        makePageForEpisodes([selectedEpisode]);
      });
    })
    .catch(() => {
      showErrorMessage();
    });
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
    title.textContent = `${episode.name} - ${formatEpisodeCode(
      episode.season,
      episode.number,
    )}`;

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

  document.getElementById("searchResult").innerText = episodeList.length;
}

function setupSearch() {
  const searchInput = document.getElementById("searchInput");

  searchInput.addEventListener("input", function () {
    const searchValue = this.value.toLowerCase();

    if (!searchValue) {
      return makePageForEpisodes(allEpisodes);
    }

    const filteredItems = allEpisodes.filter((episode) => {
      const name = episode.name.toLowerCase();
      const summary = (episode.summary || "").toLowerCase();

      return name.includes(searchValue) || summary.includes(searchValue);
    });

    makePageForEpisodes(filteredItems);
  });
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
