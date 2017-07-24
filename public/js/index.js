
var module  =(function(){
    var tBody  =document.getElementById('tBody');
    function bindHtml(datas){
        var str = '';
        for (var i = 0; i < datas.length; i++) {
            var current = datas[i];
            str += '<tr>';
            str += '<td class="text-center">'+(i+1)+'</td>';
            str += '<td class="text-center">'+current.name+'</td>';
            str += '<td class="text-center">'+current.age+'</td>';
            str += '<td class="text-center">'+current.phone+'</td>';
            str += '<td class="text-center">'+current.address+'</td>';
            str += '<td class="text-center"><a class="text-danger" data-id="'+current.id+'">删除</a></td>';
            str += '<td class="text-center"><a class="text-primary" href="/detail.html?id='+current.id+'">修改</a></td>';
            str += '</tr>'
        }
        tBody.innerHTML = str;
    }
    function bindEvent(){
        tBody.onclick = function(e){
            e = e || window.event;
            var ele = e.target || e.srcElement;
            if(ele.tagName == 'A'&&ele.innerHTML == '删除'){
                var id= ele.getAttribute('data-id');
                var flag = confirm('你确定删除掉id为'+id+'用户吗？');
                if(flag){
                    ajax({
                        url:'/removeInfo?id='+id,
                        dataType:'json',
                        success:function(res){
                            if(res&&res.code==0){
                                ele.parentNode.parentNode.parentNode.removeChild(ele.parentNode.parentNode)
                            }else{
                                alert(res.msg)
                            }
                        }
                    })
                }
            }
        }
    }
    function init(){
        ajax({
            url:'getList',
            dataType:'json',
            success:function(res){
                if(res&&res.code==0){
                    var datas = res.data;
                    bindHtml(datas);
                    bindEvent();
                }
            }
        })
    }
    return {
        init:init
    }

})();
module.init();