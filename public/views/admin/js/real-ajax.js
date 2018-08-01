
function reflushreal() {

    if(statue == '203') {
        alert("设备未上线或者填写的设备信息有误，若想重试请重新填写再次匹配或让设备上线！");
        statue = '100';
    }else{
        if(statue == '500') {
            alert("系统数据库出错，请稍后重试！");
            statue = '100';
        }else{
            if(statue == '204') {
                alert("设备未认证，无法匹配该设备！");
                statue = '100';
            }else{
                if(statue == '200') {
                    document.getElementById("extendnow").innerHTML = "当前";
                    document.getElementById("extendcava").innerHTML = extendreal+ ' '+ extendunit;
                    document.getElementById("extendname").innerHTML = extenddataname;
                }else {
                    document.getElementById("extendnow").innerHTML  = "扩展";
                    document.getElementById("extendcava").innerHTML = "<button id=\"add\" class=\"btn btn-info btn-block btn-lg\" data-toggle=\"modal\" data-target=\"#addModel\">添加</button>";
                    document.getElementById("extendname").innerHTML = "新设备";
                }
            }
        }
    }

    $.ajax({
        url:"http://localhost:3001/api/sensor/real/"+dht11mac,
        type:"GET",
        contentType:"application/json",
        dataType:"json",
        success : function(data) {
            document.getElementById("realtemp").innerHTML = JSON.parse(data[0].realdata).temp + ' °C';
            document.getElementById("realhum").innerHTML = JSON.parse(data[0].realdata).hum + ' %';
        } ,
        error : function() {
            document.getElementById("realtemp").innerHTML = "syserr"
            document.getElementById("realhum").innerHTML = "syserr"
        }
    });
    $.ajax({
        url:"http://localhost:3001/api/sensor/real/"+pmmac,
        type:"GET",
        contentType:"application/json",
        dataType:"json",
        success : function(data) {
            document.getElementById("realpm").innerHTML = JSON.parse(data[0].realdata).pm + ' °C';
        } ,
        error : function() {
            document.getElementById("realpm").innerHTML = "syserr"
        }
    });
}

reflushreal();
setInterval(reflushreal,1000);