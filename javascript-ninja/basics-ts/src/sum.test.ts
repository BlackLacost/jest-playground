import { sum } from './sum'

describe('sum', () => {
  beforeEach(() => {
    expect.hasAssertions()
  })

  it('sum(2, 3) = 5', () => {
    // Act
    const result = sum(2, 3)

    // Assert
    expect(result).toBe(5)
  })

  it.each`
    a     | b    | result
    ${1}  | ${2} | ${3}
    ${-1} | ${1} | ${0}
  `('when a=$a and b=$b, result=$result', ({ a, b, result }) => {
    expect(sum(a, b)).toBe(result)
  })
})
