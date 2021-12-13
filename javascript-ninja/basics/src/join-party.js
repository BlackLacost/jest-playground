const gamer = {
  id: 1,
  // На каком вы сервере
  shardId: 1,
}

module.exports = {
  joinParty({ leader, player }) {
    // Перемещния player в тот же shard, где и leader
    player.shardId = leader.shardId

    // Случайно перепутали
    // leader.shardId = player.shardId
  },
}
