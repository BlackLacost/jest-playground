const creds = require('./creds')
const LiqPay = require('./liqpay')
const { google } = require('googleapis')
const { shareDocumentWithStudents } = require('./sharer')

// console.log(LiqPay)

// Тут нельзя использовать стрелочную функцию для mockedLiqPay
// так как LiqPay вызывается через new
// jest.mock('./liqpay', () =>
//   jest.fn().mockImplementation(function mockedLiqPay() {
//     this.api = jest.fn().mockImplementation((_, __, ok, ___) => {
//       ok({ data: [] })
//     })
//   }),
// )

// Так написать не получится, так как jest.mock всплывает в
// самы вверх где еще нет liqpayApiMock, но если почитать
// описание ошибки, то можно увидеть, что если мы хотим,
// чтобы переменная всплывала вместе с jest.mock, то нам нужно
// называть переменную, начиная с 'mock'
// const liqpayApiMock = jest.fn().mockImplementation((_, __, ok, ___) => {
//   ok({ data: [] })
// })
const mockLiqpayApi = jest.fn().mockImplementation((_, __, ok, ___) => {
  ok({ data: [] })
})
jest.mock('./liqpay', () =>
  jest.fn().mockImplementation(function () {
    this.api = mockLiqpayApi
  }),
)

// Запросить список эмелов с гугла
// Запросить список эмейлов от платежной системы
// Найти разницу
// Пошарить разницу

// Реальный id файла, чтобы появились проблемы реального
// вызова сайд эффектов
// const FAKE_FILE_ID = '1mYSCEbMX3Mb2zOIPIE7mpWqi4Ytv2HcdSuVcOlib5Hs'
const FAKE_FILE_ID = 'FAKE_ID'

describe('Studen sharer', () => {
  let listPermissionMock = jest
    .fn()
    .mockResolvedValue({ data: { permissions: [] } })

  let createPermissionMock = jest.fn()

  beforeAll(() => {
    expect.hasAssertions()
  })

  beforeEach(() => {
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
      this.authorize = jest.fn().mockResolvedValue(null)
      this.credentials = { access_token: 'FAKE_ACCESS_TOKEN' }
    })

    google.drive = jest.fn().mockImplementation(() => ({
      permissions: {
        // list: jest.fn().mockImplementation(() => ({
        //   data: {
        //     permissions: [],
        //   },
        // })),
        list: listPermissionMock,
        create: createPermissionMock,
      },
    }))
  })

  describe('google auth', () => {
    it('authorizes on google with JWT', async () => {
      // Нужно как-то понять что jwtClient.authorize был вызван
      // Так лучше
      let authorizeMock = jest.fn().mockResolvedValue(null)
      // Но javascript съест и это
      // let authorizeMock = jest.fn()
      google.auth.JWT = jest.fn().mockImplementation(function () {
        this.authorize = authorizeMock
        this.credentials = { access_token: 'FAKE_ACCESS_TOKEN' }
      })

      // Грязный хак, по хорошему нужно либо разделять логику
      // на части либо замокать все остальное, чтобы
      // скрипт мог выполниться.
      // try {
      //   await shareDocumentWithStudents(fileId)
      // } catch {}
      await shareDocumentWithStudents(FAKE_FILE_ID)

      // Появится какой-то mockConstructor, из-за того что мы
      // делая new OriginalJWT использовали стрелочную функцию
      // console.log(jwtInstance)
      // console.log('here', jwtInstance.authorize.mock.calls)
      expect(authorizeMock).toHaveBeenCalled()
    })
  })

  it('requests list of shared emails', async () => {
    const fakeDrive = {
      permissions: {
        list: jest.fn().mockImplementation(() => ({
          data: {
            permissions: [],
          },
        })),
      },
    }
    google.drive = jest.fn().mockImplementation(() => fakeDrive)

    await shareDocumentWithStudents(FAKE_FILE_ID)

    expect(fakeDrive.permissions.list).toHaveBeenCalled()
  })

  describe('liqpay api', () => {
    it('requests list of invoices from liqpay', async () => {
      await shareDocumentWithStudents(FAKE_FILE_ID)

      expect(mockLiqpayApi).toHaveBeenCalledWith(
        'request',
        expect.objectContaining({
          action: 'reports',
          version: 3,
        }),
        expect.any(Function),
        expect.any(Function),
      )
    })

    it('blows away when liqpay is unavailable', async () => {
      mockLiqpayApi.mockImplementation((_, __, ___, error) => {
        // console.log('here')
        error(new Error('blow away'))
      })

      // await expect(shareDocumentWithStudents(fileId)).rejects.toBeInstanceOf(
      //   Error,
      // )
      await expect(
        shareDocumentWithStudents(FAKE_FILE_ID),
      ).rejects.toThrowError('blow away')
    })
  })

  it('shares document with missing emails', async () => {
    const DRIVE_EMAILS = ['email2@demo.com']

    const NEW_EMAILS = ['email1@demo.com', 'email3@demo.com']

    listPermissionMock.mockResolvedValue({
      data: {
        permissions: DRIVE_EMAILS.map((emailAddress) => ({ emailAddress })),
      },
    })

    const LIQPAY_EMAILS = [...DRIVE_EMAILS, ...NEW_EMAILS]

    mockLiqpayApi.mockImplementation((_, __, ok) => {
      ok({
        result: 'success',
        data: LIQPAY_EMAILS.map((email) => ({
          description: 'Мастер-класс по Unit-тестированию JS',
          order_id: `${email} /// ${Date.now()}`,
          status: 'success',
        })),
      })
    })

    await shareDocumentWithStudents(FAKE_FILE_ID)

    NEW_EMAILS.forEach((emailAddress) => {
      expect(createPermissionMock).toHaveBeenCalledWith(
        expect.objectContaining({ emailAddress }),
      )
    })

    DRIVE_EMAILS.forEach((emailAddress) => {
      expect(createPermissionMock).not.toHaveBeenCalledWith(
        expect.objectContaining({ emailAddress }),
      )
    })
  })

  it('shareDocumentWithStudents is a function', () => {
    // expect(typeof shareDocumentWithStudents).toBe('function')
    expect(shareDocumentWithStudents).toBeInstanceOf(Function)
  })
})
