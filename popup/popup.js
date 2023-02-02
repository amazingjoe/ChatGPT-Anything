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


fetch('../config.json')
  .then(response => response.json())
  .then(data => {
    let jsonString = JSON.stringify(data);
    document.getElementById("apptitle").innerText = document.getElementById("apptitle").innerText + data.title;
    document.getElementById("appinstructions").innerText = document.getElementById("appinstructions").innerText + data.instructions;
    data.prompt_fields.forEach((key) => {
        struct.push(key.field_name);
        createElement(key);
    });
    // data variable is in JSON format
    payload = data;
  })
  .catch(error => console.error(error));

function createElement (datarow) {

    const inputWrap = document.createElement("div");
    inputWrap.classList.add("input-wrap");
    
    const input = document.createElement("input");
    input.classList.add("input");
    input.type = datarow.field_type;
    input.id = datarow.field_name;
    
    const animUtil = document.createElement("span");
    animUtil.classList.add("anim-uitl");
    
    const inputLabel = document.createElement("label");
    inputLabel.classList.add("input-label");
    inputLabel.innerText = datarow.field_label;
    
    inputWrap.appendChild(input);
    inputWrap.appendChild(animUtil);
    inputWrap.appendChild(inputLabel);

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
        console.log("Text copied to clipboard");
    }, function(err){
        console.error("Could not copy text: ", err);
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
        console.log("Value stored is : " + JSON.stringify(values));
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
        console.log("Value currently is " + result.datastore);
      });
});