import api from "./api";

export const getProfile = () => api.get("/users/profile");
export const updateProfile = (data: any) => api.put("/users/profile", data);

export const register = (data: {
  name: string;
  email: string;
  password: string;
}) => api.post("/auth/register", data);

export const login = (data: { email: string; password: string }) =>
  api.post("/auth/login", data);

export const updateLocation = (coordinates: [number, number]) =>
  api.put("/users/location", { coordinates });
