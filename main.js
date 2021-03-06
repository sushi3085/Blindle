var score = 0;
var blockNumber = 4;
var grayNumber = 0//! 0 to 225, plus 30 for level 1
var scaleNumber = 40;
var answerBlockId = null;
const MAX_VALUE = 255;
var level = 0;
var loss = false;
var fadedBlockIds = [];

var allBlocks = document.getElementsByClassName("block");

function onStartInit() {
    grayNumber = randIntUntil(MAX_VALUE - scaleNumber + 1);
    for (let i = 0; i < blockNumber; i++) {
        allBlocks[i].style.background = toHex(grayNumber);
    }

    answerBlockId = randIntUntil(blockNumber);
    allBlocks[answerBlockId].style.background = toHex(grayNumber + scaleNumber);

    visiblizeBlockNumber(blockNumber);
}

function randIntUntil(until) {
    return Math.floor(Math.random() * until);
}

function toHex(d) {
    map = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];
    let result = d.toString(16);

    if (d < 16) result = "0" + result;

    return "#" + result + result + result;
}

function visiblizeBlockNumber(n) {
    let width = getBlockWidth(Math.sqrt(n));

    for (let i = 0; i < n; i++) {
        allBlocks[i].style.display = "block";
        allBlocks[i].style.width = width + "px";
        allBlocks[i].style.height = width + "px";
        // allBlocks[i].style.opacity = "1";
    }
}

function getBlockWidth(rowBlockNumber) {
    let container = document.getElementById("board");
    let cWidth = container.clientWidth;
    let width = cWidth / rowBlockNumber - 6;//! px
    return width;
}

// * main function
function clicked(blockId) {
    if (loss) return true;

    if (blockId == answerBlockId && !loss) {
        //* for clearing the welcome words
        if (score === 0) {
            let temp = document.getElementsByClassName("welcome");
            for (let i = 0; i < temp.length; i++) {
                temp[i].style.visibility = "hidden";
            }
            //* show credit
            document.getElementsByClassName("btDiv")[0].style.visibility = "";
        }

        //* you won the game!
        if (score === 80) {
            alert("you cleared all stages!");
            alert("C O N L A D U G R A T I O N S");
            // TODO : show restart btn;
            document.getElementById("restartBtnBox").style.visibility = "visible";
            return true;
        }

        if ((score) % 5 === 0) {
            level++;
            console.log("level now : " + level);

            //* response visible blocks to the correspond level
            switch (level) {
                case 2:
                    blockNumber = 9;
                    visiblizeBlockNumber(blockNumber);
                    break;

                case 4:
                    blockNumber = 16;
                    visiblizeBlockNumber(blockNumber);
                    break;

                default:
                    break;
            }
        }

        score++;
        refresh();
        return true;
    }
    //* wrong answer
    else {
        // if (loss) return true;
        fadedBlockIds = dimmingBlocks();
        loss = true;

        // TODO : jump out restart windows
        document.getElementById("restartBtnBox").style.visibility = "visible";
    }
}

function refresh() {
    grayNumber = randIntUntil(MAX_VALUE - scaleNumber - 1);
    for (let i = 0; i < blockNumber; i++) {
        allBlocks[i].style.background = toHex(grayNumber);
    }
    let rand = randIntUntil(blockNumber);
    allBlocks[rand].style.background = toHex(grayNumber + scaleNumber - (level + 5) * 2);

    //! set answerBlickId
    answerBlockId = rand;

    //! add score, show score
    // score++;
    document.getElementById("score").innerHTML = "" + score;
}

function dimmingBlocks() {
    // var dim = function(id){

    //     f = setInterval((id) => {
    //         //! dim 10 % each time
    //         allBlocks[id].style.opacity = `${(+allBlocks[id].style.opacity)+0.1}`;
    //         // console.log(allBlocks[id]);
    //     }, 100, id);
    //     setTimeout(() => {
    //         clearInterval(f);
    //     }, 1000);
    // };
    // TODO : show neightbor blocks at the end of the game.
    let rawNum = Math.sqrt(blockNumber);

    let Ax = Math.floor(answerBlockId / rawNum);
    let Ay = answerBlockId % rawNum;

    let toggledIds = [];

    for (let id = 0; id < blockNumber; id++) {
        let x = Math.floor(id / rawNum);
        let y = id % rawNum;

        if (id == answerBlockId) {
            continue
        }
        if (y == Ay) {
            if (x + 1 == Ax || x - 1 == Ax)
                continue;
        }
        if (x == Ax) {
            if (y + 1 == Ay || y - 1 == Ay)
                continue;
        }
        allBlocks[id].classList.toggle('fade');
        toggledIds.push(id);
    }
    return toggledIds;
}

function restartBtnClick() {
    let btn = document.getElementById("restartBtnBox");
    btn.style.visibility = "hidden";

    //* record high score
    let highest = score;
    if(Cookies['HIGH_SCORE'] !== undefined){
        highest = Math.max(+Cookies['HIGH_SCORE'], score);
    }
    console.log(highest)
    Cookies.create("HIGH_SCORE", "" + highest, 30);
    readHighScore();

    //* initiate everything
    blockNumber = 4;
    scaleNumber = 40;
    level = 0;
    score = 0;
    answerBlockId = null;
    loss = false;

    // * set visible
    // for(let i=0; i<blockNumber; i++){
    //     allBlocks[i].style.display = "block";
    //     // allBlocks[i].style.opacity = "1";
    //     allBlocks[i].classList.toggle("fade");
    // }
    //* set display => none
    for (let i = 4; i < allBlocks.length; i++) {
        allBlocks[i].style.display = "none";
        if (allBlocks[i].style.display == "block") {
            allBlocks[i].style.display = "none";
        }
    }
    //* reverse not faded blocks => into not faded
    fadedBlockIds.forEach((e) => {
        allBlocks[e].classList.toggle('fade');
    });
    visiblizeBlockNumber(blockNumber);
    document.getElementById("score").innerHTML = "0";
    refresh();
}

function readHighScore() {
    if(Cookies['HIGH_SCORE'])
        document.getElementById("highScore").innerHTML = "High Score: " + Cookies['HIGH_SCORE'];
    else
        document.getElementById("highScore").innerHTML = "High Score: 0";
}

onStartInit();
readHighScore();