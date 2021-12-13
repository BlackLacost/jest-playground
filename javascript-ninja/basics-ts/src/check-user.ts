type User = {
  age: number
}

export function checkUser(user: User) {
  if (user.age < 18) {
    alert('Вы слишком молоды для всего этого')
  }
}

export function checkUserCb(user: User, callback: CallableFunction) {
  if (user.age < 18) {
    callback(user.age)
  }
}

export function checkUserAlert(user: User) {
  if (user.age < 18) {
    alert('Вы слишком молоды для всего этого')
  }
}
