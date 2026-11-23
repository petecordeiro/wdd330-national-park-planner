import { getPark } from "./nps.mjs";

const parameters = new URLSearchParams(location.search);
const parkCode = parameters.get("parkCode") || "";
const status = document.querySelector("#status");
const retry = document.querySelector("#retry");
const details = document.querySelector("#park-details");

// Only carry known search parameters back to our own Explore page.
const returnParameters = new URLSearchParams(parameters.get("return") || "");
const backParameters = new URLSearchParams();
for (const name of ["q", "state", "page"]) {
  if (returnParameters.has(name)) backParameters.set(name, returnParameters.get(name));
}
document.querySelector("#back-link").href = `index.html${backParameters.size ? `?${backParameters}` : ""}`;

async function showPark() {
  retry.hidden = true;
  status.textContent = "Loading park…";
  status.classList.add("is-loading");
  if (!/^[a-z]{4}$/.test(parkCode)) {
    status.classList.remove("is-loading");
    status.textContent = "Choose a park from the Explore page to view its details.";
    return;
  }
  try {
    const park = await getPark(parkCode);
    document.title = `${park.fullName} | National Park Visit Planner`;
    document.querySelector("#park-title").textContent = park.fullName;
    document.querySelector('meta[name="description"]').content = park.description;
    document.querySelector("#park-states").textContent = park.states.split(",").join(" · ");
    document.querySelector("#park-description").textContent = park.description;
    const officialLink = document.querySelector("#official-link");
    officialLink.href = park.url;
    officialLink.hidden = !park.url;

    const photo = park.images?.[0];
    const figure = document.querySelector("#park-figure");
    if (photo?.url) {
      const image = document.querySelector("#park-image");
      image.alt = photo.altText || park.fullName;
      image.addEventListener("error", () => { figure.hidden = true; }, { once: true });
      const imageURL = new URL(photo.url);
      imageURL.searchParams.set("maxwidth", "1200");
      imageURL.searchParams.set("quality", "80");
      image.src = imageURL.href;
      document.querySelector("#photo-credit").textContent = photo.credit || "National Park Service";
      figure.hidden = false;
    }
    details.hidden = false;
    status.textContent = "";
  } catch (error) {
    status.textContent = error.name === "TypeError" || error.name === "TimeoutError"
      ? "We couldn't load this park. Check your connection and try again."
      : error.message;
    retry.hidden = false;
  } finally {
    status.classList.remove("is-loading");
  }
}

retry.addEventListener("click", showPark);
showPark();
