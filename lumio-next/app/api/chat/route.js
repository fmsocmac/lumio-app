export async function POST(request) {
  try {
    const body = await request.json()

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(body)
    })

    const text = await response.text()
    console.log('Anthropic response:', text)

    const data = JSON.parse(text)
    return Response.json(data)
  } catch (error) {
    console.log('API error:', error.message)
    return Response.json({ error: error.message }, { status: 500 })
  }
}