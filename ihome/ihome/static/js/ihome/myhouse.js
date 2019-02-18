
$(document).ready(function(){
    $.ajax({
        url:'/house/my_houses/',
        type:'GET',
        dataType:'json',
        success:function(data){
            if (data.code == '200'){
                $(".auth-warn").hide();
                $("#houses-list").show();
                houses_html = '<li><div class="new-house"><a href="/house/new_house/">发布新房源</a></div></li>'
                for (x in data.houses){
                    house_html = '<li><a href="/house/detail/'+data.houses[x].id+'/">'
                    house_html += '<div class="house-title"><h3>房屋ID:'+data.houses[x].id+' —— '+data.houses[x].title+'</h3></div>'
                    house_html += '<div class="house-content"><img src="'+data.houses[x].image+'">'
                    house_html += '<div class="house-text"><ul><li>位于：'+data.houses[x].area+'</li><li>价格：￥'+data.houses[x].price+'/晚</li>'
                    house_html += '<li>发布时间：'+data.houses[x].create_time+'</li></ul></div></div></a></li>'
                    houses_html = houses_html + house_html
                $("#houses-list").html(houses_html)
                }
            }else{
                $(".auth-warn").show();
                $("#houses-list").hide();
            }
        }
    });

})