function Point(x, y) {
    this.x = x;
    this.y = y;
}
var V = new Array();
var B = new Array();

//读取Budling数据
function input1() {
    var inputfile = document.getElementById("input1").files[0];
    var reader = new FileReader();
    reader.readAsText(inputfile);
    reader.onload = function (e) {
        var text = reader.result.split("\r\n");
        var l = text.length;
        var judge = 0;
        var N = 0;
        B[0] = new Array();
        for (i = 1; i < l - 1; i++) {
            if (text[i] != "END") {
                if (text[i].length != 2 && text[i].length != 3 && text[i].length != 1) {
                    var x;
                    var y;
                    x = Number(text[i].split(",")[0].slice(3))*3;
                    y = Number(text[i].split(",")[1].slice(4))*3;
                    B[N][judge] = new Point(x, y);
                    judge = judge + 1;
                }
            }
            else {
                judge = 0;
                N = N + 1;
                B[N] = new Array();
            }
        }
        console.log(B[0][0]);
        //console.log(B[0][0].x.slice(3));
        //共0-479行数据
    }
}
//读取Vegrgn数据
function input2() {
    var inputfile = document.getElementById("input2").files[0];
    var reader = new FileReader();
    reader.readAsText(inputfile);
    reader.onload = function (e) {
        var text = reader.result.split("\r\n");
        var l = text.length;
        var judge = 0;
        var N = 0;
        V[0] = new Array();
        for (i = 1; i < l - 1; i++) {
            if (text[i] != "END") {
                if (text[i].length != 2 && text[i].length != 3 && text[i].length != 1) {
                    var x;
                    var y;
                    x = Number(text[i].split(",")[0].slice(3))*3;
                    y = Number(text[i].split(",")[1].slice(4))*3;
                    V[N][judge] = new Point(x, y);
                    judge = judge + 1;
                }
            }
            else {
                judge = 0;
                N = N + 1;
                V[N] = new Array();
            }
        }
        //共0-154行数据
    }
}

function draw() {
    var canvas = document.getElementById("canv");
    var cxt = canvas.getContext("2d");
    cxt.clearRect(0, 0, 900, 2000);
    cxt.beginPath();
    cxt.lineWidth = 2;
    for (var i = 0; i < 480; i++) {
        var l = B[i].length;
        for (var j = 0; j < l - 1; j++) {
            cxt.moveTo(B[i][j].x+100, 1850-B[i][j].y);
            cxt.lineTo(B[i][j + 1].x+100, 1850-B[i][j + 1].y);
        }
    }
    for (var i = 0; i < 155; i++) {
        var l = V[i].length;
        for (var j = 0; j < l - 1; j++) {
            cxt.moveTo(V[i][j].x+100, 1850-V[i][j].y);
            cxt.lineTo(V[i][j + 1].x+100, 1850-V[i][j + 1].y);
        }
    }
    cxt.stroke();
}