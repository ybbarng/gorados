import Pokedex from "./pokedex_korean.json";

let onApply = null;
let filters = [];
export function initFilter(onApplyHandler) {
  $("#filter-button a").click(onClickFilterButton);
  $("#filter-apply").click(onClickFilterApply);
  $("#filters").click(onClickFilters);
  $("#filters-popup").click(onClickFiltersPopup);
  $("#search").keyup(onSearch);
  onApply = onApplyHandler;
  loadFilters();
}

let initialized = false;
function onClickFilterButton() {
  $("#filters").fadeToggle();
  if (!initialized) {
    initFilters();
  }
}

const filter_max = 251;
function initFilters() {
  const $pokemon_list = $("#filter-list");
  for (const number in Pokedex) {
    if (number * 1 > filter_max) {
      break;
    }
    const $filter = $(
      `<li class="filter"><input type="checkbox" id="checkbox_${number}" value="${number}"${filters.indexOf(number) !== -1 ? " checked" : ""}><label for="checkbox_${number}"><img src="static/images/pokemons/${number}.png" alt="${Pokedex[number]}">${number}: ${Pokedex[number]}</label></li>`,
    );
    $pokemon_list.append($filter);
  }
  $(".filter").on("touchstart", function () {
    $(this).addClass("touch");
  });
  $(".filter").on("touchend", function () {
    $(this).removeClass("touch");
  });
  initialized = true;
}

function loadFilters() {
  const cookie_filters = $.cookie("filters");
  if (cookie_filters) {
    filters = cookie_filters.split(",");
  }
}

function onClickFilterApply() {
  filters = [];
  $(".filter input:checked").each(function () {
    filters.push(this.value);
  });
  $.cookie("filters", filters);
  if (onApply) {
    onApply();
  }
  $("#filters").fadeOut();
}

export function getFilters() {
  return filters;
}

function onClickFiltersPopup(e) {
  e.stopPropagation();
}

function onClickFilters() {
  $("#filters").fadeOut();
}

function onSearch() {
  const inputValue = $("#search").val();
  $(".filter label").each(function () {
    if ($(this).text().indexOf(inputValue) > -1) {
      $(this).parent().show();
    } else {
      $(this).parent().hide();
    }
  });
}
