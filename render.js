const DAYS_AGO_TO_LABEL = {
  1: "Last 24 Hours",
  7: "Last 7 Days",
  0: "All Time",
};

const ZOOM_START = 7;
const ZOOM_ITEM = 15;

export function renderTimeSelectors(selectedDaysAgo) {
  const renderdInner = [1, 7, 0]
    .map(function (daysAgo) {
      const href = `?t=${daysAgo}`;
      const label = DAYS_AGO_TO_LABEL[daysAgo];
      const isSelected = selectedDaysAgo === daysAgo;
      var className = "a-time";
      if (isSelected) {
        className += " a-time-selected";
      }
      return `
        <a href="${href}" class="${className}">
          ${label}
        </a>
      `;
    })
    .join("\n");

  document.getElementById("div-time").innerHTML = `
    In the
    ${renderdInner}
  `;
}

export function renderMap() {
  const LATLNG_DAMBULLA = [7.8742, 80.6511];
  var mapOptions = {
    center: LATLNG_DAMBULLA,
    zoom: ZOOM_START,
  };

  const map = new L.map("div-map", mapOptions);
  const url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  const layer = new L.TileLayer(url);
  map.addLayer(layer);
  return map;
}

function renderLinks(links) {
  return links.split(";").map(function (link) {
    return `
        <a href="${link}" target="_blank">${link}</a>
      `;
  });
}

export function renderMapItem(map, data) {
  const UNIT_RADIUS = 10;
  const sizeDisplay = data.size | 1;
  const sizeInfo = data.size ? data.size : "Unknown";
  const style = {
    color: "red",
    weight: 1,
    radius: UNIT_RADIUS * Math.sqrt(sizeDisplay),
  };
  const circleMarker = L.circleMarker(data.latLng, style);
  const dateStr = data.date.toDateString();

  circleMarker.on("click", function (e) {
    map.setView(e.latlng, ZOOM_ITEM);
  });

  circleMarker.bindPopup(`
    <div class="div-event">
      <p class="p-event-date"><time>${dateStr}</time></p>
      <h2 class="h3-event-location">${data.location}</h2>
      <div>${renderLinks(data.links)}</div>
      <p><strong>${data.status}</strong></p>
    </div>
  `);
  circleMarker.addTo(map);
}
