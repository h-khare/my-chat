const users = []

const addUser = ({id,username,room}) =>{
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    if(!username || !room)
    {
        return {
            "error":"Username or Room cannot be empty..!"
        }
    }

    const existingUser = users.find(user => user.username === username && user.room === room);
    
    if(existingUser)
    {
        return {
            "error":"User already exists...!"
        }
    }

    const user ={
        id,username,room
    }
    users.push(user);
    return {user};
}

const removeUser = (id) => {
    const index = users.findIndex(user => user.id === id);
    if(index!==-1) {
    const user = users.splice(index,1)[0];
    return user;
    }
    return {'error':'User not found..!'};
}

const getUser = (id) => {
    const user = users.find( user => user.id===id);
    if(!user) return {error : "User not found..!"};
    return user;
}

const getUsersInRoom = (room) =>{
    const roomUsers = users.filter( user => user.room === room);
    return roomUsers;
}


module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}