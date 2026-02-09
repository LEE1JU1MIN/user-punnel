import apiClient from "./apiClient";

export async function fetchFunnelSummary() {
  const res = await apiClient.get("/funnel/summary");
  return res.data;
}
