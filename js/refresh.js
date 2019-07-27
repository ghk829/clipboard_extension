function refreshStorage(){
    chrome.storage.sync.clear();
    alert("Refresh!!")
    window.location.reload();
}

var refresh = document.getElementById("refresh");

refresh.addEventListener("click",refreshStorage);