# Fillr JS Engineer Code Test

- Edit widget.js to create a JS 'widget' module that is executed on each frame. The widget should extract the names and labels for each html form control in the document. Each frame is already configured to load the widget script from widget/widget.js.

- The top frame must collect the entire list of fields from all documents, including all descendent frames. The list of fields should be ordered by field 'name' in ascending order. See get_fields_test.js for the expected output.

- When your widget has collected all the fields from all the frames, trigger a CustomEvent on the top frame document named 'frames:loaded' with a property named 'fields' within the detail.

- To run the test, make sure you have npm installed, and execute `./run/test`.

Notes:

- Only edit the widget.js file!
- You should use postMessage to communicate between iframes.
- The frame documents should not be edited.
- The test case should not be changed.
- Karma config should not be edited.
- The test must pass 100% of the times it is run (assuming no network errors).


## Solution Outline

1. **Scrape Fields**: Implement the `scrapeFields` function to fetch input and select fields from forms.
2. **Inter-iframe Communication**: Achieve communication between iframes using the `postMessage` function.
3. **Event Listener**: Implement an additional event listener for handling the `frames:loaded` event, ensuring data aggregation and processing are correctly managed.