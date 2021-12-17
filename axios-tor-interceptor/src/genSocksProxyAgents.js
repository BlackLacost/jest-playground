'use strict'

const { SocksProxyAgent } = require('socks-proxy-agent')

function* genSocksProxyAgents(ports) {
  const socksProxyAgents = ports.map((port) => {
    return new SocksProxyAgent(`socks5://localhost:${port}`)
  })

  while (true) {
    for (const socksProxyAgent of socksProxyAgents) {
      yield socksProxyAgent
    }
  }
}

module.exports = { genSocksProxyAgents }
