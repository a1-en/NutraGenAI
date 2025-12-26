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

        const { prompt } = await req.json()

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
        }

        const response = await fetch(OPENAI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a professional nutritionist and meal planning expert. Generate detailed, healthy meal plans with accurate nutritional information. You MUST return valid JSON only, no markdown formatting.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                response_format: { type: "json_object" }
            })
        })

        if (!response.ok) {
            const errorData = await response.json()
            console.error('OpenAI Error:', errorData)
            return NextResponse.json(
                { error: `OpenAI API error: ${errorData.error?.message || response.statusText}` },
                { status: response.status }
            )
        }

        const data = await response.json()
        return NextResponse.json({ content: data.choices[0].message.content })
    } catch (error) {
        console.error('API Route Error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
