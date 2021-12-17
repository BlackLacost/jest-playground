'use strict'

const { responseInterceptor } = require('./response.interseptor')

describe('response interceptor', () => {
  it('delete httpsAgent', async () => {
    const response = responseInterceptor({ config: { httpsAgent: 'dummy' } })

    expect(response.config).toEqual({})
  })

  it('delete tor=true', async () => {
    const response = responseInterceptor({
      config: { headers: { tor: 'true' } },
    })

    expect(response.config).toEqual({ headers: {} })
  })
})
