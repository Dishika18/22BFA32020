export const validateUrl = (url) => {
  try {
    const urlObj = new URL(url)
    return urlObj.protocol === "http:" || urlObj.protocol === "https:"
  } catch {
    return false
  }
}

export const validateShortcode = (shortcode) => {
  if (!shortcode) return true 

  const regex = /^[a-zA-Z0-9]{1,10}$/
  return regex.test(shortcode)
}

export const generateShortcode = () => {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let result = ""

  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }

  return result
}
