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
    $(".order-accept").on("click", function(){
        var orderId = $(this).parents("li").attr("order-id");
        $(".modal-accept").attr("order-id", orderId);
    });
    $(".order-reject").on("click", function(){
        var orderId = $(this).parents("li").attr("order-id");
        $(".modal-reject").attr("order-id", orderId);
    });
    $.ajax({
        url:'/order/lorder/',
        type:'GET',
        dataType:'json',
        success:function(data){
            if (data.code == '200'){
                orders_html = ''
                for (x in data.orders){
                    order_html = '<li order-id="'+data.orders[x].order_id+'"><div class="order-title">'
                    order_html += '<h3>订单编号：iHome'+data.orders[x].order_id+'</h3><div class="fr order-operate">'
                    order_html += '<button type="button" class="btn btn-success order-accept" data-toggle="modal" data-target="#accept-modal" id="b'+data.orders[x].order_id+'">接单</button>'
                    order_html += '<button type="button" class="btn btn-danger order-reject" data-toggle="modal" data-target="#reject-modal" id="c'+data.orders[x].order_id+'">拒单</button>'
                    order_html += '</div></div><div class="order-content"><img src="'+data.orders[x].image+'">'
                    order_html += '<div class="order-text"><h3>'+data.orders[x].house_title+'</h3><ul>'
                    order_html += '<li>创建时间：'+data.orders[x].create_date+'</li><li>入住日期：'+data.orders[x].begin_date +'</li>'
                    order_html += '<li>离开日期：'+data.orders[x].end_date+'</li><li>合计金额：￥'+data.orders[x].amount+'(共'+data.orders[x].days+'晚)</li>'
                    order_html += '<li>订单状态：<span>'+data.orders[x].status+'</span></li><li id="a'+data.orders[x].order_id+'">客户评价： '+data.orders[x].comment+'</li>'
                    order_html += '</ul></div></div></li>'
                    orders_html += order_html
                }
                $(".orders-list").html(orders_html)
                for (x in data.orders){
                    switch(data.orders[x].status){
                        case "待接单":
                            console.log(x,"=============")
                            $("#a"+data.orders[x].order_id).hide();
                            $("#b"+data.orders[x].order_id).show();
                            $("#c"+data.orders[x].order_id).show();
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
                            $("#a"+data.orders[x].order_id).hide();
                            $("#b"+data.orders[x].order_id).hide();
                            $("#c"+data.orders[x].order_id).hide();
                            break;
                        case "已完成":
                            $("#a"+data.orders[x].order_id).show();
                            $("#b"+data.orders[x].order_id).hide();
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
                            $("#c"+data.orders[x].order_id).hide();
                            break;
                    }
                }
            }
            $(".order-accept").on("click", function(){
            var orderId = $(this).parents("li").attr("order-id");
            $(".modal-accept").on("click", function(){
                var order_status = 'WAIT_PAYMENT';
                $.ajax({
                    url:'/order/accept_order/',
                    type:'POST',
                    dataType:'json',
                    data:{'status': order_status,'order_id': orderId},
                    success:function(data){
                        if (data.code == '200'){
                            alert('接单成功')
                            window.location.reload()
                            }
                        }
                    })
                });
            });
            $(".order-reject").on("click", function(){
                var orderId = $(this).parents("li").attr("order-id");
                $(".modal-reject").on("click", function(){
                    var reason = $("#reject-reason").val();
                    var order_status = 'REJECTED';
                    if (!reason){
                        alert('请填写拒单理由')
                    }else{
                        $.ajax({
                        url:'',
                        type:'POST',
                        dataType:'json',
                        data:{'status': order_status,'order_id': orderId, 'reason': reason},
                        success:function(data){
                            if (data.code == '200'){
                                alert('拒单成功')
                                window.location.reload()
                            }
                        }
                    })
                    }

                });
            });
        }
    });
});