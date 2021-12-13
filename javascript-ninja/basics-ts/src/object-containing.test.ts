import { someObject } from './object-containing'

describe('object-containing', () => {
  beforeEach(() => {
    expect.hasAssertions()
  })

  it('Проверка, некоторых свойств объекта', () => {
    // Act
    const result = someObject(2, 3)

    // Assert
    expect(result).toEqual(expect.objectContaining({ a: 2, b: 3 }))
  })
})
