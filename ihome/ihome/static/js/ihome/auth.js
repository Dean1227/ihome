function showSuccessMsg() {
    $('.popup_con').fadeIn('fast', function() {
        setTimeout(function(){
            $('.popup_con').fadeOut('fast',function(){}); 
        },1000) 
    });
}
$(document).ready(function() {
    $("#real-name").focus(function(){
        $("#error-msg").hide();
    });
    $("#id-card").focus(function(){
        $("#error-msg").hide();
    });
    $(".auth-msg").hide();
    $.ajax({
        url:'/user/is_auth/',
        type:'GET',
        dataType:'json',
        success:function(data){
            if (data.code == '200'){
                $("#real-name").val(data.user.id_name);
                $("#id-card").val(data.user.id_card);
                $(".btn-success").hide()
                $(".auth-msg").html('<i class="fa fa-exclamation-circle"></i>用户已经实名认证');
                $(".auth-msg").show();
            }
        }
    });
    $("#form-auth").submit(function(e){
        e.preventDefault();
        real_name = $("#real-name").val();
        id_card = $("#id-card").val();
        if (!real_name) {
            $(".error-msg").html('<i class="fa fa-exclamation-circle"></i>信息填写不完整，请补全信息');
            $(".error-msg").show();
            return;
        }
        if (!id_card) {
            $(".error-msg").html('<i class="fa fa-exclamation-circle"></i>信息填写不完整，请补全信息');
            $(".error-msg").show();
            return;
        }
        $.ajax({
            url:'/user/auth/',
            type:'POST',
            dataType:'json',
            data:{'real_name': real_name, 'id_card': id_card},
            success:function(data){
                if(data.code == '200'){
                    window.location.href = '/user/my/'
                }
            },
            error:function(data){
                alert('error')
            },

        });
    });
})
