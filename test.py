from anthropic import Anthropic, HUMAN_PROMPT, AI_PROMPT

# Initialize the Anthropic client
anthropic = Anthropic(
    api_key="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"  # Replace with a secure method to retrieve your API key
)

# Define a meaningful prompt
user_message = "What are the key benefits of using AI in modern businesses?"
prompt = f"{HUMAN_PROMPT}{user_message}{AI_PROMPT}"

try:
    # Generate completion
    completion = anthropic.completions.create(
        model="claude-2.1",
        max_tokens_to_sample=10,
        temperature=0.7,  # Adjust temperature for creativity
        prompt=prompt,
    )
    print(completion.completion)
except Exception as e:
    print(f"An error occurred: {e}")
