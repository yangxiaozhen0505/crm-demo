String.prototype.parseQuery=function(){
    var query ={};
    this.replace(/([^?=&]+)=([^?=&]+)/,function(){
        query[arguments[1]]= arguments[2]
    });
    return query;
};
var oBox = document.getElementById('form');
var query = window.location.search.parseQuery();
var id = query.id;
var oBtn = document.createElement('button');
oBtn.className = 'btn';
if(id){
    oBtn.innerHTML = '修改';
    ajax({
        url:'/getInfo?id='+id,
        type:'get',
        dataType:'json',
        success:function(res){
            if(res&&res.code == 0){
              var u = res.data;
              username.value = u.name;
              age.value = u.age;
              phone.value =u.phone;
              address.value = u.address;
            }else{
                window.location.href='/';
            }
        }
    })

}else{
    oBtn.innerHTML = '增加'
}
oBox.appendChild(oBtn);
var username  = document.getElementById('username');
var age = document.getElementById('age');
var phone  =document.getElementById('phone');
var address = document.getElementById('address');
oBtn.onclick = function(){
    if(id){
        alert('修改成功');
        ajax({
            url:'/updateInfo?id='+id,
            type:'put',
            dataType:'json',
            data:JSON.stringify({
                id:id,
                name:username.value,
                age:age.value,
                phone:phone.value,
                address:address.value
            }),
            success:function(res){
                if(res&&res.code==0){
                    window.location.href = '/'
                }
            }
        })
    }else{
        alert('增加成功');
        ajax({
            url:'/addInfo',
            dataType:'json',
            type:'post',
            data:JSON.stringify({
                name:username.value,
                age:age.value,
                phone:phone.value,
                address:address.value
            }),
            success:function(res){
                if(res&&res.code==0){
                    window.location.href = '/'
                }
            }
        })
    }
};