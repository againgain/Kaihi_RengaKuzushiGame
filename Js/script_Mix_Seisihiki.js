//レンガ崩しのjavaScriptのコードはここに

//レンガ崩し用キャンバスについての変数
var canvas = document.getElementById("myCanvas");   //ブロック崩し用キャンバス
var ctx =  canvas.getContext("2d");                 //2Dです



//レンガ崩し用ボールの数値。
var x = canvas.width/2;                             //レンガ崩し用ボールの横初期位置はキャンバスの真ん中
var y = canvas.height-30;                           //レンガ崩し用ボールの縦初期位置はキャンバスの高さ-30
var dx = 2;                                         //レンガ崩し用ボールの横xの変化量
var dy = -2;                                        //レンガ崩し用ボールの縦yの変化量
const ballRadius =10;                               //レンガ崩し用ボールの半径

//逃げボールの変数
var nigeBallX = canvas.width/4;                     //逃げるボールの横xの初期位置
var nigeBallY = canvas.height*3/4;                  //逃げるボールの縦yの初期位置
var nigeBallRadius = 25;                            //逃げるボールの半径(初期)

//パドルの変数
const paddleHeight = 10;                            //パドルの高さ
const paddleWidth = 75;                             //パドルのはば
let paddleX=(canvas.width-paddleWidth)/2;          //パドルのx軸上の開始地点

//レンガの変数
const brickRowCount = 5;         //ブロック行の数ではなく列の数　英語でrowは行なのに
const brickColumnCount = 5;      //ブロッック列の数ではなく行の数　英語でcolumnは列なのに
const brickWidth = 75;          //ブロック幅
const brickHeight = 20;         //ブロック高さ
const brickPadding = 10;        //ブロックの詰め物？
const brickOffsetTop = 30;      //ブロックがキャンバスの端に描画されないようにするための上端からの相対位置
const brickOffsetLeft = 30;     //ブロックがキャンバスの端に描画されないようにするための左端からの相対位置



//  キーが押されているかの変数
let rightPressed = false;
let leftPressed =false;
let upPressed = false;
let downPressed = false;

//逃げるボールがレンガに当たっているか判定
let rightRTouch =false;
let leftRTouch =false;
let UpRTouch =false;
let DownRTouch = false;

//スコア
let score =0;

//ライフ
let lives = 3;

//メインキャラのオブジェクトを作成
var kyara = new Object();
kyara.img = new Image();
kyara.img.src = 'img/kyara.png'
kyara.x = 0;
kyara.y = 0;
kyara.move = 0;
kyara.sx = 50;
kyara.sy = 50;


const imageCss = document.getElementById("kyara");


//キーボードのオブジェクトを作成
var key = new Object();
key.up = false;
key.down = false;
key.right = false;
key.left = false;
key.push = '';



//新しいブロックの作成

const bricks=[];                        //レンガは１次元配列？
for(var c=0; c<brickColumnCount; c++)
{
    bricks[c]=[];
    
    //for(let r=0; r<brickRowCout; r++)     //countをcoutと書くと見間違いやすい。
    for(var r=0; r<brickRowCount; r++)
    {
        bricks[c][r] = { x: 0, y: 0, status: 1 };   //描画するかどうかstatusを追加
    }
}



//キーの押す押さないの変数
document.addEventListener("keydown", KeyDownHandler,false);
document.addEventListener("keyup",keyUpHandler,false);

//マウスの動作の監視
//document.addEventListener("mousemove", mouseMoveHandler, false);

//キーが押された時にtrue化
function KeyDownHandler(e){
    if(e.code == "ArrowRight"){
    rightPressed =true;
    }
    else if(e.code == 'ArrowLeft'){
    leftPressed = true;
    }
    else if(e.code == 'ArrowUp'){
    upPressed = true;
    }else if(e.code =='ArrowDown'){
    downPressed = true;
    }
}

//キーが離された時にfalse化
function keyUpHandler(e){
    if(e.code == "ArrowRight"){
    rightPressed =false;
    }
    else if(e.code == 'ArrowLeft'){
    leftPressed = false;
    }
    else if(e.code == 'ArrowUp'){
    upPressed = false;
    }else if(e.code =='ArrowDown'){
    downPressed = false;
    }
}

//マウスの動きと連動
/*
function mouseMoveHandler(e){
    
    
    const relativeX = e.clientX-canvas.offsetLeft; //キャンバスの左端を基準に見た、カーソルの位置
    
    
    if(relativeX > 0 && relativeX < canvas.width){  //カーソルのx座標がキャンバス内なら
        
        //マウスで逃げるボールを動かす場合
        nigeBallX = relativeX;

        
    }

    //yについても
    if(e.clientY > 0 && e.clientY < canvas.height){  //カーソルのy座標がキャンバス内なら
        nigeBallY = e.clientY;
    }
    
    
    
}
*/

//衝突検出関数
function collisionDetection(){
    for(let c = 0; c < brickColumnCount; c++){
        for(let r = 0; r < brickRowCount; r++){
            const b = bricks[c][r];
            if(b.status == 1){
                //ブロック崩し用ボールとレンガの判定
                if( x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight ){  //崩すボールの中心がレンガの範囲内に入ったら
                    dy = -dy;
                    b.status = 0;
                    score++;

                    if(score == brickRowCount*brickColumnCount){
                        alert("You WIN, CONGRATULATIONS!");
                        document.location.reload();
                        //clearInterval(interval);    //Needed for Chrome to end game
                    }
                }

                
                //逃げるボールの外周がレンガの範囲内に入ったら
                
                if( 
                    nigeBallY > b.y-nigeBallRadius            //多分機能する
                    && 
                    nigeBallY < b.y + brickHeight + nigeBallRadius

                    &&
                    nigeBallX > b.x - nigeBallRadius            //多分機能する
                    && 

                    nigeBallX < b.x + brickWidth + nigeBallRadius   //多分機能する
                ){  

                    if
                    (//レンガの上
                        nigeBallX >= b.x              //+ nigeBallRadius
                        && 
                        nigeBallX <= b.x + brickWidth //- nigeBallRadius
                        &&
                        nigeBallY <= b.y
                        &&
                        nigeBallY >= b.y              - nigeBallRadius
                    ){  
                        UpRTouch = true;
                        DownRTouch = false;
                        leftRTouch = false;
                        rightRTouch = false;
                    }
                    else if
                    (//レンガの下

                        nigeBallX >= b.x              //+ nigeBallRadius
                        && 
                        nigeBallX <= b.x + brickWidth //- nigeBallRadius
                        &&
                        nigeBallY >= b.y + brickHeight
                        &&
                        nigeBallY <= b.y + brickHeight + nigeBallRadius
                    ){
                        //alert("正解！")
                        UpRTouch = false;
                        DownRTouch =true;
                        leftRTouch = false;
                        rightRTouch = false;
                    }
                    else if
                    (//レンガの左
                        nigeBallX >= b.x               - nigeBallRadius
                        &&
                        nigeBallX <= b.x
                        &&
                        nigeBallY >= b.y               //+ nigeBallRadius
                        && 
                        nigeBallY <= b.y + brickHeight //- nigeBallRadius
                    ){
                        UpRTouch = false;
                        DownRTouch = false;
                        leftRTouch = true;
                        rightRTouch = false; 
                    }
                    else if
                    (//レンガの右で
                        nigeBallX >= b.x + brickWidth
                        &&
                        nigeBallX <= b.x + brickWidth + nigeBallRadius
                        &&
                        nigeBallY >= b.y              //+ nigeBallRadius
                        && 
                        nigeBallY <= b.y + brickHeight //- nigeBallRadius
                    ){
                        UpRTouch = false;
                        DownRTouch = false;
                        leftRTouch = false;
                        rightRTouch = true;
                    }
                    else if
                    (//レンガの左上の場合
                        nigeBallX >= b.x               - nigeBallRadius
                        &&
                        nigeBallX <= b.x               //+ nigeBallRadius
                        &&
                        nigeBallY >= b.y               - nigeBallRadius
                        &&
                        nigeBallY <= b.y               //+ nigeBallRadius
                        &&
                        //円の中心と角の間の距離　と、　半径を比較
                        nigeBallRadius > Math.sqrt
                        (
                            (b.x               - nigeBallX) * (b.x               - nigeBallX) 
                            + 
                            (b.y               - nigeBallY) * (b.y               - nigeBallY)
                        )
                    ){
                        UpRTouch = true;
                        DownRTouch = false;
                        leftRTouch = true;
                        rightRTouch = false;
                        
                    }
                    else if
                    (//レンガの右上の場合
                        nigeBallX >= b.x + brickWidth //- nigeBallRadius
                        &&
                        nigeBallX <= b.x + brickWidth + nigeBallRadius
                        &&
                        nigeBallY >= b.y               - nigeBallRadius
                        &&
                        nigeBallY <= b.y               //+ nigeBallRadius
                        &&
                        //円の中心と角の間の距離　と、　半径を比較
                        nigeBallRadius > Math.sqrt
                        (
                            (b.x  + brickWidth - nigeBallX) * (b.x  + brickWidth - nigeBallX) 
                            + 
                            (b.y               - nigeBallY) * (b.y               - nigeBallY)
                        )
                    ){
                        UpRTouch = true;
                        DownRTouch = false;
                        leftRTouch = false;
                        rightRTouch = true;
                    }
                    else if
                    (//レンガの左下の場合

                        nigeBallX >= b.x               - nigeBallRadius
                        &&
                        nigeBallX <= b.x               //+ nigeBallRadius
                        &&
                        nigeBallY >= b.y + brickHeight //- nigeBallRadius
                        &&
                        nigeBallY <= b.y + brickHeight + nigeBallRadius
                        &&
                        //円の中心と角の間の距離　と、　半径を比較
                        nigeBallRadius > Math.sqrt
                        (
                            (b.x                - nigeBallX) * (b.x               - nigeBallX) 
                            + 
                            (b.y  + brickHeight - nigeBallY) * (b.y + brickHeight - nigeBallY)
                        )
                    ){
                        UpRTouch = false;
                        DownRTouch = true;
                        leftRTouch = true;
                        rightRTouch = false;
                    }
                    else if
                    (//レンガの右下の場合
                        nigeBallX >= b.x + brickWidth //- nigeBallRadius
                        &&
                        nigeBallX <= b.x + brickWidth + nigeBallRadius
                        &&
                        nigeBallY >= b.y + brickHeight //- nigeBallRadius
                        &&
                        nigeBallY <= b.y + brickHeight + nigeBallRadius
                        &&
                        //円の中心と角の間の距離　と、　半径を比較
                        nigeBallRadius > Math.sqrt
                        (
                            (b.x  + brickWidth - nigeBallX) * (b.x  + brickWidth - nigeBallX) 
                            + 
                            (b.y  + brickHeight - nigeBallY) * (b.y + brickHeight - nigeBallY)
                        )
                    ){
                        UpRTouch = false;
                        DownRTouch = true;
                        leftRTouch = false;
                        rightRTouch = true;
                    }else{
                        leftRTouch = false;
                        rightRTouch = false;
                        UpRTouch = false;
                        DownRTouch = false;
                    }
                }
                

            }
        }
    }
}


//スコアを描画
function drawScore(){
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    //ctx.fillText("Score: " +score ,8,20);
    ctx.fillText("Score: " +score +"　レンガ崩しを邪魔しないように避けよう！",8,20);
}

//ライフカウンタ
function drawLives(){
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: " +lives,canvas.width-65,20);
}


//ブロック崩し用ボールの描画
function drawBall()
{
    ctx.beginPath();                            //ブロック崩し用ボールの描画開始
    //ctx.arc(x, y, 10, 0, Math.PI*2 );
    ctx.arc(x, y, ballRadius, 0, Math.PI*2 );   //ブロック崩し用ボールの半径固定
    ctx.fillStyle ="#0095DD";                   //ブロック崩し用ボールの色の指定
    ctx.fill();                                 //ブロック崩し用ボールを色で満たす
    ctx.closePath();                            //ブロック崩し用ボールの描画を終了
}

//パドルの描画 
function drawPaddle(){
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight,paddleWidth, paddleHeight);
    ctx.fillStyle="#0095DD";
    ctx.fill();
    ctx.closePath;
}

//逃げるボールの描画
function drawNigeBall(){
    ctx.beginPath();                            //逃げるボールの描画開始
    ctx.arc(nigeBallX, nigeBallY, nigeBallRadius, 0, Math.PI*2 );   //逃げるボールの半径固定
    ctx.fillStyle ="#32DD32";                   //逃げるボールの色の指定
    ctx.fill();                                 //逃げるボールの図形を色で満たす
    ctx.closePath();                            //逃げるボールの描画を終了
}

//セリフを描画
/*
function drawSerihu(){
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("デッカチャンだよっ" ,8,300);
}
*/


function sleep(waitMsec){
    var startMsec = new Date();
    
    //指定ミリ秒間だけループさせる(CPUは常にビジー状態)
    while (new Date() - startMsec < waitMsec);
    //while (new Date() = startMsec < waitMsec);
}

//ブロック描画ロジック
function drawBricks(){
    for(let c =0; c < brickColumnCount; c++){
        for(let r = 0; r < brickRowCount; r++){

            //描画するか判定
            if(bricks[c][r].status == 1){

                //レンガの位置
                var brickX = (r*(brickWidth + brickPadding))+brickOffsetLeft;
                var brickY = (c*(brickHeight+brickPadding))+brickOffsetTop;

                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;

                ctx.beginPath();
                //ctx.rect(0,0,brickWidth,brickHeight);     //改変前
                ctx.rect(brickX,brickY,brickWidth,brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}


//描画全体について
function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);   //全体の長方形を消去
    drawBricks();                                       //レンガの描写
    drawBall();                                         //ブロック崩し用ボールを描画
    drawPaddle();                                       //パドルの描画
    drawScore();                                        //スコアの表示
    drawLives();                                        //ライフの表示
    collisionDetection();                               //レンガの衝突判定
    drawNigeBall();                                     //逃げるボールを描画

    //kyara画像の位置の調整
    kyara.x = nigeBallX-kyara.sx/2;
    kyara.y = nigeBallY-kyara.sy/2;
    
    
    
    //画面にkyara画像を表示する
    ctx.drawImage(kyara.img,kyara.x,kyara.y,kyara.sx,kyara.sy);



    //逃げるボールと崩すボールが接触したか判定
    if(
        Math.sqrt(
            (nigeBallX - x)*(nigeBallX - x) + (nigeBallY - y) * (nigeBallY - y)
            )
        <
        //nigeBallRadius - ballRadius
        nigeBallRadius + ballRadius
    ){
        lives--;    //ライフが１つ減る。
        //kyara.sizep +=1;    //サイズポイントを追加
        //kyara.hit = true;    //ヒット判定

        if(!lives){
            alert("GAME OVER");
            document.location.reload();
        }else{
            //drawSerihu();

            
            sleep(300);
            alert("邪魔しちゃったね")
            //alert("1秒経過");

            //alert("デッカチャンだよ")   //これをやると逃げボールの位置がバグる←sleepで1秒待ったら何故か位置がバグらない。←sleepがalertより先の場合。sleepが後だとバグる
            //キャラクター画像サイズを巨大化
            kyara.sx *= 2.0;
            kyara.sy *= 2.0;
            

            x = canvas.width/2;                             //崩すボールx座標を初期位置に戻す。
            y = canvas.height-30;                             //崩すボールy座標を初期位置に戻す。
            dx =2;
            dy=-2;
            paddleX=(canvas.width-paddleWidth)/2;           //パドルを初期位置に戻す。

            nigeBallX = canvas.width/4;                     //逃げるボールの横xの初期位置に戻す
            nigeBallY = canvas.height*3/4;                  //逃げるボールの縦yの初期位置に戻す。
            nigeBallRadius = 1.7*nigeBallRadius;              //逃げるボールのサイズを1.7倍にする。
        }
    }

    //崩すボールがキャンバス左右の壁に達したら
    if(x+dx > canvas.width-ballRadius || x+dx <ballRadius)  //ボールがキャンバスの端に到達した場合
    {
        dx=-dx;
    }

    //崩すボールが上端か下端に達したら
    if(y+dy < ballRadius)   //崩すボールがキャンバスの上端についた時
    {
        dy = -dy;
    } else if(y+dy > canvas.height-ballRadius)  //崩すボールがキャンバスの下端についた時
    {

        //パドルが自動で崩すボールを追尾するバージョンの場合
        dy = -dy;
    }

    //逃げるボールの移動変数の制御   Xについて
    if(rightPressed && nigeBallX < canvas.width-nigeBallRadius){
    if(!leftRTouch){
        nigeBallX += 3;
    }
    }
    else if(leftPressed && nigeBallX > nigeBallRadius ){
    if(!rightRTouch){
        nigeBallX -= 3;
    }
    }

    //逃げるボールの移動変数の制御   Yについて
    if(upPressed && nigeBallY > nigeBallRadius ){
    if(!DownRTouch){
        nigeBallY -= 3;
    }
    }
    else if(downPressed && nigeBallY < canvas.height-nigeBallRadius ){
    if(!UpRTouch){
        nigeBallY += 3;
    }
    }

    //レンガに逃げるボールが触れたかの判定をリセット
    leftRTouch = false;
    rightRTouch = false;
    UpRTouch = false;
    DownRTouch = false;


    //パドルの移動変数の制御　ボールについていくバージョン
    paddleX = x-paddleWidth/2;

    x += dx;                                            //次のx描画位置を微修正
    y += dy;                                            //次のy描画位置を微修正

    requestAnimationFrame(draw);
}
draw();