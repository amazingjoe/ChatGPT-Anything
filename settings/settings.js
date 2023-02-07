payload = ["Key1","Key2"];
container = null;

chrome.storage.local.set({'recipes': JSON.stringify(payload)}, function() {
  });

// Get config.json and populate for viewing/editing
fetch('../config.json')
  .then(response => response.json())
  .then(data => {
    let jsonString = JSON.stringify(data);
    const configbox = document.getElementById("configuration");
    configbox.innerText = jsonString;
  })
  .catch(error => console.error(error));

// Create Select box from localStorage
chrome.storage.local.get(["recipes"]).then((result) => {
    container = document.getElementById("chooser");
    const select = document.createElement('select');
    select.id = "mySelect";
    
    document.body.appendChild(select);    
    var values = JSON.parse(result.recipes);
    values.forEach((key) => {
        var option = document.createElement('option');
        option.value = key;
        option.textContent = key;
        select.appendChild(option);
        alert(key);
    });
    
    container.appendChild(select);        
});

function createSelect() {

}