const minNextCommandTime = 2000;
let shouldSkipCommand = false;

// var xhr = new XMLHttpRequest();

// text to speech
var synth = window.speechSynthesis;
var voice;
var speak = function(text) {
  console.log(text)
  var utterThis = new SpeechSynthesisUtterance(text);
  voice = voice || synth.getVoices().find(speechVoice=>speechVoice.lang === 'zh-HK');

  utterThis.voice = voice;
  synth.speak(utterThis);
}

// speech to text
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

// var colors = [ 'aqua' , 'azure' , 'beige', 'bisque', 'black', 'blue', 'brown', 'chocolate', 'coral', 'crimson', 'cyan', 'fuchsia', 'ghostwhite', 'gold', 'goldenrod', 'gray', 'green', 'indigo', 'ivory', 'khaki', 'lavender', 'lime', 'linen', 'magenta', 'maroon', 'moccasin', 'navy', 'olive', 'orange', 'orchid', 'peru', 'pink', 'plum', 'purple', 'red', 'salmon', 'sienna', 'silver', 'snow', 'tan', 'teal', 'thistle', 'tomato', 'turquoise', 'violet', 'white', 'yellow'];
// var grammar = '#JSGF V1.0; grammar colors; public <color> = ' + colors.join(' | ') + ' ;'

var recognition = new SpeechRecognition();
// var speechRecognitionList = new SpeechGrammarList();
// speechRecognitionList.addFromString(grammar, 1);
// recognition.grammars = speechRecognitionList;
recognition.continuous = true;
recognition.lang = 'zh-HK';
// recognition.lang = 'en-US';
recognition.interimResults = true;
recognition.maxAlternatives = 3;

document.body.onload = function () {
  recognition.start();
  console.log('Ready to receive voice command.');
}

recognition.onresult = function (event) {
  var last = event.results.length - 1;
  var results = new Array(event.results[last].length).fill(null).map((_,i)=>(event.results[last][i] || {}).transcript);
  console.log(results)
  document.getElementById('voice').innerHTML = 'I heard: ' + results.join(', ')
  results.forEach(response)
}

let recError = null
recognition.onend = function () {
  if(recError === 'not-allowed') return
  recError = null
  console.log('restart')
  recognition.start()
}

recognition.onnomatch = function (event) {
  console.log(event)
}

recognition.onerror = function (event) {
  if(event.error === 'no-speech') return
  recError = event.error
  console.log(event)
}

async function response(result) {
  if(result && !shouldSkipCommand) {
    const keywords = Object.keys(commands)
    keyword = keywords.find(key => result.includes(key))
    if(keyword) shouldSkipCommand = true
    const r = keyword && await commands[keyword](result)
    if(keyword) setTimeout(()=> shouldSkipCommand = false, minNextCommandTime)
    if(r) speak(r)
  }
}