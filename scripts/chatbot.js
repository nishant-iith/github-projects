class Chatbot {
    constructor() {
        this.chatButton = document.getElementById('chatbotButton');
        this.chatContainer = document.getElementById('chatContainer');
        this.closeButton = document.getElementById('closeChat');
        this.sendButton = document.getElementById('sendMessage');
        this.chatInput = document.getElementById('chatInput');
        this.chatMessages = document.getElementById('chatMessages');
        this.apiKey = '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'; 
        this.apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
        this.hasInteracted = false;

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
        const response = await fetch(this.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`,
            },
            body: JSON.stringify({
                messages: [{
                    role: 'user',
                    content: message
                }],
                model: 'openai/gpt-3.5-turbo',
            })
        });

        const data = await response.json();
        return data.choices[0].message.content;
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
