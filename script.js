//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}
 function formatEpisodeCode(season, episode){
  const seasonStr = String(season).padStart(2,"0")
  const episodeStr = String(episode).padStart(2,"0")
  return `S${seasonStr}E${episodeStr}`;
 }
function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "";

episodeList.forEach(episode => {
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
})
  const credit = document.createElement("p");
credit.innerHTML = `Data originally from <a href="https://tvmaze.com/" target="_blank">TVMaze.com</a>`;
rootElem.appendChild(credit);
}
window.onload = setup;
