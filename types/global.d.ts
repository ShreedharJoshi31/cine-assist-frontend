interface Window {
  SpeechRecognition: typeof SpeechRecognition
  webkitSpeechRecognition: typeof SpeechRecognition
}

declare var webkitSpeechRecognition: {
  new (): SpeechRecognition
}

