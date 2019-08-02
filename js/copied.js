/**
 * This handler retrieves the images from the clipboard as a base64 string and returns it in a callback.
 *
 * @param pasteEvent
 * @param callback
 */

toastr.options.positionClass = "toast-bottom-right"
toastr.options.timeOut = 500;


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
            toastr.info("Copied the text");
        });
        value.appendChild(button);
        var value_ = document.createElement("textarea")
        value_.value= imageDataBase64;
        value_.className = "form-control"
        value_.style = "resize : horizontal;width:150px;"
        value_.readOnly = true;
        value.appendChild(value_);

        tr.appendChild(name);
        tr.appendChild(value);

        var td = document.createElement("td");

        if (value_.value.startsWith("data:image/")){
            var img_ = document.createElement("img");
            img_.src= value_.value;
            img_.height="100";
            img_.width="100";
            td.appendChild(img_)
        } else if (value_.value.startsWith("https://youtu.be")){
            var youtube = document.createElement("iframe");
            var src = "https://www.youtube.com/embed/"+value_.value.split("youtu.be/")[1]
            youtube.src= src
            youtube.height="100";
            youtube.width="100";
            td.appendChild(youtube);


        }
        tr.appendChild(td)

        var del = document.createElement("td");
        var del_ = document.createElement("button");
        del_.type= "button";
        del_.className = "btn btn-danger";
        del_.innerHTML = "delete"
        del.appendChild(del_);

        var del = document.createElement("td");
        var del_ = document.createElement("button");
        del_.type= "button";
        del_.className = "btn btn-danger";
        del_.innerHTML = "delete"
        del.appendChild(del_);

        $(del_).bind("click",function(e){
            var parent = this.parentElement.parentElement
            var removed = $('td:nth-child(1)',parent)[0]
            var cellId = removed.innerText
            if (removed.storageLocation == "sync"){
                chrome.storage.sync.remove(cellId,function(e){
                    parent.remove()
                    toastr.warning("The Cell is removed");
                })
            }else{
                chrome.storage.local.remove(cellId,function(e){
                    parent.remove()
                    toastr.warning("The Cell is removed");
                })
            }

            /* Alert the copied text */

        });
        tr.appendChild(del);

        var items = document.getElementById("items");
        items.appendChild(tr);
        var store = {}
        store[key] = imageDataBase64;
        chrome.storage.sync.set(store, function(err) {
            if(chrome.runtime.lastError) {

                if (chrome.runtime.lastError.message == "QUOTA_BYTES_PER_ITEM quota exceeded"){
                    toastr.warning("Text is above the limit. It's not synced by browsers")
                    name.storageLocation= "local";
                }

                chrome.storage.local.set(store,function(err){
                    if (chrome.runtime.lastError){

                        if (chrome.runtime.lastError.message == "QUOTA_BYTES quota exceeded"){
                            toastr.warning("Text is above the limit. It's not saved in browser")
                        }
                    }
                })

              } else {
                  toastr.success("paste to clipboard");
                  name.storageLocation= "sync";
              }

        });

    }}


window.addEventListener("paste", function(e){
    var url = retrieveImageFromClipboardAsBase64(e,pasteCallback);
    }, false);



async function getSyncItems(){
chrome.storage.sync.get(null,function(elements){

    for (e in elements){
        var tr = document.createElement("tr");
        var name = document.createElement("td");
        name.storageLocation= "sync";
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
            toastr.info("Copied the text");
        });

        value.appendChild(button);
        var value_ = document.createElement("textarea")
        value_.value= elements[e];
        value_.className = "form-control"
        value_.style = "resize : horizontal;width:150px;"
        value_.readOnly = true;
        value.appendChild(value_);

        tr.appendChild(name);
        tr.appendChild(value);

        var td = document.createElement("td");

        if (value_.value.startsWith("data:image/")){
            var img_ = document.createElement("img");
            img_.src= value_.value;
            img_.height="100";
            img_.width="100";
            td.appendChild(img_)
        } else if (value_.value.startsWith("https://youtu.be")){
            var youtube = document.createElement("iframe");
            var src = "https://www.youtube.com/embed/"+value_.value.split("youtu.be/")[1]
            youtube.src= src
            youtube.height="100";
            youtube.width="100";
            td.appendChild(youtube);


        }
        tr.appendChild(td)

        var del = document.createElement("td");
        var del_ = document.createElement("button");
        del_.type= "button";
        del_.className = "btn btn-danger";
        del_.innerHTML = "delete"
        del.appendChild(del_);

        var del = document.createElement("td");
        var del_ = document.createElement("button");
        del_.type= "button";
        del_.className = "btn btn-danger";
        del_.innerHTML = "delete"
        del.appendChild(del_);

        $(del_).bind("click",function(e){
            var parent = this.parentElement.parentElement
            var removed = $('td:nth-child(1)',parent)[0]
            var cellId = removed.innerText
            if (removed.storageLocation == "sync"){
                chrome.storage.sync.remove(cellId,function(e){
                    parent.remove()
                    toastr.warning("The Cell is removed");
                })
            }else{
                chrome.storage.local.remove(cellId,function(e){
                    parent.remove()
                    toastr.warning("The Cell is removed");
                })
            }

            /* Alert the copied text */

        });
        tr.appendChild(del);

        var items = document.getElementById("items");
        items.appendChild(tr);
    }

})

}
async function getLocalItems(e,elements){
    var tr = document.createElement("tr");
    var name = document.createElement("td");
    name.storageLocation= "local";
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
        toastr.info("Copied the text");
    });

    value.appendChild(button);
    var value_ = document.createElement("textarea")
    value_.value= elements[e];
    value_.className = "form-control"
    value_.style = "resize : horizontal;width:150px;"
    value_.readOnly = true;
    // value.className = "form-group shadow-textarea"
    value.appendChild(value_);

    tr.appendChild(name);
    tr.appendChild(value);
    var td = document.createElement("td");

    if (value_.value.startsWith("data:image/")){
        var img_ = document.createElement("img");
        img_.onload = function () { td.appendChild(img_) };
        img_.src= value_.value;
        img_.height="100";
        img_.width="100";

    } else if (value_.value.startsWith("https://youtu.be")){
        var youtube = document.createElement("iframe");
        var src = "https://www.youtube.com/embed/"+value_.value.split("youtu.be/")[1]
        youtube.src= src
        youtube.height="100";
        youtube.width="100";
        td.appendChild(youtube);


    }
    tr.appendChild(td)

    var del = document.createElement("td");
    var del_ = document.createElement("button");
    del_.type= "button";
    del_.className = "btn btn-danger";
    del_.innerHTML = "delete"
    del.appendChild(del_);

    var del = document.createElement("td");
    var del_ = document.createElement("button");
    del_.type= "button";
    del_.className = "btn btn-danger";
    del_.innerHTML = "delete"
    del.appendChild(del_);

    $(del_).bind("click",function(e){
        var parent = this.parentElement.parentElement
        var removed = $('td:nth-child(1)',parent)[0]
        var cellId = removed.innerText
        if (removed.storageLocation == "sync"){
            chrome.storage.sync.remove(cellId,function(e){
                parent.remove()
                toastr.warning("The Cell is removed");
            })
        }else{
            chrome.storage.local.remove(cellId,function(e){
                parent.remove()
                toastr.warning("The Cell is removed");
            })
        }

        /* Alert the copied text */

    });
    tr.appendChild(del);

    var items = document.getElementById("items");
    items.appendChild(tr);

}

let ELEMENTS = {}
let worker = new Worker( 'js/worker.js' );
let REMAINED = 0;

worker.onmessage = async function( e ) {
    await getLocalItems(e.data,ELEMENTS);
    REMAINED-=1;
    if (REMAINED==0){
        $("#loading")[0].style.display = "none"
    }
};

async function getLocalStorage(){
    chrome.storage.local.get(null,async function(elements){
        ELEMENTS = elements;
        worker.postMessage(ELEMENTS);
        REMAINED = Object.keys(ELEMENTS).length;
        if (REMAINED==0){
            $("#loading")[0].style.display = "none"
        }
    })
}
setTimeout(function(){
	getSyncItems();
	getLocalStorage()
},100)
