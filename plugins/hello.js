// static variables
var host = "https://scheduler-extension.herokuapp.com"
var host = "http://localhost:3000";

chrome.contextMenus.create({
    title: "add schedule", 
    contexts:["selection"], 
    onclick: function(info, tab) {
        // var popUrl = chrome.runtime.getURL("hello.html")
        // var popOption = "width=370, height=360, resizable=no, scrollbars=no, status=no;";    //팝업창 옵션(optoin)

        //window.open(popUrl,"",popOption);
        var xhr = new XMLHttpRequest();
        xhr.open("GET", host, true);
        xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
        // JSON.parse does not evaluate the attacker's scripts.

            var resp = JSON.parse(xhr.responseText);
            var popOption = "width=370, height=360, resizable=yes, scrollbars=no, status=no;";
            window.open(resp.oauth2Url,"",popOption);
        }else{
        console.log(xhr)
        }
}
        xhr.send();
    }  
});



// var xhr = new XMLHttpRequest();
//         xhr.open("GET", host, true);
//         xhr.onreadystatechange = function() {
//         if (xhr.readyState == 4) {
//         // JSON.parse does not evaluate the attacker's scripts.
//             alert(xhr.responseText);
//             var resp = JSON.parse(xhr.responseText);
//         }else{
//         console.log(xhr)
//         }
// }
//         xhr.send();