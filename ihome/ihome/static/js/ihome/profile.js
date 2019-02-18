function showSuccessMsg() {
    $('.popup_con').fadeIn('fast', function() {
        setTimeout(function(){
            $('.popup_con').fadeOut('fast',function(){}); 
        },1000) 
    });
}

function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}

$(document).ready(function() {
    $("#form-avatar").submit(function(e){
        e.preventDefault();
        $(this).ajaxSubmit({
            url:'/user/profile/',
            type:'POST',
            dataType:'json',
            success:function(data){
                if(data.code == '200'){
                    alert('上传成功')
                }
            },
            error:function(data){
                alert('error1')
            },

        })
    })

    $("#form-name").submit(function(e){
        e.preventDefault();
        user_name = $("#user-name").val();
        $.ajax({
            url:'/user/profile/',
            type:'POST',
            dataType:'json',
            data:{'user_name':user_name},
            success:function(data){
                if(data.code == '200'){
                    alert('保存成功')
                }
            },
            error:function(data){
                alert('error2')
            },

        })
    });
})
