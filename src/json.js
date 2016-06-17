
 function getJSON(url, callback){
    $.ajax({
        type: 'GET',
        url: url,
        async: true,
        dataType: 'json',
        success: callback
    });
   
}