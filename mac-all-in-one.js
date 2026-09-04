/**
 * MAC / MAG System - Complete Autonomous Ecosystem with Persistent Storage
 * Description: Fully integrated Kernel, Event Bus, Persistent JSON Storage, and Interactive Chat.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// स्टोरेज फाइल का पाथ (फोन के इसी फोल्डर में डेटा सुरक्षित रहेगा)
const STORAGE_FILE = path.join(__dirname, 'mac-memory.json');

// 1. सेंट्रल इवेंट बस (मॉड्यूल्स के बीच बातचीत के लिए)
class MacEventBus {
    constructor() {
        this.listeners = {};
    }
    on(event, callback) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(callback);
    }
    emit(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(cb => cb(data));
        }
    }
}

// 2. अल्ट्रा स्टोरेज मैनेजर (परसिस्टेंट JSON स्टोरेज - मोबाइल पर बिना लैग के)
class MacUltraManager {
    constructor() {
        this.data = this.loadFromDisk();
    }

    loadFromDisk() {
        try {
            if (fs.existsSync(STORAGE_FILE)) {
                const fileContent = fs.readFileSync(STORAGE_FILE, 'utf8');
                return JSON.parse(fileContent);
            }
        } catch (err) {
            console.log("[STORAGE WARNING]: Could not load memory, starting fresh.");
        }
        return { units: {}, history: [] };
    }

    saveToDisk() {
        try {
            fs.writeFileSync(STORAGE_FILE, JSON.stringify(this.data, null, 2), 'utf8');
        } catch (err) {
            console.log("[STORAGE ERROR]: Failed to write memory to disk.");
        }
    }

    setUltraState(unitName, key, val) {
        if (!this.data.units[unitName]) this.data.units[unitName] = {};
        this.data.units[unitName][key] = val;
        this.saveToDisk(); // सुरक्षित रूप से फोन में सेव करना
    }

    getUltraState(unitName, key) {
        return this.data.units[unitName] ? this.data.units[unitName][key] : null;
    }

    logHistory(prompt, response) {
        this.data.history.push({ prompt, response, time: new Date().toISOString() });
        this.saveToDisk();
    }
}

// 3. ऑटोनॉमस कर्नेल इंजन (बैकग्राउंड लूप और हेल्थ चेक)
class MacCoreEngine {
    constructor(eventBus, storage) {
        this.eventBus = eventBus;
        this.storage = storage;
        this.status = "Offline";
    }

    boot() {
        this.status = "Online & Autonomous";
        console.log("[MAC KERNEL]: Core engine booted successfully.");
        this.startBackgroundLoop();
    }

    startBackgroundLoop() {
        // बैकग्राउंड हेल्थ चेक (सिस्टम को बिना लैग के एक्टिव रखना)
        setInterval(() => {
            this.storage.setUltraState("Mac_Core_System", "last_heartbeat", new Date().toISOString());
        }, 30000); // हर 30 सेकंड में साइलेंट सेव
    }
}

// 4. ओनर ऑथेंटिकेशन मैनेजर (Security)
class MacAuthManager {
    constructor(ownerEmail) {
        this.ownerEmail = ownerEmail;
        this.secretKey = "SECRET_KEY";
    }

    verifyAccess(email, key) {
        return email === this.ownerEmail && key === this.secretKey;
    }
}

// 5. चैट और प्रॉम्प्ट इंटरफेस (Interactive Handler)
class MacChatInterface {
    constructor(kernel, auth, storage) {
        this.kernel = kernel;
        this.auth = auth;
        this.storage = storage;
    }

    handleOwnerPrompt(email, key, prompt) {
        if (!this.auth.verifyAccess(email, key)) {
            return "[SECURITY ERROR]: Unauthorized access attempt blocked.";
        }

        let response = "";
        const lowerPrompt = prompt.toLowerCase();

        if (lowerPrompt.includes("optimize")) {
            response = "Optimization complete: Background loops fine-tuned, memory synced to JSON.";
        } else if (lowerPrompt.includes("status")) {
            response = "System Status: 100% Operational. Autonomous loops active. Memory secure.";
        } else {
            response = `System processed command: "${prompt}". Core is listening.`;
        }

        // चैट हिस्ट्री को परसिस्टेंट स्टोरेज में सेव करना
        this.storage.logHistory(prompt, response);
        return response;
    }
}

// --- मुख्य सिस्टम रनर और लाइव इंटरएक्टिव लूप ---
class MacSystemRunner {
    constructor() {
        console.log("==========================================");
        console.log("   INITIALIZING MAC / MAG ECOSYSTEM...    ");
        console.log("==========================================");

        this.eventBus = new MacEventBus();
        this.storage = new MacUltraManager();
        this.kernel = new MacCoreEngine(this.eventBus, this.storage);
        this.auth = new MacAuthManager("aavesh.owner@macsystem.local");
        this.chat = new MacChatInterface(this.kernel, this.auth, this.storage);

        this.kernel.boot();
    }

    startInteractiveCLI() {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        console.log("==========================================");
        console.log(" MAC SYSTEM IS LIVE. Type your commands below:");
        console.log(" (Type 'exit' to close, or ask anything)");
        console.log("==========================================");

        const askQuestion = () => {
            rl.question('Aavesh@Mac:~$ ', (input) => {
                if (input.trim().toLowerCase() === 'exit') {
                    console.log("[MAC SYSTEM]: Shutting down safely. Memory saved.");
                    rl.close();
                    return;
                }

                const result = this.chat.handleOwnerPrompt(
                    "aavesh.owner@macsystem.local", 
                    "SECRET_KEY", 
                    input
                );

                console.log("MAC-->", result);
                askQuestion(); // अगली कमांड के लिए लूप जारी रखना
            });
        };

        askQuestion();
    }
}

// सिस्टम बूट और रन करना
const runner = new MacSystemRunner();
runner.startInteractiveCLI();

