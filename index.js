let key = "AIzaSyAj314hsQUuaB3n_Sebf_28uLfUpNr0boc";

let searchButton = document.getElementById("search-button");
let searchBar = document.getElementById("search-bar");

searchButton.addEventListener("click", () => {
  let instructionText = document.getElementById("instructions");

  if (instructionText === undefined || null) instructionText.textContent = "";

  let mainDiv = document.getElementById("main");
  mainDiv.innerHTML = "";

  let searchTerm = searchBar.value;

  getSearchResults(searchTerm, displayResults);
});

function getSearchResults(searchTerm, displayResults) {
  fetch(
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

let channelIds = [];

let displayResults = (results) => {
  let mainDiv = document.getElementById("main");
  let items = results.items;
  // video ids in order, to be used in fetching video details
  let videoIds = [];
  console.log(items);
  for (const key in items) {
    // skip non video results
    if (items[key]["id"]["kind"] !== "youtube#video") continue;

    let videoThumbnailUrl = items[key]["snippet"]["thumbnails"]["high"]["url"];
    let videoTitle = items[key]["snippet"]["title"];
    let videoDescription = items[key]["snippet"]["description"];
    let videoId = items[key]["id"]["videoId"];
    let channelTitle = items[key]["snippet"]["channelTitle"];
    let channelId = items[key]["snippet"]["channelId"];

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

    let videoTitleHTML = document.createElement("h3");
    videoTitleHTML.textContent = videoTitle;

    let channelInfoDiv = document.createElement("div");
    channelInfoDiv.classList.add("channel-info");

    let channelTitleHTML = document.createElement("span");
    channelTitleHTML.classList.add("channel-title");
    channelTitleHTML.textContent = channelTitle;

    let videoDescriptionHTML = document.createElement("p");
    videoDescriptionHTML.textContent = videoDescription;

    videoInfo.appendChild(videoTitleHTML);
    videoInfo.appendChild(channelInfoDiv);
    channelInfoDiv.appendChild(channelTitleHTML);
    videoInfo.appendChild(videoDescriptionHTML);
    cardDiv.appendChild(videoInfo);

    channelIds.push(channelId);
    videoIds.push(videoId);
  }

  // get remaining info needed using another fetch
  displayVideoInfo(videoIds, displayVideoInfoOnDocument);
};

let displayChannelImgs = (channelIds, displayChannelImgsOnDocument) => {
  // using a loop since the api skips repeated channel ids
  // repeated channel ids could be present if search results include more than one video for same channel
  const channelDataPromises = channelIds.map((channelId) => {
    return fetch(
      "https://youtube.googleapis.com/youtube/v3/channels?" +
        new URLSearchParams({
          part: ["snippet", "contentDetails", "statistics"],
          id: channelId,
          key: key,
        }).toString()
    );
  });

  Promise.all(channelDataPromises).then((responses) =>
    responses.forEach((response, index) =>
      response.json().then((data) => displayChannelImgsOnDocument(data, index))
    )
  );
};

let displayChannelImgsOnDocument = (data, counter) => {
  // displays channel icon in search results

  let channelInfoDivs = document.getElementsByClassName("channel-info");
  let channelTitledivs = document.getElementsByClassName("channel-title");
  let hiddenDivs = document.getElementsByClassName("hidden");

  let channelThumbnail =
    data["items"][0]["snippet"]["thumbnails"]["default"]["url"];

  let channelInfoDiv = channelInfoDivs.item(counter);
  let channelTitle = channelTitledivs.item(counter);

  let channelThumbnailSpan = document.createElement("span");
  channelThumbnailSpan.textContent = channelThumbnail;

  let hiddenDiv = hiddenDivs.item(counter);

  hiddenDiv.appendChild(channelThumbnailSpan);

  let channelThumbnailElement = document.createElement("img");
  channelThumbnailElement.src = channelThumbnail;

  channelInfoDiv.insertBefore(channelThumbnailElement, channelTitle);
};

let displayVideoInfo = (videoIds, displayVideoInfoOnDocument) => {
  fetch(
    "https://youtube.googleapis.com/youtube/v3/videos?" +
      new URLSearchParams({
        part: ["snippet", "contentDetails", "statistics"],
        id: videoIds,
        key: key,
      }).toString()
  )
    .then((data) => data.json())
    .then((data) => displayVideoInfoOnDocument(data));
};

// search page
let displayVideoInfoOnDocument = (results) => {
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
    let videoId = items[key]["id"];

    // split provided time and get the date only
    let time = timePublished.split("T");
    timePublished = time[0];

    let views = document.createElement("span");
    views.textContent = viewsCount + " views ";

    let timePublishedHTML = document.createElement("span");
    timePublishedHTML.textContent = "Published at: " + timePublished;

    videoInfoDiv.insertBefore(views, channelInfoDiv);
    videoInfoDiv.insertBefore(timePublishedHTML, channelInfoDiv);

    let videoLikesHTML = document.createElement("span");
    videoLikesHTML.classList.add("videoLikes");
    videoLikesHTML.textContent = videoLikes + "\n";

    let videoDislikesHTML = document.createElement("span");
    videoDislikesHTML.classList.add("videoDislikes");
    videoDislikesHTML.textContent = videoDislikes + "\n";

    let videoIdHTML = document.createElement("span");
    videoIdHTML.classList.add("videoId");
    videoIdHTML.textContent = videoId + "\n";

    let hiddenInfoDiv = document.createElement("div");
    hiddenInfoDiv.classList.add("hidden");
    hiddenInfoDiv.appendChild(videoLikesHTML);
    hiddenInfoDiv.appendChild(videoDislikesHTML);
    hiddenInfoDiv.appendChild(videoIdHTML);

    cardDiv.appendChild(hiddenInfoDiv);

    counter++;
  }

  displayChannelImgs(channelIds, displayChannelImgsOnDocument);
  addCardClickListeners();
};

// adding click event listeners to video cards
let addCardClickListeners = () => {
  let cardDivs = document.getElementsByClassName("card");
  let hiddenDivs = document.getElementsByClassName("hidden");

  // click event listeners for cards
  for (let i = 0; i < cardDivs.length; i++) {
    let card = cardDivs.item(i);
    let hiddenDiv = hiddenDivs.item(i);

    card.addEventListener("click", () => {
      let cardDivText = card.innerText;

      let hiddenDivText = hiddenDiv.innerText;

      // save needed video info in session since on new page load all previous JS gets deleted
      sessionStorage.setItem("cardInfo", cardDivText);
      sessionStorage.setItem("hiddenInfo", hiddenDivText);

      window.location.href = "video.html";
    });
  }
};
