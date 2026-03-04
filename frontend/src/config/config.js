const config = {
  flaskUrl: import.meta.env.VITE_FLASK_URL || "http://localhost:8000",
  backendUrl: import.meta.env.VITE_BACKEND_URL || "http://localhost:4000/api/v1/user",
};

export default config;
