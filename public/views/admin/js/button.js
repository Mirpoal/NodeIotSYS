
$(function () {

    $.ajax({
        url:"http://localhost:3001/api/controller",
        type:"GET",
        contentType:"application/json",
        dataType:"json",
        success : function(data) {
            for(var index in data) {
                switch (data[index].url) {
                    case "light":
                        if(data[index].state) {
                            document.getElementById("button1").innerHTML = "开";
                            document.getElementById("button1").style.backgroundColor = "blue";
                        }else{
                            document.getElementById("button1").innerHTML = "关";
                            document.getElementById("button1").style.backgroundColor = "gray";
                        }
                        break;

                    case "curtains":
                        if(data[index].state) {
                            document.getElementById("button2").innerHTML = "开";
                            document.getElementById("button2").style.backgroundColor = "blue";
                        }else{
                            document.getElementById("button2").innerHTML = "关";
                            document.getElementById("button2").style.backgroundColor = "gray";
                        }
                        break;

                    case "infra":
                        if(data[index].state) {
                            document.getElementById("button3").innerHTML = "开";
                            document.getElementById("button3").style.backgroundColor = "blue";
                        }else{
                            document.getElementById("button3").innerHTML = "关";
                            document.getElementById("button3").style.backgroundColor = "gray";
                        }
                        break;
                }
            }
        } ,
        error : function() {
            document.getElementById("button1").innerHTML = "关";
            document.getElementById("button2").innerHTML = "关";
            document.getElementById("button3").innerHTML = "关";
        }
    });
});

function click1(mac) {
    var button1 = document.getElementById("button1");
    var state = button1.innerHTML;
    var reqpayload = {};

    switch (state) {
        case "开":
            reqpayload.mac = mac;
            reqpayload.state = "off";
            $.ajax({
                url:"http://localhost:3001/api/controller",
                type:"PUT",
                dataType:"json",
                data:reqpayload,
                success : function(data) {
                    console.log(data);
                    button1.innerHTML = "关";
                    button1.style.backgroundColor = "gray"
                } ,
                error : function() {
                    button1.innerHTML = "开";
                }
            });
            break;
        case "关":
            reqpayload.mac = mac;
            reqpayload.state = "on";
            $.ajax({
                url:"http://localhost:3001/api/controller",
                type:"PUT",
                dataType:"json",
                data:reqpayload,
                success : function(data) {
                    console.log(data);
                    button1.innerHTML = "开";
                    button1.style.backgroundColor = "blue"
                } ,
                error : function() {
                    button1.innerHTML = "关";
                }
            });
            break;
    }
}

function click2(mac) {
    var button2 = document.getElementById("button2");
    var state = button2.innerHTML;
    var reqpayload = {};

    switch (state) {
        case "开":
            reqpayload.mac = mac;
            reqpayload.state = "off";
            $.ajax({
                url:"http://localhost:3001/api/controller",
                type:"PUT",
                dataType:"json",
                data:reqpayload,
                success : function(data) {
                    button2.innerHTML = "关";
                    button2.style.backgroundColor = "gray"
                } ,
                error : function() {
                    button2.innerHTML = "开";
                }
            });
            break;
        case "关":
            reqpayload.mac = mac;
            reqpayload.state = "on";
            $.ajax({
                url:"http://localhost:3001/api/controller",
                type:"PUT",
                dataType:"json",
                data:reqpayload,
                success : function(data) {
                    button2.innerHTML = "开";
                    button2.style.backgroundColor = "blue"
                } ,
                error : function() {
                    button2.innerHTML = "关";
                }
            });
            break;
    }
}

function click3(mac) {
    var button3 = document.getElementById("button3");
    var state = button3.innerHTML;
    var reqpayload = {};

    //  缺少万能遥控相关API库  后期可添加API ajax跨域请求万能遥控库服务器    下面以98为例
    reqpayload.Imap = "98";

    switch (state) {
        case "开":
            reqpayload.mac = mac;
            reqpayload.state = "off";
            $.ajax({
                url:"http://localhost:3001/api/controller",
                type:"PUT",
                dataType:"json",
                data:reqpayload,
                success : function(data) {
                    button3.innerHTML = "关";
                    button3.style.backgroundColor = "gray"
                } ,
                error : function() {
                    button3.innerHTML = "开";
                }
            });
            break;
        case "关":
            reqpayload.mac = mac;
            reqpayload.state = "on";
            console.log(reqpayload);
            $.ajax({
                url:"http://localhost:3001/api/controller",
                type:"PUT",
                dataType:"json",
                data:reqpayload,
                success : function(data) {
                    button3.innerHTML = "开";
                    button3.style.backgroundColor = "blue"
                } ,
                error : function() {
                    button3.innerHTML = "关";
                }
            });
            break;
    }
}
