const { joinParty } = require('./join-party')

describe('Player management', () => {
  describe('joinParty', () => {
    it('Should move player to leader shard (wrong)', () => {
      const leader = { id: 1, shardId: 1 }
      const player = { id: 2, shardId: 2 }

      joinParty({ leader, player })

      expect(player.shardId).toBe(leader.shardId)
    })

    it('Should move player to leader shard (good)', () => {
      const LEADER_SHARD_ID = 1

      const leader = { id: 1, shardId: LEADER_SHARD_ID }
      const player = { id: 2, shardId: 2 }

      joinParty({ leader, player })

      expect(player.shardId).toBe(LEADER_SHARD_ID)
    })
  })
})
