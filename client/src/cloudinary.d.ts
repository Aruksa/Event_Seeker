export {};

declare global {
  interface Window {
    cloudinary: any; // or a more specific type if you know it
  }
}