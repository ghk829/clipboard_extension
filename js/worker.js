function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

function pop(obj) {
    for (var key in obj) {
      // Uncomment below to fix prototype problem.
      // if (!Object.hasOwnProperty.call(obj, key)) continue;
      var result = obj[key];
      // If the property can't be deleted fail with an error.
      if (!delete obj[key]) { throw new Error(); }
      return key;
    } 
  }
let ELEMENTS = {};

self.onmessage = function( post) {
    ELEMENTS = post.data;
    var array = Object.keys(ELEMENTS);
        for (var i=0;i<array.length;i++){
            (function(index) {
                setTimeout(function(){
                    postMessage(array[index])
                }, 1000*(i));
            })(i);
        }
};