let nWaits = 0;

export function showThrobber() {
  nWaits += 1;
  const $throbber = $(".throbber");
  if ($throbber.is(":visible")) {
    return;
  }
  $throbber.show();
  $throbber.fadeIn("slow");
}

export function hideThrobber() {
  nWaits -= 1;
  if (nWaits !== 0) {
    return;
  }
  const $throbber = $(".throbber");
  if (!$throbber.is(":visible")) {
    return;
  }
  $throbber.fadeOut("slow", () => {
    $throbber.hide();
  });
}
