console.log('background.js');

// Function to fetch audio from a URL
async function fetchAudio(audioURL) {
  try {
    const response = await fetch(audioURL);
    const arrayBuffer = await response.arrayBuffer();
    return arrayBuffer;
  } catch (error) {
    console.error('Error fetching audio:', error);
    throw error;
  }
}

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  console.log(message);
  if (message?.action && message.action === 'get_play') {
    try {
      const audioBuffer = await fetchAudio(message.url);
      sendResponse({
        action: 'play',
        url: audioBuffer,
      });
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  }
});
