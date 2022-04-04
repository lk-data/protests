import { getProtestData, renderProtestsSource } from "./protests.js";
import { renderMap, renderMapItem, renderTimeSelectors } from "./render.js";

function updateProgress(message) {
  document.getElementById("p-progress").innerHTML = message;
}

function getDaysAgo() {
  const DEFAULT_DAYS_AGO = 1;
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  if (!urlParams.has("t")) {
    return DEFAULT_DAYS_AGO;
  }
  return parseInt(urlParams.get("t"));
}

function main() {
  renderProtestsSource();

  updateProgress("Loading Map...");
  const map = renderMap();
  const daysAgo = getDaysAgo();
  renderTimeSelectors(daysAgo);
  updateProgress("Loading Events...");
  getProtestData(daysAgo, function (dataList) {
    dataList.forEach(function (data) {
      renderMapItem(map, data);
    });
    updateProgress(`Loaded ${dataList.length} Events.`);
  });
}

main();
