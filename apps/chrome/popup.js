chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  chrome.scripting.executeScript({
    target: { tabId: tabs[0].id },
    function: () => {
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
        //   newDiv.innerHTML = `<div class="audio_container">
        //       <img width="10" height="10" src="https://img.icons8.com/ios-glyphs/10/ffffff/play--v1.png" alt="play--v1"/>
        //       </div>`;
          newDiv.classList.add('cmtpopup');

          // Event listener for the image within newDiv
        //   newDiv.querySelector('img').addEventListener('click', () => {
        //     // 0
        //   });

          elementToModify.parentElement.insertBefore(newDiv, elementToModify);

          // Insert the new div before each elementToModify
          //   elementToModify.parentElement.insertBefore(newDiv, elementToModify);

          // Toggle the newDiv's visibility on mouseenter for each element
          elementToModify.addEventListener('mouseenter', () => {
            if (currentDiv) {
              currentDiv.style.display = 'none'; // Hide the previously displayed div
            }
            newDiv.style.display = 'block'; // Show the current div
            currentDiv = newDiv; // Update the current div
          });
          // Toggle the newDiv's visibility on mouseleave for each element
          elementToModify.addEventListener('mouseleave', () => {
            newDiv.style.display = 'none';
          });
          elementToModify.position = 'absolute';
          elementToModify.style.zIndex = '0';
          elementToModify.style.cursor = 'pointer';
        }
      });
    },
  });
  chrome.scripting.insertCSS({
    target: { tabId: tabs[0].id },
    files: ['inject.css'], // Replace 'your-styles.css' with the actual file path or CSS content you want to inject
  });
});
