const SESSION_NOTICE_KEY = 'ems_session_notice'

export function setSessionNotice(message) {
  sessionStorage.setItem(SESSION_NOTICE_KEY, message)
}

export function getSessionNotice() {
  return sessionStorage.getItem(SESSION_NOTICE_KEY)
}

export function clearSessionNotice() {
  sessionStorage.removeItem(SESSION_NOTICE_KEY)
}