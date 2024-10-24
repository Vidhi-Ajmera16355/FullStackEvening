const first = document.getElementById("api-key");
const apiurl = "https://randomfox.ca/floof/";
const btn = document.getElementById("btn");

async function apiKey() {
  const response = await fetch(apiurl);
  const data = await response.json();
  console.log(data);
}

btn.addEventListener("click", () => {
  console.log("btn clicked");
  apiKey();
});
