defaultPayload = {
  "title" : "Enter your title here",
  "instructions" : "Replace with instructions",
  "prompt_fields" : [
      {
          "field_type":"text",
          "field_name":"field1",
          "field_label":"Field 1"
      },
      {
          "field_type":"text",
          "field_name":"field2",
          "field_label":"Field 2"
      }
  ],
  "template" : "Enter any prompt you want. You can use field values such as ${field1} and ${field2}",
  "continue" : false
}

payload = [{
  "title" : "Job Cover Letter Maker",
  "instructions" : "Enter the information for the fields below",
  "prompt_fields" : [
      {
          "field_type":"text",
          "field_name":"job_title",
          "field_label":"Job Title"
      },
      {
          "field_type":"text",
          "field_name":"name",
          "field_label":"Candidate Name"
      }
  ],
  "template" : "My name is ${name}. Write me a sample cover letter to obtain a ${job_title} job",
  "continue" : false
},{
  "title" : "Kids Story Writer",
  "instructions" : "Enter the information for the fields below",
  "prompt_fields" : [
      {
          "field_type":"text",
          "field_name":"story_name",
          "field_label":"Title"
      },
      {
          "field_type":"text",
          "field_name":"about",
          "field_label":"What is the story about?"
      }
  ],
  "template" : "Write a kids story titled ${story_name}. Here is a summary: ${about}",
  "continue" : false
}];

var selectedPayload = {};
container = null;


//** Need to replace this section with a write to the local storage */
function updateConfig(body) {
  chrome.fileSystem.getWritableEntry('config.json', function(writableFileEntry) {
    writableFileEntry.createWriter(function(writer) {
      var stringToWrite = body;
      var blob = new Blob([stringToWrite], {type: 'text/plain'});
      writer.write(blob);
    });
  });
}

chrome.storage.local.set({'recipes': JSON.stringify(payload)}, function() {
  });

// Get config.json and populate for viewing/editing
fetch('../config.json')
  .then(response => response.json())
  .then(data => {
    let jsonString = JSON.stringify(data);
    updateConfigBox(jsonString);
  })
  .catch(error => console.error(error));

// Create Select box from localStorage
chrome.storage.local.get(["recipes"]).then((result) => {
    container = document.getElementById("chooser");
    const select = document.createElement('select');
    select.id = "mySelect";
    
    document.body.appendChild(select);
    // Add default value for new
    var option = document.createElement('option');
    option.value = "New";
    option.textContent = "New";
    select.appendChild(option);

    var values = JSON.parse(result.recipes);
    values.forEach((key) => {
        var option = document.createElement('option');
        option.value = key.title;
        option.textContent = key.title;
        select.appendChild(option);
    });
    
    container.appendChild(select);        
});

const chooser = document.getElementById("chooser");

chooser.addEventListener('change', function handleChange(event) {
  grabJSONPayloadByName(event.target.value);
});

document.getElementById("btn_configure").addEventListener("click", function(){
  var configbox = document.getElementById("configuration");
  selectedPayload = configbox.value;
  updateConfig(selectedPayload);
});

// Update Config Area
function updateConfigBox(jsonContent) {
  var configbox = document.getElementById("configuration");
  configbox.innerText = jsonContent;  
}

// Cycles through the list of saved payloads and selects the payload by name
function grabJSONPayloadByName(payloadname) {
  console.log("Payload name is : " + payloadname);
    chrome.storage.local.get(["recipes"]).then((result) => {
      var values = JSON.parse(result.recipes);
      if(payloadname == "New") {
        selectedPayload = JSON.stringify(defaultPayload);
        updateConfigBox(selectedPayload);
      } else {      
        values.forEach((key) => {
          if(payloadname == key.title) {
              selectedPayload = JSON.stringify(key);
              updateConfigBox(selectedPayload);
            }
        });  
      } 
  });  
  
}