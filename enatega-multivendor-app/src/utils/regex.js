export const emailRegex = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/
export const passRegex = /^(?=.*\d)(?=.*[a-zA-Z]).{8,}$/
export const nameRegex = /^[\p{L}][\p{L}\s'-]*$/u
export const phoneRegex = /^\d{7,15}$/


// Handlers
export const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
  }