// Utility function to get correct image paths for Vercel deployment
export const getImagePath = (imageName) => {
  // In development, process.env.PUBLIC_URL is usually empty
  // In production (Vercel), it will be the correct base URL
  const baseUrl = process.env.PUBLIC_URL || '';
  return `${baseUrl}/${imageName}`;
};

// Helper function to get asset path (for STL files, videos, etc.)
export const getAssetPath = (assetName) => {
  return getImagePath(assetName);
};
