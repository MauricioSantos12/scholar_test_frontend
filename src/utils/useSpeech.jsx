export const speakText = (text) => {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        const voices = window.speechSynthesis.getVoices();
        utterance.voice = voices[2];
        utterance.pitch = 0.7;
        utterance.rate = 1;
        utterance.volume = 1;

        window.speechSynthesis.speak(utterance);
    } else {
        alert('Text-to-speech not supported in this browser.');
    }
};

export const stripHtmlTags = (str) => {
    const doc = new DOMParser().parseFromString(str, 'text/html');
    const parsedStr = doc.body.textContent;
    return parsedStr;
};