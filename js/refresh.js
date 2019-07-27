function refreshStorage(){
    chrome.storage.sync.clear();
    chrome.storage.local.clear();
    alert("Refresh!!")
    window.location.reload();
}

var refresh = document.getElementById("refresh");

refresh.addEventListener("click",refreshStorage);