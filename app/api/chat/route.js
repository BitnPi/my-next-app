// app/api/chat/route.js
import { NextResponse } from 'next/server';
import ollama from 'ollama';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

const CountryInfoSchema = z.object({
    name: z.string(),
    capital: z.string(), 
    languages: z.array(z.string()),
    GDP: z.number()
});

const CountryListSchema = z.object({
  countries: z.array(CountryInfoSchema).describe('An array of Countries')
});

export async function POST(req) {
  const { messages } = await req.json();
  
  try {
    const response = await ollama.chat({
      model: 'mistral:latest',
      messages,
      format: zodToJsonSchema(CountryListSchema),
      options: {
        temperature: 0 
    }
    });
    return NextResponse.json({ content: response.message.content });
  } catch (error) {
    console.error('Error calling Ollama:', error);
    return NextResponse.json({ error: 'Error interacting with Ollama' }, { status: 500 });
  }
}
