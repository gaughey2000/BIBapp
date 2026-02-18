export function getAssetCandidates(fileName) {
  const base = import.meta.env.BASE_URL || "/";
  const normalizedBase = base.endsWith("/") ? base : `${base}/`;
  const candidates = [`${normalizedBase}${fileName}`];

  const projectPath = `/BIBapp/${fileName}`;
  if (!candidates.includes(projectPath)) {
    candidates.push(projectPath);
  }

  const rootPath = `/${fileName}`;
  if (!candidates.includes(rootPath)) {
    candidates.push(rootPath);
  }

  return candidates;
}

export function handleImageAssetError(event, fileName) {
  const target = event.currentTarget;
  const candidates = getAssetCandidates(fileName);
  const currentIndex = Number(target.dataset.assetTry || "0");
  const nextIndex = currentIndex + 1;

  if (nextIndex >= candidates.length) {
    return;
  }

  target.dataset.assetTry = String(nextIndex);
  target.src = candidates[nextIndex];
}

export function handleVideoAssetError(event, fileName) {
  const target = event.currentTarget;
  const candidates = getAssetCandidates(fileName);
  const currentIndex = Number(target.dataset.assetTry || "0");
  const nextIndex = currentIndex + 1;

  if (nextIndex >= candidates.length) {
    return;
  }

  target.dataset.assetTry = String(nextIndex);
  target.src = candidates[nextIndex];
  target.load();
}
