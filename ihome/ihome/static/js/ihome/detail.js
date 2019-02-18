function hrefBack() {
    history.go(-1);
}

function decodeQuery(){
    var search = decodeURI(document.location.search);
    return search.replace(/(^\?)/, '').split('&').reduce(function(result, item){
        values = item.split('=');
        result[values[0]] = values[1];
        return result;
    }, {});
}

$(document).ready(function(){
    var mySwiper = new Swiper ('.swiper-container', {
        loop: true,
        autoplay: 2000,
        autoplayDisableOnInteraction: false,
        pagination: '.swiper-pagination',
        paginationType: 'fraction'
    });
    $(".book-house").show();
    $.ajax({
        url:'/house/my_detail/',
        type:'GET',
        dataType:'json',
        success:function(data){
            if (data.code == '200'){
            $('#landlord_name').html(data.house.user_name)
            $('#house-price').html(data.house.price)
            $('#house_address').html(data.house.address)
            $('#room_count').html('出租'+data.house.room_count+'间')
            $('#house_acreage').html('房屋面积:'+data.house.acreage+'平米')
            $('#unit').html('房屋户型:'+data.house.unit)
            $('#capacity').html('宜住'+data.house.capacity+'人')
            $('#beds').html(data.house.beds)
            $('#deposit').html(data.house.deposit)
            $('#min_days').html(data.house.min_days)
            if (data.house.max_days == '0'){
                $('#max_days').html('无限制')
            }else{
                $('#max_days').html(data.house.max_days)
            }

            $('.landlord-pic').html('<img src="' + data.house.user_avatar + '">')
            var house_facilities = ''
            for(i in data.house.facilities){
                house_facilities += '<li><span class="' + data.house.facilities[i].css + '"></span>' + data.house.facilities[i].name + '</li>'
            }
            $('.house-facility-list').html(house_facilities)
    
//            $('.book-house').attr('href', '/house/booking/?id=' + data.house.id)
//            判断是否显示预订按钮
            if(data.booking==1){
                $(".book-house").show();
                $("#book-msg").hide();
            }else{
                $(".book-house").hide();
                $("#book-msg").show();
            }

            }
        }

    })
})