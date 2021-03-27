let key = "AIzaSyAj314hsQUuaB3n_Sebf_28uLfUpNr0boc";

let searchButton = document.getElementById("search-button");
let searchBar = document.getElementById("search-bar");

searchButton.addEventListener("click", () => {
  let mainDiv = document.getElementById("main");
  mainDiv.innerHTML = "";
  let searchTerm = searchBar.value;

  getSearchResults(searchTerm, displayResults);
});

async function getSearchResults(searchTerm, displayResults) {
  await fetch(
    "https://www.googleapis.com/youtube/v3/search?" +
      new URLSearchParams({
        key: key,
        part: "snippet",
        maxResults: 20,
        q: searchTerm,
      }).toString()
  )
    .then((data) => data.json())
    .then((data) => displayResults(data));
}

let displayResults = (results) => {
  let mainDiv = document.getElementById("main");
  let items = results.items;
  console.log(items);
  let videoIds = [];

  for (const key in items) {
    // skip non video results
    if (items[key]["id"]["kind"] !== "youtube#video") continue;

    let videoThumbnailUrl = items[key]["snippet"]["thumbnails"]["high"]["url"];
    let videoTitle = items[key]["snippet"]["title"];
    let videoDescription = items[key]["snippet"]["description"];
    let videoId = items[key]["id"]["videoId"];
    let channelTitle = items[key]["snippet"]["channelTitle"];

    // initialize card div and append to main div
    let cardDiv = document.createElement("div");
    cardDiv.classList.add("card");
    mainDiv.appendChild(cardDiv);

    // video div
    let videoDiv = document.createElement("div");
    videoDiv.classList.add("video");

    let thumbnailmg = document.createElement("img");
    thumbnailmg.src = videoThumbnailUrl;
    thumbnailmg.classList.add("thumbnail");

    cardDiv.appendChild(videoDiv);
    videoDiv.appendChild(thumbnailmg);

    let videoInfo = document.createElement("div");
    videoInfo.classList.add("video-info");

    let videoTitleHTML = document.createElement("h2");
    videoTitleHTML.textContent = videoTitle;

    let channelInfoDiv = document.createElement("div");
    channelInfoDiv.classList.add("channel-info");

    let channelTitleHTML = document.createElement("span");
    channelTitleHTML.textContent = channelTitle;

    let videoDescriptionHTML = document.createElement("p");
    videoDescriptionHTML.textContent = videoDescription;

    videoInfo.appendChild(videoTitleHTML);
    videoInfo.appendChild(channelInfoDiv);
    videoInfo.appendChild(channelTitleHTML);
    videoInfo.appendChild(videoDescriptionHTML);
    cardDiv.appendChild(videoInfo);

    videoIds.push(videoId);
  }

  // get remaining info needed using another fetch
  getVideoInfo(videoIds, displayVideoInfoInResults);
};

let getVideoInfo = (videoIds, displayVideoInfoInResults) => {
  fetch(
    "https://youtube.googleapis.com/youtube/v3/videos?" +
      new URLSearchParams({
        part: ["snippet", "contentDetails", "statistics"],
        id: videoIds,
        key: key,
      }).toString()
  )
    .then((data) => data.json())
    .then((data) => displayVideoInfoInResults(data));

  addCardClickListeners();
};

let displayVideoInfoInResults = (results) => {
  console.log(results);
  let videoInfoDivs = document.getElementsByClassName("video-info");
  let channelInfoDivs = document.getElementsByClassName("channel-info");
  let cardDivs = document.getElementsByClassName("card");

  let counter = 0;
  let items = results.items;

  // loop over all cards and append missing video info details
  for (const key in items) {
    let cardDiv = cardDivs.item(counter);
    let videoInfoDiv = videoInfoDivs.item(counter);
    let channelInfoDiv = channelInfoDivs.item(counter);
    let viewsCount = items[key]["statistics"]["viewCount"];
    let timePublished = items[key]["snippet"]["publishedAt"];
    let videoLikes = items[key]["statistics"]["likeCount"];
    let videoDislikes = items[key]["statistics"]["dislikeCount"];

    // split provided time and get the date only
    let time = timePublished.split("T");
    timePublished = time[0];

    let views = document.createElement("span");
    views.textContent = viewsCount + " views ";

    let timePublishedHTML = document.createElement("span");
    timePublishedHTML.textContent = "Published at: " + timePublished;

    videoInfoDiv.insertBefore(views, channelInfoDiv);
    videoInfoDiv.insertBefore(timePublishedHTML, channelInfoDiv);

    let videoLikesHTML = document.createElement("p");
    videoDislikesHTML.classList.add("videoLikes");
    videoLikesHTML.textContent = videoLikes;

    let videoDislikesHTML = document.createElement("p");
    videoDislikesHTML.classList.add("videoDislikes");
    videoDislikesHTML.textContent = videoDislikes;

    let hiddenInfoDiv = document.createElement("div");
    hiddenInfoDiv.classList.add("hidden");
    hiddenInfoDiv.appendChild(videoLikesHTML);
    hiddenInfoDiv.appendChild(videoDislikesHTML);

    cardDiv.appendChild(hiddenInfoDiv);
    counter++;
  }
};

// adding click event listeners to video cards
let addCardClickListeners = () => {
  let cardDivs = document.getElementsByClassName("card");
  let hiddenDiv = document.getElementById("hidden");
  // click event listeners for cards
  for (let i = 0; i < cardDivs.length; i++) {
    let card = cardDivs.item(i);

    card.addEventListener("click", () => {
      let cardDiv = card.innerText;
      console.log(hiddenDiv.innerText);
      console.log(cardDiv);
      console.log("test");
      window.location.href = "video.html";
    });
  }
};

//TODO: continue, get needed info from hidden div and card div
let addVideoPageDivs = () => {};
