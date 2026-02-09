const VALID_MODES = ["mcq", "predict", "contest"]

const lobbies = {
  mcq: [],
  predict: [],
  contest: []
}

const enterLobby = (userId , socket , mode , rating) => {
    // invalid mode identified
    if(!VALID_MODES.includes(mode)) {
        return ;
    }

    const lobby = lobbies[mode] ;

    // is user already in lobby?
    if(lobby.some(u => u.userId === userId)) {
        return ;
    }

    lobby.push({
        userId,
        socketId : socket.id,
        rating
    })
    
    console.log(`LOBBY [${mode}]:`, lobby.map(u => u.userId))
}

const leaveLobby = (userId , mode) => {
    if(!VALID_MODES.includes(mode)) {
        return ;
    }

    const lobby = lobbies[mode] ;
    const ind = lobby.findIndex(u => u.userId === userId) ;

    // user is not in the lobby
    if(ind == -1) {
        return ;
    }

    // remove user from that particular mode
    lobby.splice(ind , 1) ;
    console.log(`LEFT LOBBY [${mode}]:` , userId) ;
}

module.exports = { lobbies , enterLobby , leaveLobby } ;    