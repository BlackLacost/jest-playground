'use strict'

module.exports = {
  requestInterceptor: (proxyAgents) => (request) => {
    if (request?.headers?.tor) {
      request.httpsAgent = proxyAgents.next().value
    }
    return request
  },
}
