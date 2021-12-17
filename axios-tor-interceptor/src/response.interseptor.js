'use strict'

module.exports = {
  responseInterceptor(response) {
    if (response.config.httpsAgent) {
      delete response.config.httpsAgent
    }

    if (response.config.headers?.tor) {
      delete response.config.headers.tor
    }
    return response
  },
}
