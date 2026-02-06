const API_BASE_URL = "http://localhost:5000/api";

export async function fetchImportLogs(page = 1, limit = 10) {
  const response = await fetch(
    `${API_BASE_URL}/import-logs?page=${page}&limit=${limit}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch import logs");
  }

  return response.json();
}
