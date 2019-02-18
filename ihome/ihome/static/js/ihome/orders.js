//模态框居中的控制
function centerModals(){
    $('.modal').each(function(i){   //遍历每一个模态框
        var $clone = $(this).clone().css('display', 'block').appendTo('body');    
        var top = Math.round(($clone.height() - $clone.find('.modal-content').height()) / 2);
        top = top > 0 ? top : 0;
        $clone.remove();
        $(this).find('.modal-content').css("margin-top", top-30);  //修正原先已经有的30个像素
    });
}

function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}

$(document).ready(function(){
    $('.modal').on('show.bs.modal', centerModals);      //当模态框出现的时候
    $(window).on('resize', centerModals);
    $(".order-comment").on("click", function(){
        var orderId = $(this).parents("li").attr("order-id");
        console.log(orderId)
        $(".modal-comment").attr("order-id", orderId);
    });
    $.ajax({
        url:'/order/orders/',
        type:'GET',
        dataType:'json',
        success:function(data){
            if (data.code == '200'){
                console.log(data)
                orders_html =''
                for (x in data.orders){
                    order_html = '<li order-id="'+data.orders[x].order_id+'"><div class="order-title">'
                    order_html += '<h3>订单编号：iHome'+data.orders[x].order_id+'</h3><div class="fr order-operate" id="a'+data.orders[x].order_id+'">'
                    order_html += '<button type="button" class="btn btn-success order-comment" data-toggle="modal" data-target="#comment-modal">发表评价</button>'
                    order_html += '</div></div><div class="order-content"><img src="'+data.orders[x].image+'"><div class="order-text">'
                    order_html += '<h3>订单</h3><ul><li>创建时间：'+data.orders[x].create_date+'</li><li>入住日期：'+data.orders[x].begin_date +'</li>'
                    order_html += '<li>离开日期：'+data.orders[x].end_date+'</li><li>合计金额：'+data.orders[x].amount+'元(共'+data.orders[x].days+'晚)</li>'
                    order_html += '<li>订单状态：<span>'+data.orders[x].status+'</span></li>'
                    order_html += '<li id="b'+data.orders[x].order_id+'">我的评价：'+data.orders[x].comment+'</li>'
                    order_html += '<li id="c'+data.orders[x].order_id+'">拒单原因：'+data.orders[x].comment+'</li></ul></div></div></li>'
                    orders_html += order_html
                    $(".orders-list").html(orders_html)
                    }
                for (x in data.orders){
                    switch(data.orders[x].status){
                        case "待接单":
                            $("#a"+data.orders[x].order_id).hide();
                            $("#b"+data.orders[x].order_id).hide();
                            $("#c"+data.orders[x].order_id).hide();
                            break;
                        case "待支付":
                            $("#a"+data.orders[x].order_id).hide();
                            $("#b"+data.orders[x].order_id).hide();
                            $("#c"+data.orders[x].order_id).hide();
                            break;
                        case "已支付":
                            $("#a"+data.orders[x].order_id).hide();
                            $("#b"+data.orders[x].order_id).hide();
                            $("#c"+data.orders[x].order_id).hide();
                            break;
                        case "待评价":
                            $("#a"+data.orders[x].order_id).show();
                            $("#b"+data.orders[x].order_id).show();
                            $("#b"+data.orders[x].order_id).html('我的评价：暂无评价');
                            $("#c"+data.orders[x].order_id).hide();
                            break;
                        case "已完成":
                            $("#a"+data.orders[x].order_id).hide();
                            $("#b"+data.orders[x].order_id).show();
                            $("#c"+data.orders[x].order_id).hide();
                            break;
                        case "已取消":
                            $("#a"+data.orders[x].order_id).hide();
                            $("#b"+data.orders[x].order_id).hide();
                            $("#c"+data.orders[x].order_id).hide();
                            break;
                        case "已拒单":
                            $("#a"+data.orders[x].order_id).hide();
                            $("#b"+data.orders[x].order_id).hide();
                            $("#c"+data.orders[x].order_id).show();
                            break;
                    }
                }

            }
            $(".order-comment").on("click", function(){
            var orderId = $(this).parents("li").attr("order-id");
            console.log(orderId)
            $(".modal-comment").on("click", function(){
                var comment = $("#comment").val()
                if (!comment){
                    alert('请填写评价内容')
                    }else{
                        $.ajax({
                        url:'/order/my_order/',
                        type:'POST',
                        dataType:'json',
                        data:{'order_id': orderId, 'comment': comment},
                        success:function(data){
                            if (data.code == '200'){
                                alert('评价成功')
//                                $("#comment-modal").hide()
                                window.location.reload()
                                }
                            }
                       })
                    }
                });
            });
        },

    })
});