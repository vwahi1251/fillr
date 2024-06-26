"use strict";
// Write your module here
// It must send an event "frames:loaded" from the top frame containing a list of { name:label } pairs,
// which describes all the fields in each frame.
function countNestedFrames() {
  let count = 1; // Start with 1 for the top frame
  function traverseFrames(window) {
    const frames = window.frames;
    for (let i = 0; i < frames.length; i++) {
      count++; // Increment count for each frame
      traverseFrames(frames[i]);
    }
  }
  traverseFrames(window);
  return count;
}
// This is a template to help you get started, feel free to make your own solution.
function execute() {
  let framesFields; //variable used to get all the fields
  let frameCount = 0;

  try {
    // Step 1 Scrape Fields and Create Fields list object.
    var fields = scrapeFields();
    // Step 2 Add Listener for Top Frame to Receive Fields.
    if (isTopFrame()) {
      framesFields = [...fields];
      const nestedFrameCount = countNestedFrames();

      //Event listener on parent
      window.addEventListener("message", (event) => {
        if (event.data && event.data.fromFrame) {
          // Increment frame count
          frameCount++;

          // Merge fields from frames.
          framesFields.push(...event.data.fields);

          // - Process Fields and send event once all fields are collected.

          // If all frames have sent their data, process fields and send event
          if (frameCount === nestedFrameCount) {
            const framesLoadedEvent = new CustomEvent("frames:loaded", {
              detail: { fields: framesFields.sort(sortByKey) },
            });
            document.dispatchEvent(framesLoadedEvent);
          }
        }
      });
    } else if (!isTopFrame()) {
      // Child frames sends Fields up to Top Frame.
      getTopFrame().postMessage({ fields: fields, fromFrame: true }, "*"); //fromFrame used to tell function if it's inside frame
    }
  } catch (e) {
    console.error(e);
  }
}

//sort the fields in required order
function sortByKey(a, b) {
  // Define the custom order of the keys

  const order = [
    "address_line_1",
    "cc_number",
    "cc_type",
    "country",
    "first_name",
    "last_name",
  ];

  const keyA = Object.keys(a)[0];
  const keyB = Object.keys(b)[0];

  // Compare the index of the keys in the 'order' array
  const indexA = order.indexOf(keyA);
  const indexB = order.indexOf(keyB);

  return indexA - indexB;
}
//Fetch all the scrape fields
function scrapeFields() {
  const fields = document.querySelectorAll("input[name], select[name]");
  const fieldsList = Array.from(fields).map((field) => ({
    [field.name]: field.labels?.[0]?.innerText || field.name,
  }));
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
  return window.location.pathname == "/context.html";
}
