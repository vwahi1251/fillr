'use strict'
// Write your module here
// It must send an event "frames:loaded" from the top frame containing a list of { name:label } pairs,
// which describes all the fields in each frame.
function scrapeFields(frame) {
  const fields = [];
  const formElements = frame.contentDocument.querySelectorAll('input[name], select[name]');
  console.log(formElements);
  for (const element of formElements) {
    const name = element.getAttribute('name');
    const label = element.parentNode.querySelector('label')?.textContent || '';
    fields.push({ [name]: label });
  }
  return fields;
}
// This is a template to help you get started, feel free to make your own solution.
async function execute() {
	try {
    var fields = [];

    // Step 1 Scrape Fields and Create Fields list object.
    fields.push(scrapeFields(window.frame[0]));
    // Step 2 Add Listener for Top Frame to Receive Fields.
    if (isTopFrame()) {
      window.addEventListener('message', (event) => {
        // - Merge fields from frames.
        console.log("recived event", event);
        fields.push(event.data.fields);
        // - Process Fields and send event once all fields are collected.
        if(window.frames.length == 2) {
          console.log('loaded',framesFields);
          const framesLoadedEvent = new CustomEvent('frames:loaded', { detail: framesFields });
       
          window.dispatchEvent(framesLoadedEvent);
        }
      });
    } else if (!isTopFrame()) {
      await getTopFrame().postMessage(fields, "*");
    }
	} catch (e) {
		console.error(e)
	}
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