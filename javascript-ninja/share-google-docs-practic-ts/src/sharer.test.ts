const { shareDocumentWithStudents } = require('./sharer.js')

const mockLiqpayApi = jest.fn().mockImplementation((_, __, resolve) => {
  resolve({ data: [] })
})

jest.mock('./liqpay.js', () =>
  jest.fn().mockImplementation(function () {
    this.api = mockLiqpayApi
  }),
)

const mockGoogleDrivePermissionsList = jest
  .fn()
  .mockResolvedValue({ data: { permissions: [] } })

const mockGoogleDrivePermissionsCreate = jest.fn()

jest.mock('googleapis', () => ({
  google: {
    auth: {
      JWT: jest.fn().mockImplementation(function () {
        this.authorize = jest.fn().mockResolvedValue(null)
        this.credentials = { access_token: '' }
      }),
    },
    // Если не отслеживаем аргументы, то можно сократить
    // с помощью mockReturnValue
    // drive: jest.fn().mockImplementation(() => ({
    //   permissions: {
    //     list: jest.fn(),
    //   },
    // })),
    // Когда создаем mockGoogleDrivePermissionsList мы должны
    // быть уверены, что вызываться она будет лениво, а с
    // mockReturnValue это не так. Так что тут надо вернуться к
    // mockImpolementation
    // drive: jest.fn().mockReturnValue({
    //   permissions: {
    //     list: mockGoogleDrivePermissionsList,
    //     create: jest.fn(),
    //   },
    // }),
    drive: jest.fn().mockImplementation(() => ({
      permissions: {
        list: mockGoogleDrivePermissionsList,
        create: mockGoogleDrivePermissionsCreate,
      },
    })),
  },
}))

describe('Sharer', () => {
  const FAKE_FILE_ID = 'FAKE_FILE_ID'
  const EXPECTED_DESCRIPTION = 'Мастер-класс по Unit-тестированию JS'

  it('works', async () => {})

  // если оплатил но нету в списке -> добавить
  // если оплатил но есть в списке -> ничего не делать
  // если не оплатил и есть в списке -> ничего не делать
  // если не оплатил и нету в списке -> ничего не делать

  describe('when person paid but is not in enrolled list', () => {
    const EMAIL = 'some@email'

    beforeEach(() => {
      mockLiqpayApi.mockImplementation((_, __, resolve) =>
        resolve({
          data: [
            {
              description: EXPECTED_DESCRIPTION,
              order_id: `${EMAIL} /// Something`,
              status: 'success',
            },
          ],
        }),
      )

      mockGoogleDrivePermissionsList.mockResolvedValue({
        data: { permissions: [{ emailAddress: 'some_other@email' }] },
      })
    })

    it('requests commenter access from goole drive', async () => {
      await shareDocumentWithStudents(FAKE_FILE_ID)

      expect(mockGoogleDrivePermissionsCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          fileId: FAKE_FILE_ID,
          emailAddress: EMAIL,
          resource: expect.objectContaining({
            emailAddress: EMAIL,
            type: 'user',
            role: 'commenter',
          }),
        }),
      )
    })

    it('writes to console.log on success sharing', async () => {
      const consoleLogSpy = jest.spyOn(console, 'log')

      await shareDocumentWithStudents(FAKE_FILE_ID)

      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining(EMAIL))
    })

    it('throws an error if sharing fails', async () => {
      mockGoogleDrivePermissionsCreate.mockRejectedValue(
        new Error('Unknow error'),
      )

      expect(shareDocumentWithStudents(FAKE_FILE_ID)).rejects.toBeInstanceOf(
        Error,
      )
    })

    it('does not reports email if sharing fails', async () => {
      const consoleLogSpy = jest.spyOn(console, 'log')
      mockGoogleDrivePermissionsCreate.mockRejectedValue(
        new Error('Unknow error'),
      )

      await shareDocumentWithStudents(FAKE_FILE_ID).catch(() => {})

      expect(consoleLogSpy).not.toHaveBeenCalledWith(
        expect.stringContaining(EMAIL),
      )
    })
  })

  describe('when person paid and is in enrolled list', () => {
    const EMAIL = 'some@email'

    beforeEach(() => {
      mockLiqpayApi.mockImplementation((_, __, resolve) =>
        resolve({
          data: [
            {
              description: EXPECTED_DESCRIPTION,
              order_id: `${EMAIL} /// Something`,
              status: 'success',
            },
          ],
        }),
      )

      mockGoogleDrivePermissionsList.mockResolvedValue({
        data: { permissions: [{ emailAddress: EMAIL }] },
      })
    })

    it('does not attempts to share with this email', async () => {
      await shareDocumentWithStudents(FAKE_FILE_ID)
    })

    it('does not reports email if sharing fails', async () => {
      const consoleLogSpy = jest.spyOn(console, 'log')
      mockGoogleDrivePermissionsCreate.mockRejectedValue(
        new Error('Unknow error'),
      )

      await shareDocumentWithStudents(FAKE_FILE_ID).catch(() => {})

      expect(mockGoogleDrivePermissionsCreate).not.toHaveBeenCalledWith(
        expect.objectContaining({ emailAddress: EMAIL }),
      )
    })
  })
})
