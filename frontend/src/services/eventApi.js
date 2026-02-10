import apiClient from "./apiClient";

export async function postEvent(event) {
  return apiClient.post("/events", event);
}

export async function clearEvents() {
  return apiClient.post("/events/clear");
}
