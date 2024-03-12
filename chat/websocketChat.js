let socket = new ReconnectingWebSocket("ws://localhost:3069"); // Replace with your server's WebSocket URL
let connected = false;
let reconnectAttempts = 0;
let reconnectionFunction = null;

console.log(socket);

let my_user = {name: "User" + (Math.random() * 100).toPrecision(2)};

socket.addEventListener("open", (event) => {
  console.log("WebSocket connection opened:", event);
  connected = true;
  setStatus("Connected");
});

socket.addEventListener("message", (event) => {
  let message = JSON.parse(event.data);
  if (message.type == "incoming") {
    addMessage(message);
  }else if (message.type == "name-change") {
    alert("change your name");
  }else if (message.type == "auth") {
    my_user["uuid"] = message.token;
  }

});
socket.addEventListener("close", (event) => {
  connected = false;
  setStatus("Disconnected");
});
function sendMessage() {
  const messageInput = document.getElementById("messageInput");
  const messageText = messageInput.value;

  if (messageText.trim() !== "") {
    socket.send(
      JSON.stringify({ user: my_user, type: "message", message: messageText })
    );
    messageInput.value = "";
  }
}
let addMessage = function (message) {
  let chat = document.getElementById("chat");
  let atBottom = chat.scrollTop + chat.clientHeight >= chat.scrollHeight - 1;
  let container = document.createElement("div");
  container.classList.add("message");
  let time = document.createElement("span");
  time.classList.add("timestamp");
  time.innerHTML = new Date(message.time).to;

  let name = document.createElement("span");
  name.classList.add("name");
  if (message.user.uuid == my_user.uuid) {
    name.classList.add("my-name");
  } else {
    name.classList.add("other-name");
  }
  name.innerHTML = message.user.name + ": ";
  container.appendChild(name);

  let chatText = document.createElement("span");
  chatText.innerHTML = message.message;
  chatText.classList.add("message-text");
  container.appendChild(chatText);

  let row = document.createElement("tr");
  row.classList.add("message-row");

  row.appendChild(container);
  document.getElementById("chat-stream").appendChild(row);
  if (atBottom){
    chat.scrollTop = chat.scrollHeight - chat.clientHeight;
		//console.log("scroll, " + (chat.scrollTop + chat.clientHeight >= chat.scrollHeight - 1));
	}
    
};
let setStatus = function (newStatus) {
  statusIndicator = document.getElementById("status");
  statusIndicator.innerText = newStatus;
};

let example_message_send = { user: my_user, type: "message", message: "" };
let incoming_example = {
  user: my_user,
  type: "incoming",
  time: 17098789876,
  message: "test",
};

window.addEventListener("load", (event) => {
  document.getElementById("messageInput").addEventListener("keydown", (e) => {
    if (e.code == "Enter") {
      sendMessage();
    }
  });
});
