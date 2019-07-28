/**
 * This handler retrieves the images from the clipboard as a base64 string and returns it in a callback.
 * 
 * @param pasteEvent 
 * @param callback 
 */

function retrieveImageFromClipboardAsBase64(pasteEvent, callback, imageFormat){
	if(pasteEvent.clipboardData == false){
        if(typeof(callback) == "function"){
            callback(undefined);
        }
    };

    var items = pasteEvent.clipboardData.items;

    if(items == undefined){
        if(typeof(callback) == "function"){
            callback(undefined);
        }
    };

    for (var i = 0; i < items.length; i++) {
        // Skip content if not image
        if (items[i].type.indexOf("image") > -1){

        }
        else if (items[i].type.indexOf("text/plain")!= -1){
            items[i].getAsString(callback);
            continue;
        }else{
            continue;
        }
        // Retrieve image on clipboard as blob
        var blob = items[i].getAsFile();

        // Create an abstract canvas and get context
        var mycanvas = document.createElement("canvas");
        var ctx = mycanvas.getContext('2d');
        
        // Create an image
        var img = new Image();

        // Once the image loads, render the img on the canvas
        img.onload = function(){
            // Update dimensions of the canvas with the dimensions of the image
            mycanvas.width = this.width;
            mycanvas.height = this.height;

            // Draw the image
            ctx.drawImage(img, 0, 0);

            // Execute callback with the base64 URI of the image
            if(typeof(callback) == "function"){
                callback(mycanvas.toDataURL(
                    (imageFormat || "image/png")
                ));
            }
        };

        // Crossbrowser support for URL
        var URLObj = window.URL || window.webkitURL;

        // Creates a DOMString containing a URL representing the object given in the parameter
        // namely the original Blob
        img.src = URLObj.createObjectURL(blob);
        // return mycanvas.toDataURL(URLObj.createObjectURL(blob))
    }
}

function pasteCallback(imageDataBase64){
    // If there's an image, open it in the browser as a new window :)

    var dt = new Date();
    var key = dt.toLocaleString()

    if(imageDataBase64){
        // data:image/png;base64,iVBORw0KGgoAAAAN......
        var tr = document.createElement("tr");
        var name = document.createElement("td");
        var name_ = document.createTextNode(key)
        name.appendChild(name_);
        var value = document.createElement("td");
        var button = document.createElement("button");
        button.type= "button";
        button.className = "btn btn-primary";
        button.innerHTML = "copy"
        $(button).bind("click",function(e){
            var input = $(this).next()[0]
            input.select();
            document.execCommand("copy");
            /* Alert the copied text */
            alert("Copied the text");
        });
        value.appendChild(button);
        var value_ = document.createElement("textarea")
        value_.value= imageDataBase64;
        value_.className = "form-control"
        value_.style = "resize : horizontal;width:150px;"
        value.appendChild(value_);
        
        tr.appendChild(name);
        tr.appendChild(value);
        
        if (value_.value.startsWith("data:image/")){
            var img = document.createElement("td");
            var img_ = document.createElement("img");
            img_.src= value_.value;
            img_.height="90";
            img_.width="90";
            img.appendChild(img_)
            tr.appendChild(img)
        } else if (value_.value.startsWith("https://youtu.be")){
            var td = document.createElement("td")
            var youtube = document.createElement("iframe");
            var src = "https://www.youtube.com/embed/"+value_.value.split("youtu.be/")[1]
            youtube.src= src
            youtube.height="90";
            youtube.width="90";
            td.appendChild(youtube);
            tr.appendChild(td)

        }


        var items = document.getElementById("items");
        items.appendChild(tr);
        var store = {}
        store[key] = imageDataBase64;
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

              }

        });

    }}


window.addEventListener("paste", function(e){
    var url = retrieveImageFromClipboardAsBase64(e,pasteCallback);
    }, false);


chrome.storage.sync.get(null,function(elements){

    for (e in elements){
        var tr = document.createElement("tr");
        var name = document.createElement("td");
        var name_ = document.createTextNode(e)
        name.appendChild(name_);
        var value = document.createElement("td");
        var button = document.createElement("button");
        button.type= "button";
        button.className = "btn btn-primary";
        button.innerHTML = "copy"
        $(button).bind("click",function(e){
            var input = $(this).next()[0]
            input.select();
            document.execCommand("copy");
            /* Alert the copied text */
            alert("Copied the text");
        });

        value.appendChild(button);
        var value_ = document.createElement("textarea")
        value_.value= elements[e];
        value_.className = "form-control"
        value.className="form-group purple-border"
        value_.style = "resize : horizontal;width:150px;"
        value.appendChild(value_);

        tr.appendChild(name);
        tr.appendChild(value);
        
        if (value_.value.startsWith("data:image/")){
            var img = document.createElement("td");
            var img_ = document.createElement("img");
            img_.src= value_.value;
            img_.height="90";
            img_.width="90";
            img.appendChild(img_)
            tr.appendChild(img)
        } else if (value_.value.startsWith("https://youtu.be")){
            var td = document.createElement("td")
            var youtube = document.createElement("iframe");
            var src = "https://www.youtube.com/embed/"+value_.value.split("youtu.be/")[1]
            youtube.src= src
            youtube.height="90";
            youtube.width="90";
            td.appendChild(youtube);
            tr.appendChild(td)

        }
        
        var items = document.getElementById("items");
        items.appendChild(tr);
    }

})



chrome.storage.local.get(null,function(elements){

    for (e in elements){
        var tr = document.createElement("tr");
        var name = document.createElement("td");
        var name_ = document.createTextNode(e)
        name.appendChild(name_);
        var value = document.createElement("td");
        var button = document.createElement("button");
        button.type= "button";
        button.className = "btn btn-primary";
        button.innerHTML = "copy"
        $(button).bind("click",function(e){
            var input = $(this).next()[0]
            input.select();
            document.execCommand("copy");
            /* Alert the copied text */
            alert("Copied the text");
        });

        value.appendChild(button);
        var value_ = document.createElement("textarea")
        value_.value= elements[e];
        value_.className = "form-control"
        value_.style = "resize : horizontal;width:150px;"
        // value.className = "form-group shadow-textarea"
        value.appendChild(value_);

        tr.appendChild(name);
        tr.appendChild(value);

        if (value_.value.startsWith("data:image/")){
            var img = document.createElement("td");
            var img_ = document.createElement("img");
            img_.src= value_.value;
            img_.height="90";
            img_.width="90";
            img.appendChild(img_)
            tr.appendChild(img)
        } else if (value_.value.startsWith("https://youtu.be")){
            var td = document.createElement("td")
            var youtube = document.createElement("iframe");
            var src = "https://www.youtube.com/embed/"+value_.value.split("youtu.be/")[1]
            youtube.src= src
            youtube.height="90";
            youtube.width="90";
            td.appendChild(youtube);
            tr.appendChild(td)

        }
        var items = document.getElementById("items");
        items.appendChild(tr);
    }

})