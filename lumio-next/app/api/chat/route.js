export async function POST(request) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  console.log('Key length:', apiKey?.length)
  console.log('Key start:', apiKey?.substring(0, 10))
  console.log('Key valid chars:', /^[a-zA-Z0-9_\-]+$/.test(apiKey || ''))
  try {
    const body = await request.json()
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify(body)
    })
    const text = await response.text()
    const data = JSON.parse(text)
    return Response.json(data)
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}