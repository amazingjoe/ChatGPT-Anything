

// btn_clipboardcopy is the ID of the button. When it is pressed we will copy the input value to the clipboard.
document.getElementById("btn_clipboardcopy").addEventListener("click", function(){
    console.log("Running clipboard!");
    var prompt = document.getElementById("prompt");
    var job = prompt.value;
    var template = `Write me a sample cover letter to obtain a ${job} job`
    var entry = template;
    navigator.clipboard.writeText(entry).then(function(){
        console.log("Text copied to clipboard");
    }, function(err){
        console.error("Could not copy text: ", err);
    });
});

// btn_storeinfo is the ID of the button. When it is pressed we will store the input value using chrom.storage.local.
document.getElementById("btn_storeinfo").addEventListener("click", function(){
    var prompt = document.getElementById("prompt").value;
    console.log("Entry value is : " + prompt);
    chrome.storage.local.set({'datastore': prompt}, function() {
        console.log("Value stored is : " + prompt);
      });
});

// btn_storeinfo is the ID of the button. When it is pressed we will store the input value using chrom.storage.local.
document.getElementById("btn_loadinfo").addEventListener("click", function(){
    chrome.storage.local.get(["datastore"]).then((result) => {
        var prompt = document.getElementById("prompt");
        prompt.value = result.datastore;
        console.log("Value currently is " + result.datastore);
      });
});