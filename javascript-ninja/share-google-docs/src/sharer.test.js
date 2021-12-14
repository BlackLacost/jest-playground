const creds = require('./creds')
const { google } = require('googleapis')
const { shareDocumentWithStudents } = require('./sharer')

// Тут нельзя использовать стрелочную функцию для mockedLiqPay
// так как LiqPay вызывается через new
jest.mock('./liqpay', () =>
  jest.fn().mockImplementation(function mockedLiqPay() {
    this.api = jest.fn().mockImplementation((_, __, ok, ___) => {
      ok({ data: [] })
    })
  }),
)

// Запросить список эмелов с гугла
// Запросить список эмейлов от платежной системы
// Найти разницу
// Пошарить разницу

const fileId = '1mYSCEbMX3Mb2zOIPIE7mpWqi4Ytv2HcdSuVcOlib5Hs'

describe('Studen sharer', () => {
  // beforeEach(() => {
  //   expect.hasAssertions()
  // })

  describe('google auth', () => {
    it('authorizes on google with JWT', async () => {
      // Нужно как-то понять что jwtClient.authorize был вызван

      google.drive = jest.fn().mockImplementation(() => ({
        permissions: {
          list: jest.fn().mockImplementation(() => ({
            data: {
              permissions: [],
            },
          })),
        },
      }))

      // spyOn не сработал, так как используется new
      // jest.spyOn(google.auth, 'JWT')

      // const OriginalJWT = google.auth.JWT
      // google.auth.JWT = jest.fn().mockImplementation((...args) => {
      //   const instance = new OriginalJWT(...args)
      //   jest.spyOn(instance, 'authorize')
      //   console.log(instance.authorize.mock)
      //   return instance
      // })
      // google.auth.JWT = jest.fn().mockImplementation(function (...args) {
      //   const instance = new OriginalJWT(...args)
      //   jest.spyOn(instance, 'authorize')
      //   this.authorize = jest.fn()
      //   return instance
      // })
      google.auth.JWT = jest.fn().mockImplementation(function () {
        // Так лучше
        this.authorize = jest.fn().mockResolvedValue(null)
        // Но javascript съест и это
        // this.authorize = jest.fn()
        this.credentials = { access_token: 'FAKE_ACCESS_TOKEN' }
      })

      // Грязный хак, по хорошему нужно либо разделять логику
      // на части либо замокать все остальное, чтобы
      // скрипт мог выполниться.
      // try {
      //   await shareDocumentWithStudents(fileId)
      // } catch {}
      await shareDocumentWithStudents(fileId)

      const [jwtInstance] = google.auth.JWT.mock.instances
      // Появится какой-то mockConstructor, из-за того что мы
      // делая new OriginalJWT использовали стрелочную функцию
      // console.log(jwtInstance)
      // console.log('here', jwtInstance.authorize.mock.calls)
      expect(jwtInstance.authorize).toHaveBeenCalled()
    })
  })

  it('shareDocumentWithStudents is a function', () => {
    // expect(typeof shareDocumentWithStudents).toBe('function')
    expect(shareDocumentWithStudents).toBeInstanceOf(Function)
  })
})
