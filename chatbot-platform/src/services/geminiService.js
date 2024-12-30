import axios from 'axios';


// Function to call the Gemini API
const callGemini = async (message) => {
  try {
    const response = await axios.post(
      'https://gemini-api.googleapis.com/v1/chat',
      { prompt: message },
      {
        headers: {
          Authorization: `Bearer YOUR_GEMINI_API_KEY`, // Replace YOUR_GEMINI_API_KEY with your actual API key
        },
      }
    );

    return response.data.reply;
  } catch (error) {
    console.error('Error calling Gemini API:', error.message);
    throw error;
  }
};

// Function to analyze sentiment using Google Cloud Language API
const analyzeSentiment = async (text) => {
  const document = {
    content: text,
    type: 'PLAIN_TEXT',
  };

  try {
    const [result] = await client.analyzeSentiment({ document });
    const sentiment = result.documentSentiment;

    console.log(`Sentiment score: ${sentiment.score}`);
    console.log(`Sentiment magnitude: ${sentiment.magnitude}`);

    return sentiment;
  } catch (error) {
    console.error('Error analyzing sentiment:', error.message);
    throw error;
  }
};

// Function to generate a response using Gemini API and analyze its sentiment
const generateResponse = async (message) => {
  try {
    const geminiResponse = await callGemini(message);
    const sentiment = await analyzeSentiment(geminiResponse);

    return {
      response: geminiResponse,
      sentiment,
    };
  } catch (error) {
    console.error('Error generating response:', error.message);
    throw error;
  }
};

// Export the functions for use in other parts of the application
export { callGemini, analyzeSentiment, generateResponse };
