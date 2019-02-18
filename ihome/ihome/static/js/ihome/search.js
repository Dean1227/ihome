var cur_page = 1; // 当前页
var next_page = 1; // 下一页
var total_page = 1;  // 总页数
var house_data_querying = true;   // 是否正在向后台获取数据

// 解析url中的查询字符串
function decodeQuery(){
    var search = decodeURI(document.location.search);
    return search.replace(/(^\?)/, '').split('&').reduce(function(result, item){
        values = item.split('=');
        result[values[0]] = values[1];
        return result;
    }, {});
}

// 更新用户点选的筛选条件
function updateFilterDateDisplay() {
    var startDate = $("#start-date").val();
    var endDate = $("#end-date").val();
    var $filterDateTitle = $(".filter-title-bar>.filter-title").eq(0).children("span").eq(0);
    if (startDate) {
        var text = startDate.substr(5) + "/" + endDate.substr(5);
        $filterDateTitle.html(text);
    } else {
        $filterDateTitle.html("入住日期");
    }
    var area_id = $(".page-title").attr('area-id')
    console.log(area_id)
    var key_id = $(".page-title").attr('key-id')
    $.ajax({
        url:'/house/my_search/',
        type:'POST',
        dataType:'json',
        data:{'start_date': startDate, 'end_date': endDate, 'area_id': area_id, 'key': key_id},
        success:function(data){
            if (data.code == '200'){
                ulNode = $('.filter-area')
                for (x in data.area_list){
                    liNode = $('<li area-id="'+data.area_list[x].id+'" id="a'+data.area_list[x].id+'">'+data.area_list[x].name+'</li>')
                    ulNode.append(liNode)
                    }
                var houses_html = ''
                for (i in data.all_houses){
                    var house_html = '<li class="house-item">'
                    house_html += '<a href="/house/detail/' + data.all_houses[i].id +'/"><img src="'+ data.all_houses[i].images[0] + '"></a>'
                    house_html += '<div class="house-desc">'
                    house_html += '<div class="landlord-pic"><img src="'+data.all_houses[i].user_avatar+'"></div>'
                    house_html += '<div class="house-price">￥<span>' + data.all_houses[i].price  + '</span>/晚</div>'
                    house_html += '<div class="house-intro">'
                    house_html += '<span class="house-title">' + data.all_houses[i].title + '</span>'
                    house_html += '<em>出租' + data.all_houses[i].room_count + '间 - ' + data.all_houses[i].address + '</em>'
                    house_html += ' </div> </div> </li>'
                    houses_html += house_html
                    }
                $('.house-list').html(houses_html)
        }
        }
    })
}


// 更新房源列表信息
// action表示从后端请求的数据在前端的展示方式
// 默认采用追加方式
// action=renew 代表页面数据清空从新展示
function updateHouseData(action) {
    var areaId = $(".filter-area>li.active").attr("area-id");
    if (undefined == areaId) areaId = "";
    var startDate = $("#start-date").val();
    var endDate = $("#end-date").val();
    var sortKey = $(".filter-sort>li.active").attr("sort-key");
    var params = {
        aid:areaId,
        sd:startDate,
        ed:endDate,
        sk:sortKey,
        p:next_page
    };
    //发起ajax请求，获取数据，并显示在模板中
}

$(document).ready(function(){
    var queryData = decodeQuery();
    var startDate = queryData["sd"];
    var endDate = queryData["ed"];
    $("#start-date").val(startDate);
    $("#end-date").val(endDate);
//    updateFilterDateDisplay();
    var areaName = queryData["aname"];
    if (!areaName) areaName = "位置区域";
    $(".filter-title-bar>.filter-title").eq(1).children("span").eq(0).html(areaName);

    $(".input-daterange").datepicker({
        format: "yyyy-mm-dd",
        startDate: "today",
        language: "zh-CN",
        autoclose: true
    });
    var $filterItem = $(".filter-item-bar>.filter-item");
    $(".filter-title-bar").on("click", ".filter-title", function(e){
        var index = $(this).index();
        if (!$filterItem.eq(index).hasClass("active")) {
            $(this).children("span").children("i").removeClass("fa-angle-down").addClass("fa-angle-up");
            $(this).siblings(".filter-title").children("span").children("i").removeClass("fa-angle-up").addClass("fa-angle-down");
            $filterItem.eq(index).addClass("active").siblings(".filter-item").removeClass("active");
            $(".display-mask").show();
        } else {
            $(this).children("span").children("i").removeClass("fa-angle-up").addClass("fa-angle-down");
            $filterItem.eq(index).removeClass('active');
            $(".display-mask").hide();
            updateFilterDateDisplay();
        }
    });
    $(".display-mask").on("click", function(e) {
        $(this).hide();
        $filterItem.removeClass('active');
        updateFilterDateDisplay();
        cur_page = 1;
        next_page = 1;
        total_page = 1;
        updateHouseData("renew");

    });
    $(".filter-item-bar>.filter-area").on("click", "li", function(e) {
        if (!$(this).hasClass("active")) {
            $(this).addClass("active");
            $(this).siblings("li").removeClass("active");
            $(".filter-title-bar>.filter-title").eq(1).children("span").eq(0).html($(this).html());
            var area_id = $(this).attr('area-id')
            $(".page-title").attr('area-id',area_id)
        } else {
            $(this).removeClass("active");
            $(".filter-title-bar>.filter-title").eq(1).children("span").eq(0).html("位置区域");
        }
    });
    $(".filter-item-bar>.filter-sort").on("click", "li", function(e) {
        if (!$(this).hasClass("active")) {
            $(this).addClass("active");
            $(this).siblings("li").removeClass("active");
            $(".filter-title-bar>.filter-title").eq(2).children("span").eq(0).html($(this).html());
            var key_id = $(this).attr('sort-key')
            $(".page-title").attr('key-id',key_id)
        }
    });
    $.ajax({
        url:'/house/hsearch/',
        type:'GET',
        dataType:'json',
        success:function(data){
            if (data.code == '200'){
                ulNode = $('.filter-area')
                for (x in data.area_list){
                    liNode = $('<li area-id="'+data.area_list[x].id+'" id="a'+data.area_list[x].id+'">'+data.area_list[x].name+'</li>')
                    ulNode.append(liNode)
                    }
                var houses_html = ''
                for (i in data.all_houses){
                    var house_html = '<li class="house-item">'
                    house_html += '<a href="/house/detail/' + data.all_houses[i].id +'/"><img src="'+ data.all_houses[i].images[0] + '"></a>'
                    house_html += '<div class="house-desc">'
                    house_html += '<div class="landlord-pic"><img src="'+data.all_houses[i].user_avatar+'"></div>'
                    house_html += '<div class="house-price">￥<span>' + data.all_houses[i].price  + '</span>/晚</div>'
                    house_html += '<div class="house-intro">'
                    house_html += '<span class="house-title">' + data.all_houses[i].title + '</span>'
                    house_html += '<em>出租' + data.all_houses[i].room_count + '间 - ' + data.all_houses[i].address + '</em>'
                    house_html += ' </div> </div> </li>'
                    houses_html += house_html
                    }
                $('.house-list').html(houses_html)
                $('#start-date').val(data.start_date)
                $('#end-date').val(data.end_date)
                $('#a'+data.area.id).addClass("active")
                $('#area').text(data.area.name)
                $(".page-title").attr('area-id', data.area.id)
                if (data.start_date) {
                    var text = data.start_date.substr(5) + "/" + data.end_date.substr(5);
                    $("#time").html(text);
                } else {
                    $filterDateTitle.html("入住日期");
                }
                }
            }
        });
})