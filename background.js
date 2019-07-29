chrome.commands.onCommand.addListener(function(command) {
    chrome.tabs.executeScript( {
        code: "window.getSelection().toString();"
      }, function(selection) {
        var dt = new Date();
        var key = dt.toLocaleString();
        var text = selection;
        var store = {}
        store[key] = text;
        chrome.storage.sync.set(store, function(err) {
            if(chrome.runtime.lastError) {
                
                if (chrome.runtime.lastError.message == "QUOTA_BYTES_PER_ITEM quota exceeded"){
                    toastr.error("Text is above the limit. It's not synced by browsers")
                }

                chrome.storage.local.set(store,function(err){
                    if (chrome.runtime.lastError){

                        if (chrome.runtime.lastError.message == "QUOTA_BYTES quota exceeded"){
                            toastr.error("Text is above the limit. It's not saved in browser")
                        }
                    }
                })

              } else {
                  toastr.success("paste to clipboard")
              }

        });
      });
    
  });

chrome.contextMenus.create({
    title: "paste to clipboard", 
    contexts:["selection"], 
    onclick: function(info, tab) {
        var dt = new Date();
        var key = dt.toLocaleString();
        var text = info.selectionText;
        var store = {}
        store[key] = text;
        chrome.storage.sync.set(store, function(err) {
            if(chrome.runtime.lastError) {
                
                if (chrome.runtime.lastError.message == "QUOTA_BYTES_PER_ITEM quota exceeded"){
                    toastr.error("Text is above the limit. It's not synced by browsers")
                }

                chrome.storage.local.set(store,function(err){
                    if (chrome.runtime.lastError){

                        if (chrome.runtime.lastError.message == "QUOTA_BYTES quota exceeded"){
                            toastr.error("Text is above the limit. It's not saved in browser")
                        }
                    }
                })

              } else {
                  toastr.success("paste to clipboard")
              }

        });
    }  
});