class Chatbot {
    constructor() {
        this.chatButton = document.getElementById('chatbotButton');
        this.chatContainer = document.getElementById('chatContainer');
        this.closeButton = document.getElementById('closeChat');
        this.sendButton = document.getElementById('sendMessage');
        this.chatInput = document.getElementById('chatInput');
        this.chatMessages = document.getElementById('chatMessages');
        this.apiUrl = 'http://localhost:3000/api/chat';  // Update this URL in production
        this.hasInteracted = false;
        this.conversationHistory = [];

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.chatButton.addEventListener('click', () => this.toggleChat());
        this.closeButton.addEventListener('click', () => this.toggleChat());
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
    }

    toggleChat() {
        this.chatContainer.classList.toggle('active');
        if (!this.hasInteracted) {
            this.chatButton.style.animation = 'none';
            this.hasInteracted = true;
            localStorage.setItem('chatbotInteracted', 'true');
        }
    }

    async sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message) return;

        // Add user message to chat
        this.addMessage(message, 'user');
        this.chatInput.value = '';

        // Show typing indicator
        const typingIndicator = this.addMessage('...', 'bot');

        try {
            const response = await this.getAIResponse(message);
            // Remove typing indicator and add AI response
            typingIndicator.remove();
            this.addMessage(response, 'bot');
        } catch (error) {
            typingIndicator.remove();
            this.addMessage('Sorry, I encountered an error. Please try again.', 'bot');
            console.error('Error:', error);
        }
    }

    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);
        messageDiv.textContent = text;
        this.chatMessages.appendChild(messageDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        return messageDiv;
    }

    async getAIResponse(message) {
        try {
            // Add message to conversation history
            this.conversationHistory.push({
                role: 'user',
                content: message
            });

            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messages: this.conversationHistory,
                    model: 'openai/gpt-3.5-turbo',
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('API Error:', errorData);
                throw new Error(errorData.error?.message || 'API request failed');
            }

            const data = await response.json();
            const botResponse = data.choices[0].message.content;
            
            // Add bot response to conversation history
            this.conversationHistory.push({
                role: 'assistant',
                content: botResponse
            });

            // Keep conversation history manageable
            if (this.conversationHistory.length > 10) {
                this.conversationHistory = this.conversationHistory.slice(-10);
            }

            return botResponse;
        } catch (error) {
            console.error('Error in API call:', error);
            throw new Error('Failed to get AI response: ' + error.message);
        }
    }

    initialize() {
        // Check if user has interacted before
        if (localStorage.getItem('chatbotInteracted') === 'true') {
            this.chatButton.style.animation = 'none';
            this.hasInteracted = true;
        }
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const chatbot = new Chatbot();
    chatbot.initialize();
});
