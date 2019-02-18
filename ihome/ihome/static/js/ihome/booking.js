function hrefBack() {
    history.go(-1);
}

function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}

function decodeQuery(){
    var search = decodeURI(document.location.search);
    return search.replace(/(^\?)/, '').split('&').reduce(function(result, item){
        values = item.split('=');
        result[values[0]] = values[1];
        return result;
    }, {});
}

function showErrorMsg() {
    $('.popup_con').fadeIn('fast', function() {
        setTimeout(function(){
            $('.popup_con').fadeOut('fast',function(){}); 
        },1000) 
    });
}

$(document).ready(function(){
    $(".input-daterange").datepicker({
        format: "yyyy-mm-dd",
        startDate: "today",
        language: "zh-CN",
        autoclose: true
    });
    $(".input-daterange").on("changeDate", function(){
        var startDate = $("#start-date").val();
        var endDate = $("#end-date").val();

        if (startDate && endDate && startDate > endDate) {
            showErrorMsg();
        } else {
            var sd = new Date(startDate);
            var ed = new Date(endDate);
            days = (ed - sd)/(1000*3600*24);
            var price = $(".house-text>p>span").html();
            var amount = days * parseFloat(price);
            $(".order-amount>span").html(amount.toFixed(2) + "(共"+ days +"晚)");
//            function orderSubmit(){
//                console.log('1')
//                $.ajax({
//                url:'/order/booking/',
//                type:'POST',
//                dataType:'json',
//                data:{'sd':sd, 'ed':ed, 'days':days, 'price':price, 'amount':amount},
//                success:function(data){
//                    if (data.code == '200'){
//                        alert('预定成功')
//                        }
//                    }
//                })
//            }
        }
    });
    $.ajax({
        url:'/order/my_booking/',
        type:'GET',
        dataType:'json',
        success:function(data){
            if (data.code == '200'){
                console.log(data)
                $("#house_img").attr('src', data.house.image)
                $("#house_name").html(data.house.title)
                $("#price").html(data.house.price)
            }
        }
    });
})

function orderSubmit(){
    var startDate = $("#start-date").val();
    var endDate = $("#end-date").val();
    var sd = new Date(startDate);
    var ed = new Date(endDate);
    days = (ed - sd)/(1000*3600*24);
    var price = $(".house-text>p>span").html();
    var amount = days * parseFloat(price);
    $.ajax({
        url:'/order/booking/',
        type:'POST',
        dataType:'json',
        data:{'sd':startDate, 'ed':endDate, 'days':days, 'price':price, 'amount':amount},
        success:function(data){
            if (data.code == '200'){
            alert('预定成功')
            }
        }
    })
}