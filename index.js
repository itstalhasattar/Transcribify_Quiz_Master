const startRecordButton = document.getElementById("startRecord");
const stopRecordButton = document.getElementById("stopRecord");
const saveRecordButton = document.getElementById("saveRecord");
const audioPlayer = document.getElementById("audioPlayer");
const transcriptElement = document.getElementById("transcript");
// const recognition = new SpeechRecognition();
let audioStream;
let mediaRecorder;
let audioChunks = [];

startRecordButton.addEventListener("click", async () => {
  audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorder = new MediaRecorder(audioStream);

  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      audioChunks.push(event.data);
    }
  };

  mediaRecorder.onstop = () => {
    const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
    audioPlayer.src = URL.createObjectURL(audioBlob);
  };

  mediaRecorder.start();
  startRecordButton.disabled = true;
  stopRecordButton.disabled = false;
  saveRecordButton.disabled = true;
});
startRecordButton.addEventListener("click", function () {
  var Speech = true;
  window.SpeechRecognition = window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.addEventListener("result", (e) => {
    const text = Array.from(e.results)
      .map((result) => result[0])
      .map((result) => result.transcript);

    transcript.innerHTML = text;
  });
  if (Speech == true) {
    recognition.start();
  }
  stopRecordButton.addEventListener("click", () => {
    recognition.stop();
  });
});
stopRecordButton.addEventListener("click", () => {
  mediaRecorder.stop();
  startRecordButton.disabled = false;
  stopRecordButton.disabled = true;
  saveRecordButton.disabled = false;
});

saveRecordButton.addEventListener("click", () => {
  const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
  const url = URL.createObjectURL(audioBlob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "recording.wav";
  a.click();
});
const text1 = document.querySelector("transcript"),
  toText = document.querySelector("translate_div"),
  // exchageIcon = document.querySelector(".exchange"),
  selectTag = document.querySelectorAll("select");
// icons = document.querySelectorAll("row i");
(translateBtn = document.querySelector("btntranslate")),
  selectTag.forEach((tag, id) => {
    for (let country_code in countries) {
      let selected =
        id == 0
          ? country_code == "en-GB"
            ? "selected"
            : ""
          : country_code == "hi-IN"
          ? "selected"
          : "";
      let option = `<option ${selected} value="${country_code}">${countries[country_code]}</option>`;
      tag.insertAdjacentHTML("beforeend", option);
      // console.print(country_code);
    }
    console.log(tag);
  });
text1.addEventListener("keyup", () => {
  if (!text1.value) {
    toText.value = "";
  }
});
translateBtn.addEventListener("click", () => {
  let text = fromText.value.trim(),
    translateFrom = selectTag[0].value,
    translateTo = selectTag[1].value;
  if (!text) return;
  toText.setAttribute("placeholder", "Translating...");
  let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
  fetch(apiUrl)
    .then((res) => res.json())
    .then((data) => {
      toText.value = data.responseData.translatedText;
      data.matches.forEach((data) => {
        if (data.id === 0) {
          toText.value = data.translation;
        }
      });
      toText.setAttribute("placeholder", "Translation");
    });
});
