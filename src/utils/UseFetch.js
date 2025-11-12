import { useCallback, useState } from "react";

const UseFetch = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async ({ url, method = "GET", body = null, headers = {} }) => {
    setLoading(true);
    setError(null);

    try {
      // Verificamos token y evitamos errores de "undefined"
      const storedToken = localStorage.getItem("token");
      const token =
        storedToken && storedToken !== "undefined" ? JSON.parse(storedToken) : null;

      // Creamos headers dinámicos
      const baseHeaders = {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      };

      const options = {
        method,
        headers: baseHeaders,
        body: body ? JSON.stringify(body) : null,
      };

      const response = await fetch(import.meta.env.VITE_BACKEND_URL + url, options);

      // Si la respuesta no tiene contenido (ej. 204 No Content)
      if (response.status === 204) {
        setData(null);
        return null;
      }

      // Verificamos si el contenido es JSON antes de parsear
      const contentType = response.headers.get("content-type");
      let result = null;

      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
      } else {
        result = await response.text(); // fallback
      }

      if (!response.ok) {
        const message =
          result?.message ||
          `Error ${response.status}: ${response.statusText || "Unknown"}`;
        setError(message);
        return null;
      }

      setData(result);
      return result;
    } catch (err) {
      console.error("❌ Fetch error:", err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchData };
};

export default UseFetch;
