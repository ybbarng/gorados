let params = null;

function loadParams() {
  const pageUrl = decodeURIComponent(window.location.search.substring(1));
  const urlVariables = pageUrl.split("&");
  params = {};
  for (let i = 0; i < urlVariables.length; i++) {
    const param = urlVariables[i].split("=");
    params[param[0]] = param[1] === undefined ? true : param[1];
  }
}

export function getUrlParameter(param) {
  if (params === null) {
    loadParams();
  }
  return params[param];
}
