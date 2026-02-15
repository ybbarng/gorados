export function calculateIvPerfection(attack, defence, stamina) {
  return ((Number(attack) + Number(defence) + Number(stamina)) / 45) * 100;
}

export function calculateIvRank(iv_perfection) {
  const ranks = ["SSS", "SS", "S", "A", "B", "C", "D", "E"];
  const perfections = [100, 95, 90, 80, 60, 40, 0];
  for (let i = 0; i < perfections.length; i++) {
    if (iv_perfection >= perfections[i]) {
      return ranks[i];
    }
  }
  return "E";
}
