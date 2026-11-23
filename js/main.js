import { loadParks, renderParks, PAGE_SIZE } from "./parks-list.mjs";

const form = document.querySelector("#search-form");
const search = document.querySelector("#park-search");
const stateSelect = document.querySelector("#state");
const status = document.querySelector("#status");
const list = document.querySelector("#park-list");
const pagination = document.querySelector("#pagination");
const previous = document.querySelector("#previous");
const next = document.querySelector("#next");
const retry = document.querySelector("#retry");
const count = document.querySelector("#result-count");

const parameters = new URLSearchParams(location.search);
let query = parameters.get("q")?.trim().slice(0, 100) || "";
stateSelect.value = parameters.get("state") || "";
let state = stateSelect.value;
let page = Math.max(1, Number.parseInt(parameters.get("page"), 10) || 1);
search.value = query;

// The URL keeps search results available after visiting a park or refreshing.
function updateURL() {
  const parameters = new URLSearchParams();
  if (query) parameters.set("q", query);
  if (state) parameters.set("state", state);
  if (page > 1) parameters.set("page", page);
  history.replaceState(null, "", `index.html${parameters.size ? `?${parameters}` : ""}`);
}

async function showResults() {
  list.replaceChildren();
  list.setAttribute("aria-busy", "true");
  status.textContent = "Loading parks…";
  status.classList.add("is-loading");
  count.textContent = "";
  pagination.hidden = true;
  retry.hidden = true;
  form.querySelector("button").disabled = true;
  try {
    let result = await loadParks({ query, state, page });
    const total = Number(result.total);
    const lastPage = Math.max(1, Math.ceil(total / PAGE_SIZE));
    // An old or manually edited URL may refer to a page that no longer exists.
    if (page > lastPage) {
      page = lastPage;
      result = await loadParks({ query, state, page });
    }
    updateURL();
    renderParks(result.data, location.search);
    status.textContent = total ? `Showing ${result.data.length} of ${total} parks.` : "No parks found. Try another search or choose All states.";
    count.textContent = `${total} ${total === 1 ? "park" : "parks"}`;
    document.querySelector("#page-number").textContent = `Page ${page} of ${lastPage}`;
    previous.disabled = page === 1;
    next.disabled = page >= lastPage;
    pagination.hidden = lastPage <= 1;
  } catch {
    status.textContent = "We couldn't load the parks. Check your connection and try again.";
    retry.hidden = false;
  } finally {
    status.classList.remove("is-loading");
    list.setAttribute("aria-busy", "false");
    form.querySelector("button").disabled = false;
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  query = search.value.trim();
  state = stateSelect.value;
  page = 1;
  showResults();
});

previous.addEventListener("click", () => { page -= 1; showResults(); });
next.addEventListener("click", () => { page += 1; showResults(); });
retry.addEventListener("click", showResults);
showResults();
