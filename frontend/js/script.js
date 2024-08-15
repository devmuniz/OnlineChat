// login elements
const login = document.querySelector(".login")
const loginForm = login.querySelector(".login__form")
const loginInput = login.querySelector(".login__input")

// chat elements
const chat = document.querySelector(".chat")
const chatForm = chat.querySelector(".chat__form")
const chatInput = chat.querySelector(".chat__input")
const chatMessages = chat.querySelector(".chat__messages")

const colors = [
    "cadetblue",
    "darkgoldenrod",
    "cornflowerblue",
    "darkkhaki",
    "hotpink",
    "gold"
]

const user = { id: "", name: "", color: "" }

let websocket

const createMessageSelfElement = (content) => {
    const div = document.createElement("div")
    const body = document.getElementsByTagName("body")[0]
    const backgroundBody = body.style.background

    if (backgroundBody.includes("catBg.jpg") || backgroundBody.includes("pinkBg.jpg")) {
        div.classList.add("message--selfDark") 
    } else {
        div.classList.add("message--self") 
    }

    div.innerHTML = content
    return div
}

const createMessageOtherElement = (content, sender, senderColor) => {
    const div = document.createElement("div")
    const span = document.createElement("span")
    div.classList.add("message--other")
    span.classList.add("message--sender")
    span.style.color = senderColor
    span.innerHTML = sender
    div.appendChild(span)
    div.innerHTML += content
    return div
}

const createNotificationElement = (content) => {
    const body = document.getElementsByTagName("body")[0]
    const backgroundBody = body.style.background

    const div = document.createElement("div")
    div.classList.add("message--notification")

    
    if (backgroundBody.includes("catBg.jpg") || backgroundBody.includes("pinkBg.jpg")) {
        div.style.color = "#000000"
        div.style.fontWeight = "bold"
    } else {
        div.style.color = "#FFFFFF"  
    }

    div.innerHTML = content
    return div
}


const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length)
    return colors[randomIndex]
}

const scrollScreen = () => {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
    })
}

const processMessage = ({ data }) => {
    const { type, userId, userName, userColor, content } = JSON.parse(data)
    let message

    if (type === "notification") {
        message = createNotificationElement(content)
    } else if (userId === user.id) {
        message = createMessageSelfElement(content)
    } else {
        message = createMessageOtherElement(content, userName, userColor)
    }

    chatMessages.appendChild(message)
    scrollScreen()
}

const optionBg = (option) => {
    let body = document.getElementsByTagName("body")[0];
    const notifications = document.querySelectorAll(".message--notification"); // Seleciona todas as notificações existentes
    const boxEdit = document.querySelector(".edit_background");
    const editBtn = document.querySelector(".edit_button");
    const self = document.querySelector(".message--self");
    const selfDark = document.querySelector(".message--selfDark");

    let notificationColor, selfBgColor, selfTextColor;

    if (option === "op1") {
        body.style.background = 'url("../images/background.png")';
        notificationColor = "white";
        selfBgColor = "#f2f2f2";
        selfTextColor = "#000000";
        editBtn.style.color = "white";
    } 
    else if (option === "op2") {
        body.style.background = 'url("../images/pinkBg.jpg")';
        notificationColor = "black";
        selfBgColor = "#121212";
        selfTextColor = "#f2f2f2";
        editBtn.style.color = "black";
    } 
    else if (option === "op3") {
        body.style.background = 'url("../images/catBg.jpg")';
        notificationColor = "black";
        selfBgColor = "#121212";
        selfTextColor = "#f2f2f2";
        editBtn.style.color = "black";
    }

    notifications.forEach(notification => {
        notification.style.color = notificationColor;
        notification.style.fontWeight = "bold";
    });

    if (self) {
        self.style.backgroundColor = selfBgColor;
        self.style.color = selfTextColor;
    }
    if (selfDark) {
        selfDark.style.backgroundColor = selfBgColor;
        selfDark.style.color = selfTextColor;
    }

    boxEdit.style.display = "none";
    editBtn.style.fontWeight = "bold";
};



const handleLogin = (event) => {
    event.preventDefault()

    user.id = crypto.randomUUID() //Cria uma crypto random unica
    user.name = loginInput.value
    user.color = getRandomColor()

    login.style.display = "none"
    chat.style.display = "flex"

    websocket = new WebSocket("wss://onlinechat-backend.glitch.me")
    websocket.onmessage = processMessage

    websocket.onopen = () => {
        const notification = {
            type: "notification",
            content: `- ${user.name} entrou no chat! - `
        }
        websocket.send(JSON.stringify(notification))
    }
}

const sendMessage = (event) => {
    event.preventDefault()

    const message = {
        type: "message",
        userId: user.id,
        userName: user.name,
        userColor: user.color,
        content: chatInput.value
    }

    websocket.send(JSON.stringify(message))
    chatInput.value = ""
}

const editButton = () => {
    const boxEdit = document.querySelector(".edit_background")
    if (boxEdit.classList.contains("show")) {
      boxEdit.classList.remove("show")
      setTimeout(() => {
        boxEdit.style.display = "none"
      }, 300); 
    } else {
      boxEdit.style.display = "flex"
      setTimeout(() => {
        boxEdit.classList.add("show")
      }, 10); 
    }
  };





loginForm.addEventListener("submit", handleLogin)
chatForm.addEventListener("submit", sendMessage)
