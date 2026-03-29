let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset-btn");
let newGameBtn = document.querySelector("#new-game-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");

let turn0 = true; // true = O, false = X

// =============================================
//  SOUNDS — Web Audio API (no files needed)
// =============================================
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playWinSound() {
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + i * 0.15);
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime + i * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + i * 0.15 + 0.4);
        osc.start(audioCtx.currentTime + i * 0.15);
        osc.stop(audioCtx.currentTime + i * 0.15 + 0.4);
    });
}

function playDrawSound() {
    const notes = [400, 350, 300, 250];
    notes.forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + i * 0.2);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime + i * 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + i * 0.2 + 0.3);
        osc.start(audioCtx.currentTime + i * 0.2);
        osc.stop(audioCtx.currentTime + i * 0.2 + 0.3);
    });
}

// =============================================

const winpatterns = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [3, 4, 5],
    [6, 7, 8]
];

// Add click event to each box
boxes.forEach((box) => {
    box.addEventListener("click", () => {
        if (box.disabled || box.innerText !== "") return;

        if (turn0) {
            box.innerText = "O";
            box.style.color = "blue";
            turn0 = false;
        } else {
            box.innerText = "X";
            box.style.color = "red";
            turn0 = true;
        }

        box.disabled = true;

        // ✅ NO sounds here — only play on win or draw
        if (!checkWinner()) {
            checkDraw();
        }
    });
});

// Disable all boxes
const disableBoxes = () => {
    boxes.forEach((box) => {
        box.disabled = true;
    });
};

// Enable all boxes (reset)
const enableBoxes = () => {
    boxes.forEach((box) => {
        box.disabled = false;
        box.innerText = "";
        box.style.color = "";
    });
};

// Show winner message
const showWinner = (winner) => {
    msg.innerText = `🎉 Congratulations! ${winner} wins!`;
    msgContainer.classList.add("show");
    msgContainer.classList.remove("hide");
    playWinSound(); // ✅ plays ONLY on win
};

// Check winner logic
const checkWinner = () => {
    for (let pattern of winpatterns) {
        let pos1Val = boxes[pattern[0]].innerText;
        let pos2Val = boxes[pattern[1]].innerText;
        let pos3Val = boxes[pattern[2]].innerText;

        if (
            pos1Val !== "" &&
            pos1Val === pos2Val &&
            pos2Val === pos3Val
        ) {
            showWinner(pos1Val);
            disableBoxes();
            return true;
        }
    }
    return false;
};

const checkDraw = () => {
    let isDraw = true;

    boxes.forEach((box) => {
        if (box.innerText === "") {
            isDraw = false;
        }
    });

    if (isDraw) {
        msg.innerText = "😐 It's a Draw!";
        msgContainer.classList.add("show");
        msgContainer.classList.remove("hide");
        playDrawSound(); // ✅ plays ONLY on draw
        disableBoxes();
    }
};

// Reset game
const resetGame = () => {
    turn0 = true;
    enableBoxes();
    msgContainer.classList.remove("show");
};

// Buttons
newGameBtn.addEventListener("click", resetGame);
resetBtn.addEventListener("click", resetGame);