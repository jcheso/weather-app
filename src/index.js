import './styles.css';
// import Icon from './icon.png';


const getSearch = (event) => {
  let search = event.srcElement[0].value;
  event.preventDefault();
  return search;
};

async function getGifs(search) {
  const img = document.querySelector("img");
  const response = await fetch(
    `https://api.giphy.com/v1/gifs/translate?api_key=qrSDUx6Fmx5NVUziNlhnkHofxHzfBF4v&s=${search}`,
    { mode: "cors" }
  );
  const gifData = await response.json();
  img.src = gifData.data.images.original.url;
}

const gifSearch = (event) => {
  let search = getSearch(event);
  getGifs(search);
};

const searchForm = document.getElementById("searchForm");
searchForm.addEventListener("submit", gifSearch);


let apiKey = d9e5b08d8639ae39ae8a23305b524d6b