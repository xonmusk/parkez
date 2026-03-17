import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

export async function executeAgent(
  systemPrompt: string,
  userInput: string,
  model: string = "claude-sonnet-4-20250514",
  maxTokens: number = 2048
): Promise<{ output: string; success: boolean }> {
  try {
    const message = await anthropic.messages.create({
      model,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: "user", content: userInput }],
    });
    const output =
      message.content[0].type === "text" ? message.content[0].text : "";
    return { output, success: true };
  } catch (error) {
    console.error("Claude API error:", error);
    return {
      output: "Something went wrong. Please try again.",
      success: false,
    };
  }
}

export function streamAgent(
  systemPrompt: string,
  userInput: string,
  model: string = "claude-sonnet-4-20250514",
  maxTokens: number = 2048
) {
  return anthropic.messages.stream({
    model,
    max_tokens: maxTokens,
    system: systemPrompt,
    messages: [{ role: "user", content: userInput }],
  });
}
