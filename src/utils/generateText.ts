import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export const getGeneratedText = async (userPrompt:string) => {
  try {
    const { text } = await generateText({
      model: openai("gpt-4-turbo"), // Specify the model you want to use
      prompt: userPrompt, // Use the user-provided prompt
    });
    return text; // Return the generated text
  } catch (error) {
    console.error("Error generating text:", error);
    throw new Error("Failed to generate text");
  }
};