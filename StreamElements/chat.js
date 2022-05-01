
// Setting the default value of the maximum variable to 250.
let cap = 250;
let ban = "";
let cmd = true;
let sts = false;
let clr = "#fff";

window.addEventListener("onWidgetLoad", function (obj) {
  const fieldData = obj.detail.fieldData;
  cap = fieldData.CharLimit;
  ban = fieldData.HiddenAccounts;
  cmd = fieldData.HideCommands;
  sts = fieldData.StaticColor;
  clr = fieldData.FontColor;
});

window.addEventListener("onEventReceived", function (obj) {
  // If the event is not a chat message, return.
  if (obj?.detail?.listener?.toUpperCase() !== "MESSAGE") return;

  // Get ID, message, user color, username, and emotes from the event.
  const mid = obj.detail.event.data.msgId;
  const bod = obj.detail.event.data.text;
  const col = obj.detail.event.data.displayColor;
  const usr = obj.detail.event.data.displayName;
  const emo = obj.detail.event.data.emotes;

  // seperate unallowed users by comma
  let banList = ban.split(", ");
  console.log(banList);
  // If the user exists in the list of unallowed users, return.
  if (banList.includes(usr)) return;

  // If message starts with a command prefix, return.
  if (cmd && bod.startsWith("!")) return;

  // grab the chat element
  const container = document.getElementById("main-container");

  // create the message element
  div = document.createElement("div");
  div.className = "message";
  div.setAttribute("data-id", mid);
  div.innerHTML = attachEmote(bod, emo);
  container.append(div);
  const el = document.querySelector(`[data-id="${mid}"]`);

  if (bod.length > cap) {el.remove();}

  // Speed calculation
  let speed = 25 - ((bod.length - 10) / 290) * 10 + "s";

  // Apply animation
  el.style.animation = `LRMove ${speed} linear, RLMove ${speed} linear ${speed} forwards`;
  el.style.width = window.innerWidth;
  el.style.bottom = `${Math.floor(Math.random() * window.innerHeight)}px`;

  // Apply static color if enabled, otherwise apply user chat color
  (sts) ? el.style.color = clr : el.style.color = col;
  
});

/**
 * Takes a message and an array of emotes, and replaces the emote strings with the images of
 * the emotes.
 * @param message - The message that you want to attach the emote to.
 * @param emotes - An array of emotes.
 * @returns The html with the message and emotes attached.
 */
function attachEmote(message, emotes) {
  message = escapeHtml(message);
  for (let emote of emotes) {
      message = message.replace(emote["name"], `<img class="emote" src="${emote["urls"]["4"]}" />`);
  }
  return message;
}

/**
 * Replaces the characters &, <, >, ", and ' with their HTML entity equivalents to prevent XSS attacks.
 * @param unsafe - The string to be escaped.
 * @returns the string with the HTML characters escaped.
 */
 function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// 