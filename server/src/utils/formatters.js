import pkg from 'lodash'
const { pick } = pkg

export const pickUser = (user) => {
  if (!user) return {}
  return pick(user, ['_id', 'email', 'username', 'displayName', 'avatar', 'role', 'verified', 'createdAt', 'updatedAt', 'friends', 'views', 'profession', 'location'])
}