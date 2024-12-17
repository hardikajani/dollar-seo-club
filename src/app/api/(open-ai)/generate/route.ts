// import { NextResponse } from 'next/server';
// import { generateText } from "@/utils/generateText"; // Adjust the import path as necessary

// export const runtime = 'edge';

// export async function POST(req: Request) {
//   const { keyword } = await req.json();
//   console.log(keyword);
//   if (!keyword) {
//     return new Response('Keyword is required', { status: 400 });
//   }

//   const prompt: string = `
//     Generate a detailed, engaging, and SEO-optimized article focusing on the keyword: "${keyword}". 
//     Ensure the content is tailored to attract readers and rank highly in search engine results.
//     Include a compelling introduction, benefits, examples, and a strong conclusion.
//     Use proper HTML structure and natural occurrences of the keyword.
//   `;

//   try {
//     const { output } = await generateText(prompt);
    
//     return new Response(output, {
//       headers: {
//         'Content-Type': 'text/plain; charset=utf-8',
//         'Transfer-Encoding': 'chunked',
//       },
//     });
//   } catch (error) {
//     console.error('Error generating text:', error);
//     return new Response('Error generating text', { status: 500 });
//   }
// }