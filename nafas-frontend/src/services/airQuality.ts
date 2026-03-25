import api from "./api";

export const getStations = () => api.get("/stations");
export const getLiveData = () => api.get("/air-quality/live");
export const getHistory = (stationId: string, days = 7) =>
  api.get(`/air-quality/${stationId}/history?days=${days}`);
export const getDailyStats = () => api.get("/air-quality/stats/daily");
export const getRecommendations = (aqi: number) =>
  api.get(`/air-quality/recommendations?aqi=${aqi}`);
