var params = null;

function loadParams() {
  var pageUrl = decodeURIComponent(window.location.search.substring(1));
  var urlVariables = pageUrl.split('&');
  params = {};
  for (var i = 0; i < urlVariables.length; i++) {
    var param = urlVariables[i].split('=');
    params[param[0]] = param[1] === undefined ? true : param[1];
  }
}

exports.getUrlParameter = function(param) {
  if (params === null) {
    loadParams();
  }
  return params[param];
};
