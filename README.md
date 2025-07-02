🤖 3D Voice Chatbot
A futuristic and interactive 3D AI-powered voice chatbot built using Three.js, Web Speech API, and OpenAI GPT API. This web application lets users speak to a 3D robot avatar that responds in real-time with voice, creating a natural, engaging chat experience — just like talking to your own AI companion!


🚀 Features
🧠 AI-Powered Conversations (GPT-3.5-Turbo via OpenAI API)

🎙️ Voice Input Support (Speech-to-Text using Web Speech API)

🔊 Voice Output (Text-to-Speech replies from the bot)

🕹️ 3D Animated Robot using Three.js and GLTF models

💬 Responsive Chat Interface with live transcription

⚡ Real-time message handling and fallback responses

🎨 Modern, sleek UI with animated model motion

📸 Demo
A talking robot that understands you and talks back – powered by OpenAI and animated in 3D!


🛠️ Tech Stack
Technology	Purpose
HTML/CSS	UI Layout & Styling
JavaScript	Logic, API, and DOM handling
Three.js	Rendering the 3D Model
GLTFLoader	Loading 3D .glb model files
OpenAI API	AI Chatbot (GPT-3.5-turbo)
Web Speech API	Voice Input & Output

📂 Project Structure
pgsql
Copy
Edit
📁 3d-voice-chatbot
├── index.html
├── style.css
├── script.js
├── assets/
│   ├── botmodel.glb
│   ├── demo-screenshot.png
│   └── demo.gif
└── README.md
🔧 Setup Instructions
Clone the repository

bash
Copy
Edit
git clone https://github.com/your-username/3d-voice-chatbot.git
cd 3d-voice-chatbot
Add your OpenAI API key

In script.js, replace:

js
Copy
Edit
'Authorization': `Bearer YOUR_API_KEY`
Install Live Server (optional)
If you're using VS Code, install the Live Server extension to preview the app locally.

Run the App
Open index.html in your browser OR right-click → “Open with Live Server”

🧠 Requirements
Modern Browser (Chrome/Edge/Firefox)

Internet connection (for API requests)

OpenAI API Key (create from https://platform.openai.com/)

🔐 Note on API Usage
This project uses OpenAI’s GPT-3.5-turbo model. Make sure:

You don’t expose your API key publicly.

You handle rate limits and token quotas properly.

You review and comply with OpenAI’s usage policies.

🌟 Future Enhancements
Lip sync animations for speech output

Multiple voice options & personalities

Backend integration for chat history

Mobile optimization

Voice tone detection for emotional responses

🤝 Contributing
Feel free to fork, enhance, or raise issues. Contributions are welcome!

📄 License
MIT License. Feel free to use and modify this project.

🙌 Author
Mukul Bassi
🌐 mukuldev.infy.uk
📧 beingbassi007@gmail.com

