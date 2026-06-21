import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json()

  const response = await fetch(
    'https://api-inference.huggingface.co/models/facebook/musicgen-small',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: body.prompt,
      }),
    }
  )

  const audioBuffer = await response.arrayBuffer()

  return new Response(audioBuffer, {
    headers: {
      'Content-Type': 'audio/wav',
    },
  })
}
