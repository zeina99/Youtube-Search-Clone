document.addEventListener("DOMContentLoaded", () => {
  let cardDivText = sessionStorage.getItem("cardInfo");
  let hiddenDivText = sessionStorage.getItem("hiddenInfo");
  addVideoPageDivs(cardDivText, hiddenDivText);
});

function addVideoPageDivs(cardText, hiddenText) {
  [title, viewsAndPublishDate, channelTitle, _, description] =
    cardText.split("\n");

  // 3279943 views      at: 2018-07-16
  [likes, dislikes, videoId, channelThumbnailUrl] = hiddenText.split("\n");

  [views, publishDate] = viewsAndPublishDate.split("Published");

  let iframeDiv = document.getElementsByClassName("iframe-video")[0];

  let iframeWrapper = document.createElement("div");
  iframeWrapper.classList.add("iframe-wrapper");

  let iframeELement = document.createElement("iframe");
  iframeELement.src = "https://www.youtube.com/embed/" + videoId;

  iframeWrapper.appendChild(iframeELement);
  iframeDiv.appendChild(iframeWrapper);

  iframeDiv.appendChild(document.createElement("br"));

  let videoTitleElement = document.createElement("h2");
  videoTitleElement.textContent = title;
  iframeDiv.appendChild(videoTitleElement);

  iframeDiv.appendChild(document.createElement("br"));

  let videoDetails = document.createElement("div");
  let videoDetails1 = document.createElement("div");
  let videoDetails2 = document.createElement("div");

  videoDetails.classList.add("video-details");
  videoDetails1.classList.add("video-details1");
  videoDetails2.classList.add("video-details2");

  // create video details 1 content
  let viewsElement = document.createElement("span");
  viewsElement.textContent = views;

  let dateElement = document.createElement("span");
  dateElement.textContent = " - " + publishDate.split(":")[1];

  // add videodetails1 content to videodetails1
  videoDetails1.appendChild(viewsElement);
  videoDetails1.appendChild(dateElement);

  // create videodetails 2 content
  let likeIcon = document.createElement("span");
  let likesELement = document.createElement("span");
  let dislikesIcon = document.createElement("span");
  let dislikesElement = document.createElement("span");

  likeIcon.classList.add("material-icons-outlined", "md-24");
  likeIcon.textContent = "thumb_up";

  dislikesIcon.classList.add("material-icons-outlined");
  dislikesIcon.textContent = "thumb_down_alt";

  likesELement.textContent = likes;

  dislikesElement.textContent = dislikes;
  // add content to videodetails2
  videoDetails2.appendChild(likeIcon);
  videoDetails2.appendChild(likesELement);
  videoDetails2.appendChild(dislikesIcon);
  videoDetails2.appendChild(dislikesElement);
  // add video details 1 and 2 to videodetails
  videoDetails.appendChild(videoDetails1);
  videoDetails.appendChild(videoDetails2);

  iframeDiv.appendChild(videoDetails);

  // channel details
  createChannelDetails(
    iframeDiv,
    channelTitle,
    description,
    channelThumbnailUrl
  );
}

// channel details on video page
function createChannelDetails(
  iframeDiv,
  channelTitle,
  description,
  channelThumbnailUrl
) {
  let channelDetailsDiv = document.createElement("div");
  channelDetailsDiv.classList.add("channel-details");
  iframeDiv.appendChild(channelDetailsDiv);

  let channelImgDiv = document.createElement("div");
  channelImgDiv.classList.add("channelImg");
  channelDetailsDiv.appendChild(channelImgDiv);

  let channelImg = document.createElement("img");
  channelImg.src = channelThumbnailUrl;
  // channelImg.classList.add("channelImg");
  channelImgDiv.appendChild(channelImg);

  let videoChannelInfoDiv = document.createElement("div");
  videoChannelInfoDiv.classList.add("video-channel-info");
  channelDetailsDiv.appendChild(videoChannelInfoDiv);

  let channelTitleElement = document.createElement("p");
  channelTitleElement.textContent = channelTitle;
  videoChannelInfoDiv.appendChild(channelTitleElement);

  let videoDescriptionElement = document.createElement("p");
  videoDescriptionElement.textContent = description;
  videoChannelInfoDiv.appendChild(videoDescriptionElement);

  // subscribe button
  let subscribeDiv = document.createElement("div");
  subscribeDiv.classList.add("subscribe");
  let subscribeButton = document.createElement("button");
  subscribeButton.textContent = "SUBSCRIBE";
  subscribeButton.id = "subscribe-button";

  subscribeDiv.appendChild(subscribeButton);

  channelDetailsDiv.appendChild(videoChannelInfoDiv);
  channelDetailsDiv.appendChild(subscribeDiv);
}
