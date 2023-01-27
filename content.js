// btn_clipboardcopy is the ID of the button. When it is pressed we will copy the input value to the clipboard.
document.getElementById("btn_clipboardcopy").addEventListener("click", function(){
    var prompt = document.getElementById("prompt");
    var entry = prompt.value;
    navigator.clipboard.writeText(entry).then(function(){
        console.log("Text copied to clipboard");
    }, function(err){
        console.error("Could not copy text: ", err);
    });
});

// btn_storeinfo is the ID of the button. When it is pressed we will store the input value using chrom.storage.local.
document.getElementById("btn_storeinfo").addEventListener("click", function(){
    var prompt = document.getElementById("prompt");
    var entry = 'TEST!'; //prompt.value;
    chrome.storage.local.set({'datastore': entry}, function() {
        console.log("Value stored");
      });
});

// btn_storeinfo is the ID of the button. When it is pressed we will store the input value using chrom.storage.local.
document.getElementById("btn_loadinfo").addEventListener("click", function(){
    chrome.storage.local.get(['datastore'], function(result) {
        if(chrome.runtime.lastError){
            console.log("No value found")
        }else if(result.myvalue){
            // Value found lets display it in the input box
            var prompt = document.getElementById("prompt");
            prompt.value = result;

        }else{
            console.log("No value found")
        }
    });
});