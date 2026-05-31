export function buildAuthSession(loginResponse) {
  return {
    token: loginResponse.token ?? null,
    user: {
      id: loginResponse.userId ?? null,
      email: loginResponse.email ?? '',
      role: loginResponse.role ?? '',
    },
  }
}