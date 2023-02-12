// ToDos
// * Add Select Functionality

var payload = {};
var struct = [];
var values = [];

function interpolate(template, objarr) {
    str = template;
    objarr.forEach((key, i) => {
      str = str.replace("${" + key.label + "}",key.value);
      console.log(key.label + " : " + key.value);
    });
    console.log("template : " + str);
    return str;
}

  chrome.storage.local.get(["config"])
  .then(data => {
    let jsonString = JSON.parse(data.config);
    document.getElementById("apptitle").innerText = document.getElementById("apptitle").innerText + jsonString.title;
    document.getElementById("appinstructions").innerText = document.getElementById("appinstructions").innerText + jsonString.instructions;
    jsonString.prompt_fields.forEach((key) => {
        struct.push(key.field_name);
        createElement(key);
    });

    if (jsonString.continue != false) {
        console.log("JSON CONTINUE IS : " + jsonString.continue)
        var btn_continue = document.getElementById("btn_clipboardcopy2");
        btn_continue.classList.remove("hideme");
    }
    // data variable is in JSON format
    payload = jsonString;
  })
  .catch(error => console.error(error));

function createElement (datarow) {

    const inputWrap = document.createElement("div");
    inputWrap.classList.add("field");
    
    var input;
    // If text Input field
    if (datarow.field_type == "text") {
        input = document.createElement("input");
        input.classList.add("input");
        input.type = datarow.field_type;
        input.id = datarow.field_name;
    }
    
    // If textarea field
    if (datarow.field_type == "textarea") {
        input = document.createElement("textarea");
        input.classList.add("textarea");
        input.rows = "5";
        input.id = datarow.field_name;
    }

    const animUtil = document.createElement("span");
    animUtil.classList.add("anim-uitl");
    
    const inputLabel = document.createElement("label");
    inputLabel.classList.add("label");
    inputLabel.innerText = datarow.field_label;
    
    inputWrap.appendChild(inputLabel);
    inputWrap.appendChild(input);
    inputWrap.appendChild(animUtil);
    

    var app = document.getElementById("field-wrap");
    app.appendChild(inputWrap);

}

function getDOMValue(key) {
    return document.getElementById(key);
}


// btn_clipboardcopy is the ID of the button. When it is pressed we will copy the input value to the clipboard.	
document.getElementById("btn_clipboardcopy").addEventListener("click", function(){	
    console.log("Running clipboard!");	
    console.log("Template is : " + payload.template);	
    	
    struct.forEach((key) => {	
        values.push({"label":key,"value":getDOMValue(key).value});	
        console.log(key);	
    });	
    	
    var template = interpolate(payload.template,values);	
    var entry = template;	
    navigator.clipboard.writeText(entry).then(function(){	
        alert("Prompt copied to clipboard. Please paste into ChatGPT");	
    }, function(err){	
        alert("Could not copy text: ", err);	
    });	
});	
// btn_clipboardcopy2 is the ID of the button. When it is pressed we will copy the continuation value to the clipboard.	
document.getElementById("btn_clipboardcopy2").addEventListener("click", function(){   	
    var entry = payload.continue;	
    navigator.clipboard.writeText(entry).then(function(){	
        alert("Continuation copied to clipboard. Please paste into ChatGPT");	
    }, function(err){	
        alert("Could not copy text: ", err);	
    });	
});

// btn_storeinfo is the ID of the button. When it is pressed we will store the input value using chrom.storage.local.
document.getElementById("btn_storeinfo").addEventListener("click", function(){
    var values = [];
    struct.forEach((key) => {
        values.push({"label":key,"value":getDOMValue(key).value});
        console.log(key);
    });
    
    chrome.storage.local.set({'datastore': JSON.stringify(values)}, function() {
        alert("Data Saved");
      });
});

// btn_storeinfo is the ID of the button. When it is pressed we will store the input value using chrom.storage.local.
document.getElementById("btn_loadinfo").addEventListener("click", function(){
    chrome.storage.local.get(["datastore"]).then((result) => {
        var values = JSON.parse(result.datastore);
        values.forEach((key) => {
            myElement = getDOMValue(key.label);
            myElement.value = key.value;
        });        
        alert("Data Loaded");
      });
});