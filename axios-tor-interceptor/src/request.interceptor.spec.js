'use strict'

const { genSocksProxyAgents } = require('./genSocksProxyAgents')
const { requestInterceptor } = require('./request.interceptor')

describe('request interceptor', () => {
  let interceptor

  beforeEach(() => {
    const socksPorts = genSocksProxyAgents([9050, 9052])
    interceptor = requestInterceptor(socksPorts)
  })

  it('each request uses the specified ports in an infinite sequential loop', async () => {
    // Каждый запрос использует указанные порты в бесконечном последовательном цикле
    const EXPECTED_PORTS = [9050, 9052, 9050]
    EXPECTED_PORTS.forEach((expected_port) => {
      const config = interceptor({ headers: { tor: 'true' } })

      expect(config.httpsAgent.proxy.port).toBe(expected_port)
    })
  })

  it('if not header tor=true httpsAgent is undefined', async () => {
    const config = interceptor({ headers: { some: 'headers' } })

    expect(config.httpsAgent).toBeUndefined()
  })
})
