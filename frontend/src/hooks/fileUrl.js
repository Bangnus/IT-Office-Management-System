import BaseUrl from "./baseUrl";

// Uploaded files are served by the backend at /uploads, next to /api
const FILE_ORIGIN = (BaseUrl || "http://localhost:5000/api").replace(/\/api\/?$/, "");

/** Full URL for a stored upload path such as "uploads/123.jpg" (Windows backslashes are normalised). */
export const fileUrl = (path) => (path ? `${FILE_ORIGIN}/${String(path).replace(/\\/g, "/").replace(/^\/+/, "")}` : null);

export default fileUrl;
