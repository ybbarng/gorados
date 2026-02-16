import Platform from "platform";

import { calculateIvPerfection, calculateIvRank } from "./iv-utils";
import Pokedex from "./pokedex_korean.json";
import Moves from "./pokemon_moves.json";

const platform = Platform.os.family;

function pad(n) {
  return (n < 10 ? "0" : "") + n;
}

// Pokemon Class
function Pokemon(pokemon) {
  this.id = pokemon.id;
  this.name = Pokedex[pokemon.pokemon_id] || pokemon.pokemon_id;
  this.pokemon_id = pokemon.pokemon_id;
  if (pokemon.disguise === "1") {
    this.pokemon_id = "132";
    this.name = `${Pokedex[this.pokemon_id]}(${this.name}(으)로 변신)`;
  }
  this.latitude = pokemon.latitude;
  this.longitude = pokemon.longitude;
  this.despawn = Number(pokemon.despawn);
  this.disguise = pokemon.disguise;
  this.attack = Number(pokemon.attack);
  this.defence = Number(pokemon.defence);
  this.stamina = Number(pokemon.stamina);
  this.move1 = pokemon.move1;
  this.move2 = pokemon.move2;
  this.move1Str = Moves[pokemon.move1] || pokemon.move1;
  this.move2Str = Moves[pokemon.move2] || pokemon.move2;
  this.perfection = calculateIvPerfection(
    this.attack,
    this.defence,
    this.stamina,
  );
  this.perfectionStr = this.perfection.toFixed(1);
  this.rank = calculateIvRank(this.perfection);
}

Pokemon.prototype.setMarker = function (marker) {
  this.marker = marker;
};

Pokemon.prototype.getRemainTime = function (_now) {
  const now = _now || Date.now() / 1000;
  return this.despawn - now;
};

Pokemon.prototype.getRemainTimeStr = function (now) {
  const delta = this.getRemainTime(now);
  let despawnStr = "";
  if (delta > 0) {
    despawnStr = `${pad(Number.parseInt(delta / 60))}:${pad(Number.parseInt(delta % 60))}`;
  } else {
    despawnStr = "사라졌습니다.";
  }
  return despawnStr;
};

Pokemon.prototype.getOpacity = function (now, dehighlight) {
  if (!dehighlight) {
    if (this.marker?.getPopup().isOpen()) {
      return 1;
    }
  }
  const diff = this.getRemainTime(now);
  const opacity = (diff / 60 / 30) * 0.5 + 0.5;
  return Math.max(0, Math.min(1, opacity));
};

Pokemon.prototype.getLatLng = function () {
  return [this.latitude, this.longitude];
};

function getMapDom(href, imageSrc, newTap) {
  let newTapStr = "";
  if (newTap) {
    newTapStr = ' target="_blank"';
  }
  return `<a href="${href}"${newTapStr} class="map-app-icon-wrapper"><image src="${imageSrc}" class="map-app-icon"></a>`;
}

function getKakaoMap(latitude, longitude) {
  const imageSrc = "static/images/maps/kakao-map.png";
  let href = "";
  const hrefs = {
    desktop: `http://map.daum.net/?q=${latitude},${longitude}`,
    mobile: `daummaps://route?ep=${latitude},${longitude}&by=CAR`,
  };
  if (["Android", "iOS"].indexOf(platform) !== -1) {
    href = hrefs.mobile;
  } else {
    href = hrefs.desktop;
  }
  return getMapDom(href, imageSrc, href === hrefs.desktop);
}

function getGoogleMap(latitude, longitude, label) {
  const imageSrc = "static/images/maps/google-map.png";
  const hrefs = {
    desktop: `https://www.google.co.kr/maps/place/${latitude},${longitude}`,
    Android: `geo:?q=${latitude},${longitude}(${label})`,
    iOS: `comgooglemaps://?q=${latitude},${longitude}`,
  };
  let href = hrefs.desktop;
  if (hrefs[platform]) {
    href = hrefs[platform];
  }
  return getMapDom(href, imageSrc, href === hrefs.desktop);
}

function getMapLinks(latitude, longitude, label) {
  const kakaoMap = getKakaoMap(latitude, longitude);
  const googleMap = getGoogleMap(latitude, longitude, label);
  return `<div class="map-apps">${kakaoMap}${googleMap}</div>`;
}

function getMoveLinkText(move, moveName) {
  return `<a href="http://pokemongo.inven.co.kr/dataninfo/move/detail.php?code=${move}" target="_blank" title="\'${moveName}' 기술 자세히 알아보기\">${moveName}</a>`;
}

Pokemon.prototype.getLinkText = function () {
  return `<a href="?p=${this.latitude},${this.longitude}&z=16" class="get-link" title="링크 얻기"><img src="static/images/get_link.png"></a>`;
};

Pokemon.prototype.getPopupContents = function () {
  const despawnStr = this.getRemainTimeStr();
  return `<h2>${this.name}<a href="http://pokemongo.inven.co.kr/dataninfo/pokemon/detail.php?code=${this.pokemon_id}" class="pokedex-wrapper" target="_blank" title="포켓몬도감에서 보기"><img class="pokedex" src="/static/images/pokedex.png" alt="포켓몬도감에서 보기"><img class="pokedex-pokemon-image" src="/static/images/pokemons/${this.pokemon_id}.png"></a></h2> ${this.getLinkText()}<b>개체치</b>: ${this.rank} (${this.perfectionStr}%: ${this.attack}/${this.defence}/${this.stamina})<br><b>남은 시간</b>: <span class="despawn">${despawnStr}</span><br><b>기술</b>: ${getMoveLinkText(this.move1, this.move1Str)}/${getMoveLinkText(this.move2, this.move2Str)}<br>disguise: ${this.disguise}<br>${getMapLinks(this.latitude, this.longitude, this.name)}`;
};

export default Pokemon;
