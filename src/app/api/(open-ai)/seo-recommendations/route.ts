import { NextResponse } from 'next/server';
import { generateText } from "@/utils/generateText";

export async function POST(req: Request) {
  const { keyword } = await req.json()
//   console.log(keyword)
  if (!keyword) {
    return new Response('Keyword is required', { status: 400 })
  }

  const prompt: string = `
    Analyze the keyword: "${keyword}" and provide detailed recommendations for optimizing its use in digital content. 
    Focus on SEO, content strategy, UX, and technical SEO, as well as additional strategies for amplification. 
    Make the recommendations actionable and relevant for effective implementation.    
    `;

  try {
    const generatedText = await generateText(prompt);
    return NextResponse.json({ text: generatedText });


  } catch (error) {
    console.error('Error generating text:', error)
    return new Response('Error generating text', { status: 500 })
  }
}