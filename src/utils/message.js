const generateMessage = (text,username)=>{
    return {
        username,
        "message":text,
        "createdAt":new Date().getTime()
    }
}

const generateLocationMessage = (text,username)=>{
    return {
        username,
        "url":text,
        "createdAt":new Date().getTime()
    }
}

module.exports = {
    generateMessage,
    generateLocationMessage
}