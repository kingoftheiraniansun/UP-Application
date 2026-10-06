/**
* Local app assets
*
* All media is bundled with the app under /public/media
* so Android does not depend on Google Drive or an external CDN.
*/

export const DRIVE = {
  logoBlack: "upstudio-logo.png",

  introVideo: "upstudiointro.mp4",

  gallery: [
    "021120.jpg",
    "021140.jpg",
    "021157.jpg",
    "021231.jpg",
    "021251.jpg",
    "021324.jpg",
    "021339.jpg",
    "021355.jpg",
    "021438.jpg",
    "021454.jpg",
    "021518.jpg",
    "021642.jpg",
    "021711.jpg",
    "021748.jpg",
    "021757.jpg",
    "021840.jpg",
    "021855.jpg",
  ],
} as const;

/**
* Local gallery image.
*/
export const driveImage = (fileName: string, _width = 1600) =>
  `/media/gallery/${fileName}`;

/**
* Local fallback image.
*/
export const driveThumb = (fileName: string, _width = 1600) =>
  `/media/gallery/${fileName}`;

/**
* Local intro video.
*/
export const driveVideo = (fileName: string) =>
  `/media/intro/${fileName}`;

export const ASSETS = {
  logo: `/media/logo/${DRIVE.logoBlack}`,

  logoFallback: `/media/logo/${DRIVE.logoBlack}`,

  introVideo: driveVideo(DRIVE.introVideo),

  introPoster: `/media/intro/upstudiointro-poster.jpg`,

  heroImage: driveImage(DRIVE.gallery[0], 2000),
};
