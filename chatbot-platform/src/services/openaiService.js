import OpenAI from "openai";
import readlineSync from "readline-sync";

// Hàm tạo OpenAI client
const createOpenAIClient = () => {
    return new OpenAI({
        apiKey: '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',
    });
};

// Hàm gọi API OpenAI để xử lý chat
export const chatWithOpenAI = async (userInput, history) => {
    const openai = createOpenAIClient();

    const messages = history.flatMap(([input_text, completion_text]) => [
        { role: "user", content: input_text },
        { role: "assistant", content: completion_text },
    ]);

    messages.push({ role: "user", content: userInput });

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: messages,
        });
        return completion.choices[0].message.content;
    } catch (error) {
        handleOpenAIError(error);
        throw error;
    }
};

// Hàm xử lý lỗi từ OpenAI API
const handleOpenAIError = (error) => {
    if (error.response) {
        console.error("OpenAI API Error:");
        console.error("Status:", error.response.status);
        console.error("Data:", error.response.data);
    } else {
        console.error("Error:", error.message);
    }
};

// Hàm tương tác console (chạy lặp qua readlineSync)
const interactiveChat = async () => {
    const openai = createOpenAIClient();
    const history = [];

    while (true) {
        const userInput = readlineSync.question("Your input: ");

        const messages = history.flatMap(([input_text, completion_text]) => [
            { role: "user", content: input_text },
            { role: "assistant", content: completion_text },
        ]);

        messages.push({ role: "user", content: userInput });

        try {
            const completion = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: messages,
            });
            const completionText = completion.choices[0].message.content;
            console.log(completionText);

            history.push([userInput, completionText]);

            const continueChat = readlineSync
                .question("\nWould you like to continue the conversation? (Y/N): ")
                .toUpperCase();

            if (continueChat === "N") {
                console.log("Goodbye!");
                break;
            } else if (continueChat !== "Y") {
                console.log("Invalid input. Please enter 'Y' or 'N'.");
                break;
            }
        } catch (error) {
            handleOpenAIError(error);
        }
    }
};

// Tự động chạy interactiveChat nếu file được chạy trực tiếp
if (require.main === module) {
    interactiveChat();
}
export default createOpenAIClient;