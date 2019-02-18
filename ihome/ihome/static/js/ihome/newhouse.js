function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}

$(document).ready(function(){
    // $('.popup_con').fadeIn('fast');
    // $('.popup_con').fadeOut('fast');
    $.ajax({
        url:'/house/my_new_house/',
        type:'GET',
        dataType:'json',
        success:function(data){
            if (data.code == '200'){
                selectNode = $('#area-id')
                for (x in data.area_list){
                    console.log(x)
                    optionNode = $('<option value="'+data.area_list[x].id+'">'+data.area_list[x].name+'</option>')
                    selectNode.append(optionNode)
                }
            }
        }
    });
    $("#form-house-image").hide();
    $("#form-house-info").submit(function(e){
        e.preventDefault();
        $(this).ajaxSubmit({
            url:'/house/new_house/',
            type:'POST',
            dataType:'json',
            success:function(data){
                if (data.code == '200'){
                    alert('发布成功房屋信息成功，请添加图片')
                    $("#form-house-image").show()
                }
            },
            error:function(){
                alert('error')
            }
        });
    });
    $("#form-house-image").submit(function(e){
        e.preventDefault();
        $(this).ajaxSubmit({
            url:'/house/new_house_img/',
            type:'POST',
            dataType:'json',
            success:function(data){
                if (data.code == '200'){
                    alert('添加图片成功')
                    $("#form-house-image").show()
                }
            },
            error:function(){
                alert('error')
            }
        });
    });
})