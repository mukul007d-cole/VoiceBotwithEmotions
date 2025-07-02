// const scene = new THREE.Scene();
// const canvas = document.getElementById('avatar-canvas');
// const camera = new THREE.PerspectiveCamera(85, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
// const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });

// renderer.setSize(canvas.clientWidth, canvas.clientHeight);
// renderer.setPixelRatio(window.devicePixelRatio);
// renderer.shadowMap.enabled = true; 
// renderer.shadowMap.type = THREE.PCFSoftShadowMap; 

// camera.position.z = 2.9;

// // Ambient Light
// const ambientLight = new THREE.AmbientLight(0x404040, 1);
// scene.add(ambientLight);

// // Directional Light
// const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
// directionalLight.position.set(0, 3, 2);
// directionalLight.castShadow = true; // Enable shadow for this light
// scene.add(directionalLight);

// // Load the model
// const loader = new THREE.GLTFLoader();
// loader.load('assets/finalmodel.glb', (gltf) => {
//     const avatar = gltf.scene;
//     avatar.scale.set(0.7, 0.7, 0.7);
//     avatar.position.set(0, -2.35, 0);
//     avatar.rotation.y = Math.PI / 2;
//     avatar.rotation.x = 0.1;

//     // Enable shadows for the model
//     avatar.traverse((child) => {
//         if (child.isMesh) {
//             child.castShadow = true; // Model casts shadow
//             child.receiveShadow = true; // Model receives shadow
//             child.material.anisotropy = renderer.getMaxAnisotropy(); // Set anisotropic filtering
//         }
//     });

//     scene.add(avatar);
//     console.log("Model loaded successfully");
// }, undefined, (error) => {
//     console.error("Error loading the 3D model:", error);
// });

// // Animation loop
// function animate() {
//     requestAnimationFrame(animate);
//     if (scene.children[1]) {
//         const avatar = scene.children[1];
//         avatar.rotation.y += 0.02;
//     }
//     renderer.render(scene, camera);
// }
// animate();

// window.addEventListener('resize', () => {
//     renderer.setSize(canvas.clientWidth, canvas.clientHeight);
//     camera.aspect = canvas.clientWidth / canvas.clientHeight;
//     camera.updateProjectionMatrix();
// });
//----------------------chat interface begins--------------------
//---------------//

//--------------//
function fun() {
const audio = new Audio('/assets/ironman.mp3');
    // document.addEventListener('onclick', () => {
      audio.play()
}
    //   alert("hi")
    // });
  
let selectedLanguage = 'en';

// Chat Interface
const sendButton = document.getElementById('send-button');
const userInput = document.getElementById('user-input');
sendButton.addEventListener('click', () => handleMessage(userInput.value.trim()));

////
userInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevent default behavior (e.g., form submission)
        handleMessage(userInput.value.trim()) // Trigger the send message function
    }
});
////


////
async function handleMessage(userMessage) {
    if (!userMessage) return;
    displayMessage(userMessage, 'user');
    userInput.value = "";

    let chatbotResponse = await getChatbotResponse(userMessage);
    chatbotResponse = chatbotResponse || "I'm sorry, I missed that!";
    displayMessage(chatbotResponse, 'chatbot');
    speakText(chatbotResponse, selectedLanguage);
}

async function react(message) {
    const feel = await determineEmotion(message); 
    console.log(`Emotion detected: ${feel}`); // Debugging

    let emo = document.getElementById('video2');
    if (!emo) {
        console.error("Element with ID 'video2' not found!");
        return;
    }

    let videoPath = "";
    if (feel === "happy") {
        videoPath = "/assets/emo2.mp4"; // Happy video path
    } else if (feel === "sad") {
        videoPath = "/assets/emo1.mp4"; // Sad video path
    } else if (feel === "angry") {
        videoPath = "/assets/emo3.mp4"; // Angry video path
    } else {
        console.log("Neutral emotion detected");
        return;
    }
    emo.style.zIndex = 10;
    emo.src = videoPath;
    emo.load();
    emo.play()
        .then(() => console.log(`${feel} video playing`))
        .catch(err => console.error("Error playing video:", err));

    setTimeout(() => {
        emo.src = ""; // Clear the video source
        emo.style.zIndex = 0; // Reset z-index
        console.log("Video reset after 8 seconds");
    }, 8000); 
}


async function getChatbotResponse(message) {

    react(message);

    const predefinedResponses = {
        "Hey": "Hi, how can I help you today!",
        "Hi": "Hi, how can I help you today!",
        "Hello": "Hi, how can I help you today!",
        "how are you": "I'm good, thank you for asking! How can I help you today?",
        "Who made you": "I was brought to life by a Dezyne Ecole's student named Mukul. Let's call him my creator!",
        "Who made you?": "I was brought to life by a Dezyne Ecole's student named Mukul. Let's call him my creator!",
        "What is your name?": "I'm your friendly chatbot! But if you have a fun name in mind, let me know!",
        "What's your name?": "I'm your friendly chatbot! But if you have a fun name in mind, let me know!"
    };

    if (predefinedResponses[message]) {
        let emo = document.getElementById('video2');
        emo.style.zIndex = 10;
        emo.src = "/assets/emo2.mp4";
        return predefinedResponses[message];
    } 

    if(message.includes("time" || "Time")) {
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes();
            return (`The current time is ${hours} Hours and ${minutes} Minutes, and i think you have a phone too, kindly see the time there.`);
    }

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer `//YOUR API KEY`
            },
            body: JSON.stringify({
                model: "gpt-4-turbo",
                messages: [
                    { "role": "system" , "content":"you are a fun robot", "content": `You are a multilingual assistant. Respond in ${selectedLanguage}.` },
                    { "role": "user", "content": message}
                ],
                max_tokens: 100
            })
        });
        const data = await response.json();
        return data.choices[0].message.content.trim();
    } catch (error) {
        console.error("Error:", error);
        return "I'm having trouble connecting to the server right now.";
    }
}

// Display Messages in Chat
function displayMessage(message, sender) {
    const chatInterface = document.getElementById('chat-interface');
    const messageElem = document.createElement('div');
    messageElem.className = sender;
    messageElem.textContent = message;
    chatInterface.appendChild(messageElem);
    chatInterface.scrollTop = chatInterface.scrollHeight;
}

// Voice Output
function speakText(text, preferredLang) {
    const voices = speechSynthesis.getVoices();
    let preferredVoice;
    
    if (preferredLang === "hinglish") {
        // preferredVoice = voices.find(voice => voice.name.includes("Microsoft Madhur"))|| voices[1]; //Microsoft Madhur Online
        preferredVoice = voices[168];
    } else if (preferredLang === "en-US") {
        preferredVoice = voices.find(voice => voice.name.includes("Microsoft David")) || voices[0];
    } else {
        preferredVoice = voices[0];
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = preferredVoice;

    const pitchSlider = document.getElementById('pitch-slider');
    const rateSlider = document.getElementById('rate-slider');

    utterance.pitch = parseFloat(pitchSlider.value);
    utterance.rate = parseFloat(rateSlider.value);
    utterance.volume = 1.0; // Full volume

    console.log("Selected Voice:", preferredVoice);
    console.log("Pitch:", utterance.pitch, "Rate:", utterance.rate);

    speechSynthesis.speak(utterance);
}


// Voice Input
const micButton = document.getElementById('mic-button');
const liveTranscription = document.getElementById('live-transcription');
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-US';
recognition.interimResults = true;

micButton.addEventListener('click', () => {
    recognition.lang = selectedLanguage === 'hinglish' ? 'en-IN' : 'en-US'; 
    recognition.start();
    micButton.classList.add('pulsing');
    liveTranscription.innerText = "Listening...";
});

recognition.onresult = (event) => {
    let transcript = '';
    for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
            transcript += event.results[i][0].transcript;
        }
    }
    liveTranscription.innerText = transcript;
    userInput.value = transcript;
};

recognition.onend = () => {
    micButton.classList.remove('pulsing');
    liveTranscription.innerText = "Processing...";
    
    if (userInput.value.trim()) {
        handleMessage(userInput.value.trim());
    }
};

recognition.onerror = (e) => {
    console.error("Voice Recognition Error:", e);
    liveTranscription.innerText = "Error occurred, please try again.";
    micButton.classList.remove('pulsing');
};

document.querySelectorAll('.lang-dropdown-content a').forEach((link) => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        selectedLanguage = event.target.getAttribute('data-lang'); 
        alert(`Language changed to ${event.target.textContent}`);
    });
});

async function determineEmotion(message) {
    const prompt = `Identify the emotion of this statement as happy, sad, angry, or neutral reply in just one word:\n"${message}"\nEmotion:`;

    console.log("Sending request to OpenAI API...");
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer `//YOUR API KEY`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo", 
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: prompt } 
            ],
            max_tokens: 5
        })
    });

    const data = await response.json();
    console.log("API Response:", data); 

    if (data && data.choices && data.choices[0] && data.choices[0].message) {
        const emotion = data.choices[0].message.content.trim().toLowerCase();
        console.log(`Detected Emotion: ${emotion}`);
        return emotion;
    } else {
        console.log("Error: Unable to detect emotion");
        return "neutral";
    }
}

//speech control

const speechControlModal = document.getElementById('speech-control-modal');
const closeButton = document.querySelector('.close-button');
const speechControlButton = document.getElementById('speech-controls');
const pitchSlider = document.getElementById('pitch-slider');
const rateSlider = document.getElementById('rate-slider');

// Show modal when Speech Control is clicked
speechControlButton.addEventListener('click', () => {
    speechControlModal.style.display = 'block';
});

// Close modal when 'X' is clicked
closeButton.addEventListener('click', () => {
    speechControlModal.style.display = 'none';
});

// Close modal when clicking outside the modal content
window.addEventListener('click', (event) => {
    if (event.target === speechControlModal) {
        speechControlModal.style.display = 'none';
    }
});

// Speech Synthesis setup
let utterance = new SpeechSynthesisUtterance("Hello! I'm your chatbot.");
utterance.pitch = pitchSlider.value;
utterance.rate = rateSlider.value;

// Update pitch and rate based on slider values
pitchSlider.addEventListener('input', () => {
    utterance.pitch = pitchSlider.value;
    console.log(`Pitch set to: ${utterance.pitch}`);
});

rateSlider.addEventListener('input', () => {
    utterance.rate = rateSlider.value;
    console.log(`Rate set to: ${utterance.rate}`);
});

document.getElementById('clear-chat-button').addEventListener('click', () => {
    const chatInterface = document.getElementById('chat-interface');
    const chatMessages = chatInterface.querySelectorAll('.user, .chatbot');
    chatMessages.forEach(message => message.remove());
});

function blue() {document.body.style.background = "radial-gradient(circle, var(--two), #000000)"; }
function pink() {document.body.style.background = "radial-gradient(circle, var(--three), #000000)"; }
function green() {document.body.style.background = "radial-gradient(circle, var(--four), #000000)"; }
function def() { document.body.style.background = "radial-gradient(circle, var(--one), #000000)"; }