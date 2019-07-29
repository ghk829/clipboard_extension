function refreshMessage(){
    toastr.info("refresh");
    return new Promise(function(resolve,reject){
        resolve();
    })
}

function refreshStorage(){
    
    chrome.storage.sync.clear();
    chrome.storage.local.clear();

    refreshMessage().then(function(){
        setTimeout(function(){
            window.location.reload();
        },1000)
        
    })
}

var refresh = document.getElementById("refresh");

refresh.addEventListener("click",refreshStorage);