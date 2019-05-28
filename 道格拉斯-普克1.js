function Point(x, y) {
    this.x = x;
    this.y = y;
}
var A = new Array();
var res = new Array();
var result = new Array();
var resultarry = new Array();
var u = 0;
var dMax = 3;
/*北京54参数*/
var a = 6378245;//长半轴
var b = 6356863.01877;//短半轴
var e1 = 0.006693421622966; //第一偏心率的平方
var e2 = 0.006738525414684;//第二偏心率的平方

/*兰伯特参数*/
var L0 = 105 * Math.PI / 180;//原点经度
var B0 = 0;//原点纬度
var B1 = 20 * Math.PI / 180;//第一标准纬线
var B2 = 40 * Math.PI / 180;//第二标准纬线

function input() {
    var inputfile = document.getElementById("input").files[0];
    var reader = new FileReader();
    reader.readAsText(inputfile);
    reader.onload = function (e) {
        var text = reader.result.split("\r\n");
        var N = 0;
        A[N] = new Array();
        var l = text.length;
        var judge = 0;
        for (var i = 1; i < l - 1; i++) {

            if (text[i] != "END") {
                if (text[i].length != 2 && text[i].length != 3 && text[i].length != 1) {
                    var x;
                    var y;
                    x = text[i].split(",")[0];
                    y = text[i].split(",")[1];
                    A[N][judge] = new Point(x, y);
                    judge = judge + 1;
                }
            }
            else {
                judge = 0;
                N = N + 1;
                A[N] = new Array();
            }
        }

    }
}
function Lanbert(B) {
    var canvas = document.getElementById("canv");
    var cxt = canvas.getContext("2d");
    cxt.clearRect(0, 0, 5000, 5000);
    cxt.beginPath();
    cxt.lineWidth = 2;
    var mb1 = Math.cos(B1) / Math.sqrt(1 - e1 * Math.pow(Math.sin(B1), 2));
    var mb2 = Math.cos(B2) / Math.sqrt(1 - e1 * Math.pow(Math.sin(B2), 2));
    var tb1 = Math.tan(Math.PI / 4 - B1 / 2) / Math.pow(((1 - Math.sqrt(e1) * Math.sin(B1)) / (1 + Math.sqrt(e1) * Math.sin(B1))), (Math.sqrt(e1) / 2));
    var tb2 = Math.tan(Math.PI / 4 - B2 / 2) / Math.pow(((1 - Math.sqrt(e1) * Math.sin(B2)) / (1 + Math.sqrt(e1) * Math.sin(B1))), (Math.sqrt(e1) / 2));
    var n = Math.log(mb1 / mb2, Math.E) / Math.log(tb1 / tb2, Math.E);
    var f = mb1 / (n * Math.pow(tb1, n));
    var N = 461;
    for (var i = 0; i < N + 1; i++) {
        for (var j = 0; j < B[i].length - 1; j++) {
            var x1 = B[i][j].x;
            var y1 = B[i][j].y;
            var x2 = B[i][j + 1].x;
            var y2 = B[i][j + 1].y;
            var r1 = a * f * Math.pow(Math.tan(Math.PI / 4 - (y1 * Math.PI / 180) / 2) / Math.pow(((1 - Math.sqrt(e1) * Math.sin(y1 * Math.PI / 180)) / (1 + Math.sqrt(e1) * Math.sin(y1 * Math.PI / 180))), (Math.sqrt(e1) / 2)), n);
            var t1 = n * (x1 * Math.PI / 180 - L0);
            var r2 = a * f * Math.pow(Math.tan(Math.PI / 4 - (y2 * Math.PI / 180) / 2) / Math.pow(((1 - Math.sqrt(e1) * Math.sin(y2 * Math.PI / 180)) / (1 + Math.sqrt(e1) * Math.sin(y2 * Math.PI / 180))), (Math.sqrt(e1) / 2)), n);
            var t2 = n * (x2 * Math.PI / 180 - L0);
            var xx1 = a * f - r1 * Math.cos(t1);
            var yy1 = r1 * Math.sin(t1);
            var xx2 = a * f - r2 * Math.cos(t2);
            var yy2 = r2 * Math.sin(t2);
            cxt.moveTo(yy1 * 0.0001 + 500, 640 - xx1 * 0.0001);
            cxt.lineTo(yy2 * 0.0001 + 500, 640 - xx2 * 0.0001);
        }
    }
    cxt.stroke();
}
//计算点p到点p0和p1所连直线的距离
function Distance(p0, p1, p) {
    var dis
    if (p1.x == p0.x) {
        dis = Math.abs(p1.x - p.x)
    }
    else {
        var k = -((p0.y - p1.y) / (p0.x - p1.x))
        var b = (p0.y * p1.x - p1.y * p0.x) / (p1.x - p0.x)
        dis = Math.abs(k * p.x + 1 * p.y + b) / Math.sqrt(1 + k * k)
    }
    return dis;
}

//递归方式压缩轨迹
function compressLine(coordinate, N, start, end) {
    if (start < end) {
        var maxDist = 0;
        //找出A[N]里Distance最大的点
        for (var i = start + 1; i < end; i++) {
            var currentDist = Distance(coordinate[N][start], coordinate[N][end], coordinate[N][i]);
            if (currentDist > maxDist) {
                maxDist = currentDist;
                var currentIndex = i;
            }
        }
        if (maxDist >= dMax) {
            //将A[N]里distance最大的点的位置记录入到result数组中
            result[N].push(currentIndex);
            //将原来的线段以当前点为中心拆成两段，分别进行递归处理
            compressLine(coordinate, N, start, currentIndex);
            compressLine(coordinate, N, currentIndex, end);
        }
    }
}
//快速排序
function quick_sort(N, from, to) {
    var i = from; //哨兵i
    var j = to; //哨兵j
    var key = result[N][from]; //标准值
    if (from >= to) { //如果数组只有一个元素
        return;
    }
    while (i < j) {
        while (result[N][j] > key && i < j) { //从右边向左找第一个比key小的数，找到或者两个哨兵相碰，跳出循环
            j--;
        }
        while (result[N][i] <= key && i < j) {  //从左边向右找第一个比key大的数，找到或者两个哨兵相碰，跳出循环,这里的=号保证在本轮循环结束前，key的位置不变，否则的话跳出循环，交换i和from的位置的时候，from位置的上元素有可能不是key
            i++;
        }
		/**
		  代码执行道这里，1、两个哨兵到找到了目标值。2、j哨兵找到了目标值。3、两个哨兵都没找到(key是当前数组最小值)
		**/
        if (i < j) { //交换两个元素的位置
            var temp = result[N][i];
            result[N][i] = result[N][j];
            result[N][j] = temp;

        }
    }
    result[N][from] = result[N][i] //
    result[N][i] = key;
    quick_sort(N, from, i - 1);
    quick_sort(N, i + 1, to);
}

function douglasPeucker() {
    for (var N = 0; N < 462; ++N) {
        result[N] = new Array();
        compressLine(A, N, 0, A[N].length - 1);
    }
    for (var i = 0; i < 462; ++i) {
        quick_sort(i, 0, result[i].length - 1);
    }//对压缩完的轨迹数组进行排序
    for (var i = 0; i < 462; ++i) {
        resultarry[i] = new Array();
        resultarry[i][0]=A[i][0];
        if(result[i][0])
        {
            for(var j=1;j<result[i].length+1;++j)
            resultarry[i][j]=A[i][result[i][j-1]];
        }
        resultarry[i].push(A[i][A[i].length-1]);
    }
    Lanbert(resultarry);
}
function dis() {
    u = 0;
    for (i = 0; i < A[u].length - 1; ++i) {
        var s = Distance(A[u][0], A[u][A[u].length - 1], A[u][i])
        console.log("第", i, "个点到直线距离为", s);
    }
}
function dou() {
    for (var N = 0; N < 462; ++N) {
        var j = 0;
        res[N] = new Array();
        for (var i = 0; j < A[N].length; ++i) {
            x = A[N][j].x;
            y = A[N][j].y;
            res[N][i] = new Point(x, y);
            j = j + 2;
        }
        if (res[N][i - 1] != A[N][A[N].length - 1]) {
            x = A[N][A[N].length - 1].x;
            y = A[N][A[N].length - 1].y;
            res[N][i] = new Point(x, y);
        }
    }
    N = 461;
}