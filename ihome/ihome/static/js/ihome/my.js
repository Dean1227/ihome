

$(document).ready(function(){
    $.ajax({
            url:'/user/my_info/',
            type:'GET',
            dataType:'json',
            success:function(data){
                if(data.code == '200'){
                    console.log(data)
                    $('#user-name').html(data.user.name)
                    $('#user-mobile').html(data.user.phone)
                    $('#user-avatar').attr('src',data.user.avatar)
                }
            },
            error:function(data){
                alert('error')
            },

        })
})