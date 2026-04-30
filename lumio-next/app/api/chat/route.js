export async function POST(request) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  return Response.json({
    keyLength: apiKey?.length,
    keyStart: apiKey?.substring(0, 7),
    keyEnd: apiKey?.substring(apiKey.length - 4),
    hasNewline: apiKey?.includes('\n'),
    hasSpace: apiKey?.includes(' '),
  })
}