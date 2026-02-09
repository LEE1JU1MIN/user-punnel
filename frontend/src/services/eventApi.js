import apiClient from "./apiClient";

export async function postEvent(event) {
  return apiClient.post("/events", event);
}
