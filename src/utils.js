export function boundsWithPadding(bounds, paddingScale) {
  const width = bounds._northEast.lat - bounds._southWest.lat;
  const height = bounds._northEast.lng - bounds._southWest.lng;
  bounds._southWest.lat -= width * paddingScale;
  bounds._southWest.lng -= height * paddingScale;
  bounds._northEast.lat += width * paddingScale;
  bounds._northEast.lng += height * paddingScale;
  return bounds;
}
