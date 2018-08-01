Array.prototype.noempty = function () {
    for(var i=0; i<this.length; i++){
        if(this[i] == "" || this[i] == null || typeof(this[i]) == "undefined"){
            this.splice(i,1);
            i--;
        }
    }
    return this;
};

Array.prototype.nonull = function () {
    for(var i=0; i<this.length; i++){
        if(this[i] == "" || this[i] == null || typeof(this[i]) == "undefined"){
            this[i] = 0;
        }
    }
    return this;
};
function reflushechart() {
    $.ajax({
        url:"http://localhost:3001/api/sensor/mac/"+pmmac,
        type:"GET",
        contentType:"application/json",
        dataType:"json",
        success : function(data) {
            var pmdata = data.JSONdata.split(',');
            pmdata.noempty();
            echarts.init(document.getElementById("pmchart")).setOption({
                title: {
                    text: '空气质量检测',
                    subtext: data.tips,
                    x: 'center'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        animation: false
                    }
                },
                axisPointer: {
                    link: {xAxisIndex: 'all'}
                },
                legend: {
                    data:['空气质量']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap : false,
                    axisLine: {onZero: true},
                    data:  ['现在','10分钟前','20分钟前','30分钟前','40分钟前','50分钟前','60分钟前']
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    name:"pm",
                    data: pmdata,
                    hoverAnimation: false,
                    type: 'line',
                    smooth: true
                }]
            }, true);
        } ,
        error : function() {
            document.getElementById("pmchart").innerHTML = 'syserr';
        }
    });

    $.ajax({
        url:"http://localhost:3001/api/sensor/mac/"+dht11mac,
        type:"GET",
        contentType:"application/json",
        dataType:"json",
        success : function(data) {
            var tempdata = JSON.parse(data.JSONdata).temp.split(',');
            var humiditydata = JSON.parse(data.JSONdata).humidity.split(',');
            tempdata.noempty();
            humiditydata.noempty();
            echarts.init(document.getElementById("humichart")).setOption({
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        animation: false,
                        label: {
                            backgroundColor: '#ccc',
                            borderColor: '#aaa',
                            borderWidth: 1,
                            shadowBlur: 0,
                            shadowOffsetX: 0,
                            shadowOffsetY: 0,
                            textStyle: {
                                color: '#222'
                            }
                        }
                    }
                },
                legend: {
                    data:['温度','湿度']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    splitLine: {
                        show: false
                    },
                    data: ['现在','10分钟前','20分钟前','30分钟前','40分钟前','50分钟前','60分钟前']
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name:'温度',
                        type:'line',
                        smooth:true,
                        data:tempdata
                    },
                    {
                        name:'湿度',
                        type:'line',
                        smooth:true,
                        data:humiditydata
                    }
                ]
            }, true);
        } ,
        error : function() {
            document.getElementById("humichart").innerHTML = 'syserr';
        }
    });


    $.ajax({
        url:"http://localhost:3001/api/sensor/mac/"+powermac,
        type:"GET",
        contentType:"application/json",
        dataType:"json",
        success : function(data) {
            var powerdata = JSON.parse(data.JSONdata).power.split(',');
            powerdata.nonull();
            echarts.init(document.getElementById("powerchart")).setOption({
                title: {
                    text: '本年度',
                    subtext: '各月用电数据'
                },
                xAxis: {
                    type: 'category',
                    data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月','八月','九月','十月','十一月','十二月']
                },
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {
                        type : 'shadow'
                    }
                },
                yAxis: {
                    type: 'value',
                    position: 'top',
                    splitLine: {lineStyle:{type:'dashed'}}
                },
                series: [{
                    name:'度',
                    data: powerdata,
                    type: 'bar'
                }]
            }, true);

            echarts.init(document.getElementById("powerbar")).setOption({
                tooltip : {
                    formatter: "{a} <br/>{b} : {c}%"
                },
                series: [
                    {
                        name: '本月指标',
                        type: 'gauge',
                        detail: {formatter:'{value}%'},
                        data: [{value: powerdata[nowmonth], name: '用电指南'}]
                    }
                ]
            });
        } ,
        error : function() {
            document.getElementById("powerchart").innerHTML = "syserr";
            document.getElementById("powerbar").innerHTML = "syserr"
        }
    });
}

reflushechart();
setInterval(reflushechart,1000);