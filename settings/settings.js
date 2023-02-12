// Initialize CodeMirror DOM Element
const mcm = document.getElementById("editor");
var myCodeMirror = CodeMirror(mcm, {
  value: "",
  mode:  "javascript"
});
  var container = myCodeMirror.getWrapperElement().parentNode;
  myCodeMirror.setSize(container.clientWidth, container.clientHeight);

defaultPayload = {
  "continue": false,
  "instructions": "Replace with instructions",
  "prompt_fields": [
    {
      "field_label": "Field 1",
      "field_name": "field1",
      "field_type": "text"
    },
    {
      "field_label": "Field 2",
      "field_name": "field2",
      "field_type": "text"
    }
  ],
  "template": "Enter any prompt you want. You can use field values such as ${field1} and ${field2}",
  "title": "Enter a Title"
}

var selectedPayload = {};
container = null;

const chooser = document.getElementById("chooser");

chooser.addEventListener('change', function handleChange(event) {
grabJSONPayloadByName(event.target.value);
});

function getDefaultConfigValue() {
  return chrome.storage.local.get(["config"])
    .then(data => {
      const myTitle = JSON.parse(data.config).title;
      console.log("Inner Title: " + myTitle);
      return myTitle;
    })
    .catch(error => console.error(error));
}


getDefaultConfigValue().then(myTitle => {
  // Create Select box from localStorage
  chrome.storage.local.get(["recipes"]).then((result) => {
    console.log("value: " + myTitle);
    var values = result.recipes;
    values.forEach((key) => {
        var option = document.createElement('option');
        option.value = key.title;
        option.textContent = key.title;
        if (key.title == myTitle)
          option.selected = true;
        chooser.appendChild(option);
    });
    chooser.dispatchEvent(new Event("change"));
  });
});

document.getElementById("btn_configure").addEventListener("click", function(){
  selectedPayload = myCodeMirror.getValue();
  saveJSON(selectedPayload);
});

document.getElementById("btn_set").addEventListener("click", function(){
  selectedPayload = myCodeMirror.getValue();
  chrome.storage.local.set({'config': selectedPayload}, function() {
    alert("Configuration Updated");
  });    
});

document.getElementById("btn_delete").addEventListener("click", function(){
  selectedPayload = myCodeMirror.getValue();
  deleteJSON(selectedPayload);
});

document.getElementById("btn_reset").addEventListener("click", function(){
  chooser.value="Enter a Title";
  chooser.dispatchEvent(new Event("change"));
});


/* Function to Save/Add to storage
  ** Get recipies
  ** Cycle and match to current key.title
  ** If value is NEW then add new value to storage
  ** If found replace value with the key 
*/
function saveJSON(jsonpayload) {
  jptitle = JSON.parse(jsonpayload).title;
  console.log(jptitle);

  chrome.storage.local.get(["recipes"]).then((result) => {
    var records = result.recipes;
    var notfound = true;
    records.forEach((key,index) => {
      if(jptitle == key.title) {
          records[index] = JSON.parse(jsonpayload);
          notfound = false;
        }      
    }); 
    if (notfound) {
      records.push(JSON.parse(jsonpayload));
    }

    chrome.storage.local.set({'recipes': records}, function() {
      alert("Data Saved");
    });    

    console.log(records);
  });  

}

function deleteJSON(jsonpayload) {
  jptitle = JSON.parse(jsonpayload).title;
  console.log(jptitle);

  chrome.storage.local.get(["recipes"]).then((result) => {
    var records = result.recipes;
    var notfound = true;
    records.forEach((key,index) => {
      if(jptitle == key.title && key.title != "Enter a Title") {
          records.splice(index, 1);
        }      
    }); 

    chrome.storage.local.set({'recipes': records}, function() {
      alert("Recipe Deleted");
    });    

    console.log(records);
  });  

}

// Update Config Area
function updateConfigBox(jsonContent) {
  myCodeMirror.setValue(jsonContent);
}

// Cycles through the list of saved payloads and selects the payload by name
function grabJSONPayloadByName(payloadname) {
  console.log("Payload name is : " + payloadname);
    chrome.storage.local.get(["recipes"]).then((result) => {
      var values = result.recipes;   
        values.forEach((key) => {
          if(payloadname == key.title) {
              selectedPayload = JSON.stringify(key,null,2);
              updateConfigBox(selectedPayload);
            }
        });   
  });  
  
}