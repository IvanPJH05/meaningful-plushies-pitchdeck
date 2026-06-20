export const ASSET_BASE_URL = process.env.NEXT_PUBLIC_ASSET_BASE_URL || 'https://i-want-to-develop-a-new.vercel.app';
export const assetUrl = (path) => `${ASSET_BASE_URL}${path}`;
