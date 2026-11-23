import { getParks } from "./nps.mjs";

export const PAGE_SIZE = 12;

export function renderParks(parks, returnQuery) {
  const list = document.querySelector("#park-list");
  const template = document.querySelector("#park-card");
  const cards = parks.map((park) => {
    const card = template.content.cloneNode(true);
    card.querySelector("h3").textContent = park.fullName;
    card.querySelector(".park-states").textContent = park.states.split(",").join(" · ");
    card.querySelector(".card-description").textContent = park.description;
    const link = card.querySelector("a");
    const parameters = new URLSearchParams({ parkCode: park.parkCode, return: returnQuery });
    link.href = `park.html?${parameters}`;
    link.setAttribute("aria-label", `View ${park.fullName}`);

    const image = card.querySelector("img");
    const photo = park.images?.[0];
    const showFallback = () => {
      image.hidden = true;
      image.parentElement.textContent = "Photo unavailable";
    };
    if (photo?.url) {
      image.alt = photo.altText || park.fullName;
      image.addEventListener("error", showFallback, { once: true });
      const imageURL = new URL(photo.url);
      imageURL.searchParams.set("maxwidth", "640");
      imageURL.searchParams.set("quality", "75");
      image.src = imageURL.href;
    } else {
      showFallback();
    }
    return card;
  });
  list.replaceChildren(...cards);
}

export async function loadParks({ query, state, page }) {
  return getParks({ query, state, start: (page - 1) * PAGE_SIZE, limit: PAGE_SIZE });
}
