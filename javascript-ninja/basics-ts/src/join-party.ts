type Gamer = {
  id: number
  shardId: number
}

type JoinParty = {
  leader: Gamer
  player: Gamer
}

const gamer: Gamer = {
  id: 1,
  // На каком вы сервере
  shardId: 1,
}

export function joinParty({ leader, player }: JoinParty) {
  // Перемещния player в тот же shard, где и leader
  player.shardId = leader.shardId

  // Случайно перепутали
  // leader.shardId = player.shardId
}
