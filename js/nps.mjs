import { NPS_API_KEY } from "./config.mjs";

const BASE_URL = "https://developer.nps.gov/api/v1/";

// Keep requests in one place so both pages use the same configuration.
async function request(endpoint, parameters) {
  const url = new URL(endpoint, BASE_URL);
  url.search = new URLSearchParams(parameters).toString();
  const response = await fetch(url, {
    headers: { "X-Api-Key": NPS_API_KEY },
    signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) {
    throw new Error("The National Park Service is unavailable. Please try again.");
  }
  return response.json();
}

export function getParks({ query = "", state = "", start = 0, limit = 12 } = {}) {
  const parameters = { start, limit, sort: "fullName" };
  if (query) parameters.q = query;
  if (state) parameters.stateCode = state;
  return request("parks", parameters);
}

export async function getPark(parkCode) {
  const result = await request("parks", { parkCode, limit: 1 });
  if (!result.data.length) throw new Error("We couldn't find that park. Choose a park from the Explore page.");
  return result.data[0];
}
