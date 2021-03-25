let key = "AIzaSyAj314hsQUuaB3n_Sebf_28uLfUpNr0boc";

fetch(
  "https://www.googleapis.com/youtube/v3/search?" +
    new URLSearchParams({
      key: key,
      part: "snippet",
      maxResults: 20,
      q: "react Code",
    }).toString()
)
  .then((data) => data.json())
  .then((data) => console.log(data));

// fetch("https://www.googleapis.com/youtube/v3/search?", {
//   headers: {
//     "Content-Type": "application/json",
//   },
//   body: {
//     key: key,
//     part: "snippet",
//     maxResults: 20,
//     q: "react Code",
//   },
// }).then((data) => data.json().then((data) => console.log(data)));
/* {
  headers: {
    "Content-Type": "application/json",
    // 'Content-Type': 'application/x-www-form-urlencoded',
    "Access-Control-Allow-Credentials": "true",
  },
  mode: "no-cors",
  credentials: "include",
  key: key,
  part: "snippet",
  maxResults: 20,
  q: "react Code",
} */

// .then((data) => data.json())
// .then((data) => console.log(data));

// // Example POST method implementation:
// async function postData(url = "https://www.googleapis.com/youtube/v3/search") {
//   // Default options are marked with *
//   const response = await fetch(url, {
//     part: "snippet",
//     maxResults: 20,
//     key: key,
//     q: "react Code", // body data type must match "Content-Type" header
//   });
//   return response.json(); // parses JSON response into native JavaScript objects
// }

// postData("https://www.googleapis.com/youtube/v3/search").then((data) => {
//   console.log(data); // JSON data parsed by `data.json()` call
// });
