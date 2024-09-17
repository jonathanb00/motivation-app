export default defineEventHandler(async (event) => {
    const response = await fetch('https://zenquotes.io/api/random')
    const quoteData = await response.json()

    return quoteData
  })
  