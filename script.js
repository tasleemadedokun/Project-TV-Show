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
    })
    .catch(() => {
      showErrorMessage();
    });
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
    img.src = episode.image.medium;
    img.alt = episode.name;

    const summary = document.createElement("p");
    summary.innerHTML = episode.summary;

    card.appendChild(title);
    card.appendChild(img);
    card.appendChild(summary);

    rootElem.appendChild(card);
  });
  const credit = document.createElement("p");
  credit.innerHTML = `Data originally from <a href="https://tvmaze.com/" target="_blank">TVMaze.com</a>`;
  rootElem.appendChild(credit);
}

const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", function () {
  const searchValue = this.value.toLowerCase();

  if (!searchValue) {
    document.getElementById("searchResult").innerText = allEpisodes.length;
    return makePageForEpisodes(allEpisodes);
  } else {
    const filteredItems = allEpisodes.filter((episode) => {
      const lowerCasedName = episode.name.toLowerCase();
      const lowerCasedSummary = episode.summary.toLowerCase();

      if (
        lowerCasedName.includes(searchValue) ||
        lowerCasedSummary.includes(searchValue)
      ) {
        return episode;
      }
    });
    document.getElementById("searchResult").innerText = filteredItems.length;
    return makePageForEpisodes(filteredItems);
  }
});

const episodeSelector = document.getElementById("selectEpisode");
const createOptions = function (episodesList) {
  episodeSelector.innerHTML = episodesList
    .map((episode) => {
      const paddedEpisodeNumber = formatEpisodeCode(
        episode.season,
        episode.number,
      );
      return `<option value=${episode.id}>${paddedEpisodeNumber} - ${episode.name}</option>`;
    })
    .join("");
};

episodeSelector.addEventListener("change", function (e) {
  const selectEpisodeId = Number(e.target.value);
  const selectEpisode = allEpisodes.find(
    (episode) => episode.id === selectEpisodeId,
  );
  document.getElementById("searchResult").innerText = "1";
  return makePageForEpisodes([selectEpisode]);
});

window.onload = setup;
