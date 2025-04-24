import { NextRequest, NextResponse } from 'next/server';
import { MemeText, TextGenerationResponse } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();
    
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }
    
    const apiKey = process.env.GROQ_API_KEY;
    const model = process.env.GROQ_MODEL || 'meta-llama/llama-4-scout-17b-16e-instruct';
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Groq API key is not configured' },
        { status: 500 }
      );
    }
    
    const systemPrompt = `You are a creative and humorous meme text generator. 
    Given a description or context for a meme, generate 3 different pairs of top and bottom text that would work well for a meme.
    Make them funny, clever, and relevant to the context provided. Keep the text short and impactful.
    Respond in JSON format with an array of suggestions, each with 'top' and 'bottom' text fields.`;
    
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Generate meme text for: ${prompt}` }
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Groq API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Parse the response to extract the suggestions
    try {
      const content = data.choices[0].message.content;
      // Extract JSON from the response if it's wrapped in markdown code blocks
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```([\s\S]*?)```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : content;
      
      // Parse the JSON
      const parsedData = JSON.parse(jsonStr.trim());
      
      // Ensure the response has the expected format
      const suggestions: MemeText[] = Array.isArray(parsedData.suggestions) 
        ? parsedData.suggestions 
        : Array.isArray(parsedData) 
          ? parsedData 
          : [];
      
      return NextResponse.json({ suggestions } as TextGenerationResponse);
    } catch (parseError) {
      console.error('Error parsing Groq response:', parseError);
      // Fallback to manual parsing if JSON parsing fails
      const content = data.choices[0].message.content;
      const lines = content.split('\n').filter((line: string) => line.trim());
      
      const suggestions: MemeText[] = [];
      let currentSuggestion: Partial<MemeText> = {};
      
      for (const line of lines) {
        if (line.toLowerCase().includes('top:')) {
          currentSuggestion.top = line.split('top:')[1].trim();
        } else if (line.toLowerCase().includes('bottom:')) {
          currentSuggestion.bottom = line.split('bottom:')[1].trim();
          
          if (currentSuggestion.top && currentSuggestion.bottom) {
            suggestions.push(currentSuggestion as MemeText);
            currentSuggestion = {};
          }
        }
      }
      
      return NextResponse.json({ 
        suggestions: suggestions.length > 0 ? suggestions : [
          { top: "WHEN YOU TRY", bottom: "BUT YOU CAN'T EVEN" },
          { top: "THAT MOMENT", bottom: "WHEN IT HAPPENS" },
          { top: "NOBODY EXPECTS", bottom: "THE SPANISH INQUISITION" }
        ] 
      } as TextGenerationResponse);
    }
  } catch (error) {
    console.error('Error generating text with Groq:', error);
    return NextResponse.json(
      { error: 'Failed to generate text' },
      { status: 500 }
    );
  }
}
