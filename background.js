function saveToStore(store){
    chrome.storage.sync.set(store, function(err) {
        if(chrome.runtime.lastError) {
            
            if (chrome.runtime.lastError.message == "QUOTA_BYTES_PER_ITEM quota exceeded"){
                alert("Text is above the limit. It's not synced by browsers")
            }

            chrome.storage.local.set(store,function(err){
                if (chrome.runtime.lastError){

                    if (chrome.runtime.lastError.message == "QUOTA_BYTES quota exceeded"){
                        alert("Text is above the limit. It's not saved in browser")
                    }
                }
            })

          } else {
              alert("paste to clipboard")
          }

    });
}

function toDataUrl(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        var reader = new FileReader();
        reader.onloadend = function() {
            callback(reader.result);
        }
        reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
}

chrome.commands.onCommand.addListener(function(command) {
    chrome.tabs.executeScript( {
        code: "window.getSelection().toString();"
      }, function(selection) {
        var dt = new Date();
        var key = dt.toLocaleString();
        var text = selection;
        var store = {}
        store[key] = text;
        saveToStore(store);
      });
    
  });

chrome.contextMenus.create({
    title: "paste to clipboard", 
    contexts:["image","selection"], 
    onclick: function(info, tab) {
        var store = {}
        var dt = new Date();
        var key = dt.toLocaleString();
        if (info.srcUrl){
            toDataUrl(info.srcUrl,function(base64){
                store[key]= base64;
                saveToStore(store);
            });
        }else{
            var text = info.selectionText;
            store[key] = text;
            saveToStore(store);
        }
        
    }  
});