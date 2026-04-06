//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}
 function formatEpisodeCode(season, episode){
  const seasonStr = string(season).padStart(2,"0")
  const episodeStr = string(episode).padStart(2,"0")
  return `S${seasonStr}E${episodeStr}`;
 }
function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.textContent = `Got ${episodeList.length} episode(s)`;
}

window.onload = setup;
