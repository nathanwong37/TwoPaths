/* Author: Nathan Wong
 * Using Cloudflare api and wrangler to be able to access url's and alter data
 */

 //Variables
var urls = [];
const address = "https://cfw-takehome.developers.workers.dev/api/variants";
count1 = 0;
count2 = 0;
var cookieSite;

//Element Handler class to alter HTML
class ElementHandler {
  constructor(content) {
    this.content = content;
  }
  element(element) {
    if (element.hasAttribute("href")) {
      element.setAttribute(
        "href",
        "https://www.linkedin.com/in/nathan-wong-6b631517a/"
      );
      element.setAttribute("target", "_blank");
      element.setAttribute("style", "text-align:center");
    }
    element.setInnerContent(this.content);
  }
}

//HTML altered
const reWrite = new HTMLRewriter()
  .on(
    "a#url",
    new ElementHandler("https://www.linkedin.com/in/nathan-wong-6b631517a/")
  )
  .on("title", new ElementHandler("Not Sure How To change this"))
  .on("h1#title", new ElementHandler("Nathan Wong"))
  .on(
    "p#description",
    new ElementHandler(
      "Below you can see my Linkedin Profile, feel free to connect with me!"
    )
  );


addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

/**
 * Respond with fetch to certain website variants
 * @param {Request} request
 */
async function handleRequest(request) {
  //we have not stored cookie yet
  if (typeof cookieSite === "undefined") {
    res = await callWeb(address);
    urls = res.variants;
    aRand = randNum();
    site = await fetch(urls[aRand]);
    cookieSite = new Response(site.body, site);
    //store cookie
    cookieSite.headers.set("Cookie", urls[aRand]);
    return reWrite.transform(cookieSite);
  }
  //We stored the cookie 
  else {
    site = await fetch(cookieSite.headers.get("Cookie"));
    return reWrite.transform(site);
  }
}

//Generates a random number between 0 and 1
function randNum() {
  if (count1 == count2) {
    rand = Math.random() * 100;
    rand = Math.ceil(rand);
    rand = rand % 2;
    if (rand == 1) {
      count2++;
    } else {
      count1++;
    }
    return rand;
  } else if (count1 > count2) {
    count2++;
    return 1;
  } else {
    count1++;
    return 0;
  }
}

//uses fetch and GET on a Url
async function callWeb(url) {
  let response;
  try {
    response = await fetch(url, {
      method: "GET",
    });
  } catch (err) {
    return new Response("Fetch Error: " + response.status);
  }
  responseString = await response.text();
  try {
    result = JSON.parse(responseString);
    return result;
  } catch (err) {
    result = responseString;
    return result;
  }
}
