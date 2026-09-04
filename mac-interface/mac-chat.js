/**
 * MAC / MAG System - File 1.2 (mac-interface/mac-chat.js)
 * Description: Prompt-based chatbot interface to interact with the Mac autonomous engine.
 */

class MacChatInterface {
    constructor(kernelInstance, authManager) {
        this.kernel = kernelInstance;
        this.auth = authManager;
        this.chatHistory = [];
    }

    // ओनर के प्रॉम्प्ट या कमांड को प्रोसेस करना
    handleOwnerPrompt(ownerEmail, ownerSecret, promptText) {
        console.log(`[MAC CHAT]: Received prompt from -> ${ownerEmail}`);

        // 1. सुरक्षा जाँच (ओनर ऑथेंटिकेशन)
        const authCheck = this.auth.verifyOwnerIdentity(ownerEmail, ownerSecret);
        if (!authCheck.authorized) {
            return {
                success: false,
                response: "Access Denied: Unrecognized or unauthorized user."
            };
        }

        // 2. प्रॉम्प्ट को रिकॉर्ड करना
        const promptId = `PROMPT_${Date.now()}`;
        this.chatHistory.push({ id: promptId, prompt: promptText, time: Date.now() });

        console.log(`[MAC CHAT]: Processing prompt: "${promptText}"`);

        // 3. मैक कर्नेल को टास्क डिस्पैच करना
        const taskId = this.kernel.dispatchTask("User_Prompt_Execution", { prompt: promptText });

        return {
            success: true,
            response: `Mac Engine accepted your command. Task dispatched successfully.`,
            taskId: taskId,
            timestamp: Date.now()
        };
    }

    // चैट हिस्ट्री देखना
    getHistory() {
        return this.chatHistory;
    }
}

module.exports = MacChatInterface;

