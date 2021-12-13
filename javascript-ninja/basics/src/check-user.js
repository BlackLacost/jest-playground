module.exports = {
  checkUser(user) {
    if (user.age < 18) {
      alert('Вы слишком молоды для всего этого')
    }
  },

  checkUserCb(user, callback) {
    if (user.age < 18) {
      callback(user.age)
    }
  },

  checkUserAlert(user) {
    if (user.age < 18) {
      alert('Вы слишком молоды для всего этого')
    }
  },
}
