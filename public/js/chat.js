const socket=io()
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = document.querySelector("input")
const $messageFormButton = document.querySelector("button")
const $sendLocation = document.querySelector("#sendLocation")
const messageTemplate = document.querySelector("#message-template").innerHTML;
const $messageLocationTemplate = document.querySelector("#location-template").innerHTML;
const $messages = document.querySelector("#messages")
const $locationMessage = document.querySelector("#locationMessages");
const {username,room} = Qs.parse(location.search,{ignoreQueryPrefix:true})
const $sildebarTemplate = document.querySelector("#sidebar-template").innerHTML;

const autoScroll =()=>{
    // New Message element
    const $newMessage = $messages.lastElementChild;

    // Height of the new Message
    const newMessageSytle = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageSytle.margin)
    const newMessageHeigth = $newMessage.offsetHeight + newMessageMargin;

    // visible height
    const visibleHeight = $messages.offsetHeight;

    // Height of message container
    const contrainerHeright = $messages.scrollHeight;

    // How far have I Scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight;
    if(contrainerHeright - newMessageHeigth <= scrollOffset)
    {
        $messages.scrollTop = $messages.scrollHeight;
    }

}

socket.on('message',(message)=>{
    console.log(message)
    const html = Mustache.render(messageTemplate,{
        "username":message.username,
        "message":message.message,
        "createdAt":moment(message.createdAt).format("h:mm A")
    })
    $messages.insertAdjacentHTML("beforeend",html)
})

$messageForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    $messageFormButton.setAttribute('disabled','disabled')
    const message = e.target.elements.message.value;
    socket.emit('sendMessage',message,()=>{
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value=''
        $messageFormInput.focus()
        console.log("Message Delevred!")
    })
    autoScroll()
})
socket.on('locationMessage',(url)=>{
    const html = Mustache.render($messageLocationTemplate,{
        url,
        "createdAt":moment(new Date().getTime()).format("h:mm A")

    })
    $messages.insertAdjacentHTML("beforeend",html)
    console.log(url)
    autoScroll()
})
$sendLocation.addEventListener("click",()=>{
    if(!navigator.geolocation)
    {
        return alert("Geolocation not supported in your system")
    }
    navigator.geolocation.getCurrentPosition((position)=>{
        $sendLocation.setAttribute('disabled','disabled')
        console.log(position)
        socket.emit('sendLocation',{"latitude":position.coords.latitude,"longitude":position.coords.longitude},()=>{
            $sendLocation.removeAttribute('disabled');
        })
    })
})

socket.on('roomData',({room,users})=>{
    const html = Mustache.render($sildebarTemplate,{
        room,users
    })
    document.querySelector(".sidebar").innerHTML=html
})
socket.emit('join',{username,room},(error)=>{
    if(error)
    alert(error)
})