import { NextResponse } from 'next/server'

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'
const AI_API_KEY = process.env.OPENAI_API_KEY || ''

export async function POST(req: Request) {
    try {
        if (!AI_API_KEY) {
            return NextResponse.json(
                { error: 'OpenAI API key is missing. Please set OPENAI_API_KEY in your .env file.' },
                { status: 500 }
            )
        }

        const { messages, temperature = 0.7, response_format, max_tokens } = await req.json()

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: 'Messages are required' }, { status: 400 })
        }

        const body: any = {
            model: 'gpt-4o-mini',
            messages,
            temperature,
        }

        if (response_format) {
            body.response_format = response_format
        }

        if (max_tokens) {
            body.max_tokens = max_tokens
        }

        const response = await fetch(OPENAI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AI_API_KEY}`
            },
            body: JSON.stringify(body)
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            console.error('OpenAI Error:', errorData)
            return NextResponse.json(
                { error: `OpenAI API error: ${errorData.error?.message || response.statusText}` },
                { status: response.status }
            )
        }

        const data = await response.json()
        return NextResponse.json(data)
    } catch (error) {
        console.error('API Route Error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
