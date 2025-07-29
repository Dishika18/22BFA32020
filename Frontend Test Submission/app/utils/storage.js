const STORAGE_KEY = "url_shortener_data"

export const getAllUrls = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error("Error reading from localStorage:", error)
    return []
  }
}

export const saveUrlData = (urlData) => {
  try {
    const existingUrls = getAllUrls()
    const updatedUrls = [...existingUrls, urlData]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUrls))
    return true
  } catch (error) {
    console.error("Error saving to localStorage:", error)
    return false
  }
}

export const getUrlByShortcode = (shortcode) => {
  try {
    const urls = getAllUrls()
    return urls.find((url) => url.shortcode === shortcode)
  } catch (error) {
    console.error("Error finding URL by shortcode:", error)
    return null
  }
}

export const updateClickCount = (shortcode, clickData) => {
  try {
    const urls = getAllUrls()
    const urlIndex = urls.findIndex((url) => url.shortcode === shortcode)

    if (urlIndex !== -1) {
      urls[urlIndex].clicks = (urls[urlIndex].clicks || 0) + 1
      urls[urlIndex].clickHistory = urls[urlIndex].clickHistory || []
      urls[urlIndex].clickHistory.push(clickData)

      localStorage.setItem(STORAGE_KEY, JSON.stringify(urls))
      return true
    }

    return false
  } catch (error) {
    console.error("Error updating click count:", error)
    return false
  }
}
