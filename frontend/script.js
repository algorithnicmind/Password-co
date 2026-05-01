const API_BASE = "http://localhost:8000/api";

// Elements
const passwordInput = document.getElementById('passwordInput');
const copyBtn = document.getElementById('copyBtn');
const generateBtn = document.getElementById('generateBtn');
const lengthRange = document.getElementById('lengthRange');
const lengthVal = document.getElementById('lengthVal');
const numbersToggle = document.getElementById('numbersToggle');
const symbolsToggle = document.getElementById('symbolsToggle');
const strengthBar = document.getElementById('strengthBar');
const strengthText = document.getElementById('strengthText');
const customCheckInput = document.getElementById('customCheckInput');
const feedbackList = document.getElementById('feedbackList');

// --- Helper Functions ---

const updateStrengthUI = (strengthInfo) => {
    const { strength, score } = strengthInfo;
    
    // Set colors based on strength
    let color = "#94a3b8"; // Muted
    let percent = "0%";

    switch(strength) {
        case "Weak":
            color = "#ef4444";
            percent = "25%";
            break;
        case "Medium":
            color = "#f59e0b";
            percent = "50%";
            break;
        case "Strong":
            color = "#10b981";
            percent = "75%";
            break;
        case "Very Strong":
            color = "#8b5cf6";
            percent = "100%";
            break;
    }

    strengthText.innerText = `Strength: ${strength}`;
    strengthText.style.color = color;
    document.documentElement.style.setProperty('--strength-color', color);
    document.documentElement.style.setProperty('--strength-percent', percent);
};

// --- API Calls ---

const generatePassword = async () => {
    const length = lengthRange.value;
    const includeNumbers = numbersToggle.checked;
    const includeSymbols = symbolsToggle.checked;

    try {
        const response = await fetch(`${API_BASE}/generate?length=${length}&numbers=${includeNumbers}&symbols=${includeSymbols}`);
        const data = await response.json();
        
        passwordInput.value = data.password;
        updateStrengthUI(data.strength);
    } catch (error) {
        console.error("Error generating password:", error);
        alert("Failed to connect to backend. Is the Python server running?");
    }
};

const checkCustomPassword = async (password) => {
    if (!password) {
        feedbackList.innerHTML = "";
        updateStrengthUI({ strength: "-", score: 0 });
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/check`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        });
        const data = await response.json();
        
        updateStrengthUI(data);
        
        // Show feedback
        feedbackList.innerHTML = data.feedback.map(f => `<span>• ${f}</span>`).join('');
    } catch (error) {
        console.error("Error checking password:", error);
    }
};

// --- Event Listeners ---

lengthRange.addEventListener('input', (e) => {
    lengthVal.innerText = e.target.value;
});

generateBtn.addEventListener('click', generatePassword);

copyBtn.addEventListener('click', () => {
    if (!passwordInput.value) return;
    
    navigator.clipboard.writeText(passwordInput.value);
    
    // Simple visual feedback
    const originalSvg = copyBtn.innerHTML;
    copyBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
    setTimeout(() => copyBtn.innerHTML = originalSvg, 2000);
});

customCheckInput.addEventListener('input', (e) => {
    checkCustomPassword(e.target.value);
});

// Initial generation
generatePassword();
