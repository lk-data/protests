const GSS_ID = "1yShvemHd_eNNAtC3pmxPs9B5RbGmfBUP1O6WGQ5Ycrg";
const GSS_URL = "https://docs.google.com/spreadsheets/d/"
  + `${GSS_ID}`;
const GSS_URL_EXPORT = GSS_URL + '/export?format=csv'

export function renderProtestsSource() {
  document.getElementById("div-source").innerHTML = `
    <div>
      <a href="${GSS_URL}" target="_blank">
        Crowd-Sourced
      </a>
      Data* on
    <div>
  `;
}


function mapRawData(d) {
  const location = d["Location"];
  const latLngTokens = d["LatLng (approx)"].split(",");

  var latLng = null;
  if (latLngTokens.length === 2) {
      latLng = latLngTokens.map((x) => parseFloat(x));
  }

  const [dStr, mStr, yStr] = d["Date"].split("/");
  const date = new Date(parseInt(yStr), parseInt(mStr) - 1, parseInt(dStr));

  return {
    location,
    latLng,
    date,
    links: d["Footage (links, add multiple if possible)"],
    size: parseInt(d["Size assessment (small-medium-large)"]),
    contributor:
      d[
        "Contributor name, add yours if you add something (twitter handles work)"
      ],
  };
}

function filterData(d) {
  return d.location && d.latLng && !isNaN(d.date);
}

function getFuncFilterDaysAgo(daysAgo) {
  const currentUT = new Date().getTime() / 1_000;
  function filterDaysAgo(d) {
    const eventUT = d.date.getTime() / 1_000;
    return currentUT - eventUT <= daysAgo * 86400;
  }
  return filterDaysAgo;
}

export function getProtestData(daysAgo, funcProcessDataList) {
  const filterDaysAgo = getFuncFilterDaysAgo(daysAgo);

  d3.csv(GSS_URL_EXPORT, function (rawDataList) {
    var dataList = rawDataList.map(mapRawData).filter(filterData);

    if (daysAgo !== 0) {
      dataList = dataList.filter(filterDaysAgo);
    }

    funcProcessDataList(dataList);
  });
}
