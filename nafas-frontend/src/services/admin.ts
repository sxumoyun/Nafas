import api from "./api";

export const getAdminStats = () => api.get("/admin/stats");
export const getAdminUsers = () => api.get("/admin/users");
export const getAdminStations = () => api.get("/admin/stations");
export const getAdminAirQuality = () => api.get("/admin/air-quality");

export const updateUserRole = (id: string, role: string) =>
  api.patch(`/admin/users/${id}/role`, { role });
export const deleteUser = (id: string) => api.delete(`/admin/users/${id}`);
export const toggleStation = (id: string) =>
  api.patch(`/admin/stations/${id}/toggle`);
export const deleteStation = (id: string) =>
  api.delete(`/admin/stations/${id}`);
export const clearAirQuality = () => api.delete("/admin/air-quality/clear");
