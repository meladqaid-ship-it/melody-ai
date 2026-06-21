import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
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

    // نقرأ النتيجة كنص أولاً
    const text = await response.text()

    return NextResponse.json({
      status: response.status,
      result: text,
    })
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
    })
  }
}
