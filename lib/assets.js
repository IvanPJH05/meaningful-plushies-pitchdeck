export const ASSET_BASE_URL = process.env.NEXT_PUBLIC_ASSET_BASE_URL || "";

export const assetUrl = (path) => `${ASSET_BASE_URL}${path}`;
