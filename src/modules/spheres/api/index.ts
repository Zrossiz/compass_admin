import { apiClient } from "../../../shared/api";
import type { Sphere } from "../types";

export const getAllSpheres = async () => {
  const res = await apiClient.get<Sphere[]>('/api/v1/spheres');

  return res.data;
};
