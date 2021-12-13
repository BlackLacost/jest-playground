const { checkUser, checkUserCb, checkUserAlert } = require('./check-user')

describe('Check User', () => {
  // Arrange
  beforeAll(() => {
    window.alert = jest.fn()
  })

  beforeEach(() => {
    expect.hasAssertions()
  })

  afterEach(() => {
    // Or clearMocks: false in jest.config
    window.alert.mockReset()
  })

  // it('check user', () => {
  //   // Act
  //   checkUser({ age: 20 })
  // })

  it('check user callback', () => {
    checkUserCb({ age: 2 }, (age) => {
      expect(age).toBe(2)
    })
  })

  it('alert when user is under 18', () => {
    // Act
    checkUserAlert({ age: 2 })

    expect(window.alert).toHaveBeenCalled()
  })

  it('does not alert when user is above 18', () => {
    // Act
    checkUserAlert({ age: 20 })

    expect(window.alert).not.toHaveBeenCalled()
  })
})
