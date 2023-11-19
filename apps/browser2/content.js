const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playAudio(audioBuffer) {
  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(audioContext.destination);
  source.start(0);
}

const link = document.createElement('link');
link.href = chrome.runtime.getURL('inject.css');
link.type = 'text/css';
link.rel = 'stylesheet';
document.head.appendChild(link);
let currentDiv = null;
const regexPattern = /✦ (\S+)(?: (.*))?/;

// This function is executed in the context of the web page
const elementsToModify = document.querySelectorAll('.pl-c');
const elementToModify2 = document.querySelector('.cpgGLU');

// Change pointer-events to 'all'
if (elementToModify2) {
  elementToModify2.style.pointerEvents = 'all';
}

elementsToModify.forEach((elementToModify) => {
  const value = elementToModify.attributes
    .getNamedItem('data-code-text')
    .value.replace('// ', '')
    .match(regexPattern);
  console.log(value);
  if (value) {
    const newDiv = document.createElement('div');
    newDiv.textContent = value[1];
    newDiv.innerHTML = `<div>
            <img width="100" height="100" src="https://media.istockphoto.com/id/828156368/photo/demo.jpg?b=1&s=612x612&w=0&k=20&c=fwGLkagXU0tubB6mjGZltySb0I8f1-z0T-mo-4Yq_6Y=" alt="play--v1"/>
            </div>`;
    newDiv.classList.add('cmtpopup');

    // Event listener for the image within newDiv
    newDiv.querySelector('img').addEventListener('click', () => {
      chrome.runtime.sendMessage(
        {
          action: 'get_play',
          url: 'https://samplelib.com/lib/preview/mp3/sample-6s.mp3',
        },
        (data) => {
          console.log(data);
          const arrayBuffer = audioContext.decodeAudioData(data.url);

          playAudio(arrayBuffer);
        }
      );
    });

    elementToModify.parentElement.insertBefore(newDiv, elementToModify);

    // Insert the new div before each elementToModify
    elementToModify.parentElement.insertBefore(newDiv, elementToModify);

    // Toggle the newDiv's visibility on mouseenter for each element
    elementToModify.addEventListener('mouseenter', () => {
      if (currentDiv) {
        currentDiv.style.display = 'none'; // Hide the previously displayed div
      }
      newDiv.style.display = 'block'; // Show the current div
      currentDiv = newDiv; // Update the current div
    });
    // Toggle the newDiv's visibility on mouseleave for each element
    // elementToModify.addEventListener('mouseleave', () => {
    //   newDiv.style.display = 'none';
    // });
    elementToModify.position = 'absolute';
    elementToModify.style.zIndex = '0';
    elementToModify.style.cursor = 'pointer';
  }
});
