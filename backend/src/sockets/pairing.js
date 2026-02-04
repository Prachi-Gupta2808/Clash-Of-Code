const { lobbies, leaveLobby } = require("./lobby");
const { v4 } = require('uuid') ;

const runBatchForMode = (mode, io) => {
  const lobby = lobbies[mode];

  // atleast two players required for pairing
  if (lobby?.length < 2) return;

  console.log(`Running Batch for [${mode}]`);
  // freeze i.e. take a snapshot of the current lobby (in js playersays are passed by reference so to create a deep copy we used this method)
  const players = structuredClone(lobby);
  //   const players = [
  //     {
  //       userId: "user1",
  //       socketId: "su1",
  //       rating: 1300,
  //     },
  //     {
  //       userId: "user2",
  //       socketId: "su2",
  //       rating: 1420,
  //     },
  //     {
  //       userId: "user3",
  //       socketId: "su3",
  //       rating: 1180,
  //     },
  //     {
  //       userId: "user4",
  //       socketId: "su4",
  //       rating: 1505,
  //     },
  //     {
  //       userId: "user5",
  //       socketId: "su5",
  //       rating: 1350,
  //     },
  //     {
  //       userId: "user6",
  //       socketId: "su6",
  //       rating: 1600,
  //     },
  //   ];

  //   players.sort((player1 , player2) => {
  //     player1.rating < player2.rating ;
  //   });
  let n = players?.length;
  let l = 0;
  let r = n - 1;

  while (l < r) {
    let player1 = players[l];
    let player2 = players[l + 1];
    l += 2;
    let roomId1 = v4() ;

    leaveLobby(player1.userId, mode);
    leaveLobby(player2.userId, mode);
    
    
    // notify both the players
    io.to(player1.socketId).emit("PAIRED", {
        opponent: player2.userId,
        roomId: roomId1, 
        mode,
    });
    
    io.to(player2.socketId).emit("PAIRED", {
        opponent: player1.userId,
        roomId: roomId1,
        mode,
    });
    console.log(`🤝[${mode}] ${player1.userId} vs ${player2.userId}`);
    
    if (r > l) {
        let player3 = players[r];
        let player4 = players[r - 1];
        r -= 2;
        let roomId2 = v4() ;
        
        io.to(player3.socketId).emit("PAIRED", {
            opponent: player4.userId,
            roomId: roomId2,
            mode,
        });
        
        io.to(player4.socketId).emit("PAIRED", {
            opponent: player3.userId,
            roomId: roomId2,
            mode,
        });
        
      leaveLobby(player3.userId, mode);
      leaveLobby(player4.userId, mode);

      console.log(`🤝[${mode}] ${player3.userId} vs ${player4.userId}`);
    }
  }
};

module.exports = { runBatchForMode };
