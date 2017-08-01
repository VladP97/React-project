var GoodsList;

if(GoodsList == undefined){
    $.ajax({
        type: "post",
        url: '/',
        success: function(data){
            GoodsList = data;
        },
        dataType: 'json',
        async: false
    });
}

export {GoodsList}
