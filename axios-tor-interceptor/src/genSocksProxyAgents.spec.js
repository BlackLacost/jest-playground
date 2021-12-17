'use strict'

const { genSocksProxyAgents } = require('./genSocksProxyAgents')

describe('genSocksProxyAgents', () => {
  it.each`
    port | expected
    ${1} | ${1}
    ${2} | ${2}
  `(
    'expected socks port = $expected when port: $port',
    ({ port, expected }) => {
      const socksProxyAgents = genSocksProxyAgents([port])
      const socksProxyAgent = socksProxyAgents.next().value

      // @ts-ignore
      const result = socksProxyAgent.proxy.port

      expect(result).toBe(expected)
    },
  )

  it('SocksProxyAgents generated in a circle', () => {
    const ports = [1, 2]
    const socksProxyAgents = genSocksProxyAgents(ports)

    const socksProxyAgent1 = socksProxyAgents.next().value
    const socksProxyAgent2 = socksProxyAgents.next().value
    const socksProxyAgent3 = socksProxyAgents.next().value
    const result = [
      socksProxyAgent1.proxy.port,
      socksProxyAgent2.proxy.port,
      socksProxyAgent3.proxy.port,
    ]

    expect(result).toEqual([1, 2, 1])
  })
})
