'use strict'
// Write your module here
// It must send an event "frames:loaded" from the top frame containing a list of { name:label } pairs,
// which describes all the fields in each frame.

// This is a template to help you get started, feel free to make your own solution.
function execute() {
	try {
    // Step 1 Scrape Fields and Create Fields list object.
    var fields = scrapeFields()
    console.log(fields);
    // Step 2 Add Listener for Top Frame to Receive Fields.
    if (isTopFrame()) {
      const framesFields = [];
      window.addEventListener('message', (event) => {
        // - Merge fields from frames.
        console.log('another event',event.data);
         framesFields.push(event.data);
        // - Process Fields and send event once all fields are collected.
        if (framesFields.length === window.frames.length) {
          // Process Fields and send event once all fields are collected.
          const allFields = framesFields.reduce((acc, curr) => [...acc, ...curr], []);
          const framesLoadedEvent = new CustomEvent('frames:loaded', { detail: allFields });
          window.dispatchEvent(framesLoadedEvent);
      }
      });

      Array.from(window.frames).forEach((frame, index) => {
        frame.postMessage('startScraping', '*');
        console.log(frame.name);
    });
    } else if (!isTopFrame()) {
      // Child frames sends Fields up to Top Frame.
      getTopFrame().postMessage(scrapeFields(), '*');
    }
	} catch (e) {
		console.error(e)
	}
}

function scrapeFields() {
  const fields = document.querySelectorAll('input[name], select[name]');
  console.log(fields);
  const fieldsList = Array.from(fields).map(field => ({ name: field.name, label: field.labels?.[0]?.innerText || field.name }));
  return fieldsList;
}

execute();

// Utility functions to check and get the top frame
// as Karma test framework changes top & context frames.
// Use this instead of "window.top".
function getTopFrame() {
  return window.top.frames[0];
}

function isTopFrame() {
  return window.location.pathname == '/context.html';
}