const axios = require('axios')
const { torInterceptor } = require('../src')

const socksPorts = [9050, 9052, 9054]

const url = 'https://api.ipify.org/'
torInterceptor(axios, socksPorts)

async function originalIp() {
  const response = await axios.get(url)
  console.info('Original IP: ', response.data)
}

async function torIp() {
  try {
    const response = await axios.get(url, { headers: { tor: 'true' } })
    console.info('Tor IP: ', response.data)
  } catch (err) {
    if (err instanceof Error) {
      console.info(err.message)
    }
  }
}

async function main() {
  await originalIp()
  await torIp()
  await torIp()
  await torIp()
  await torIp()
}

main()
