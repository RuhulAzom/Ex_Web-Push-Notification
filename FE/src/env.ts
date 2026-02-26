// export const API_URL = "http://localhost:4000";
// export const ACCESS_CODE = "Bimbelio";

const API_URL = import.meta.env.VITE_API_URL;
const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;
const STORAGE_UPLOAD_URL = import.meta.env.VITE_STORAGE_UPLOAD_URL;
const ACCESS_CODE = import.meta.env.VITE_ACCESS_CODE;
const VITE_GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const VITE_GOOGLE_CLIENT_SECRET = import.meta.env.VITE_GOOGLE_CLIENT_SECRET;

export const env = {
  API_URL,
  STORAGE_URL,
  STORAGE_UPLOAD_URL,
  ACCESS_CODE,
  VITE_GOOGLE_CLIENT_ID,
  VITE_GOOGLE_CLIENT_SECRET,
};
