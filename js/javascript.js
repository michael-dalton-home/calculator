const keyArea = document.querySelector("#key-area");
const display = document.querySelector("#digi-display");
const modifier= document.querySelector("#digi-modifier");

const DEF_DISP = '0';       // Default display sequence
const DISP_LEN = 8;         // Max number of characters in display
const DIVIDE   = "\u00f7";  // Division character
const BKSPACE  = "\u2190";  // Backspace character

let accumulator = 0;        // Total so far
let valQueue    = [];       // Holds the initial operand(s)


/* Add all the key button objects to the display key-area
* CSS will sort the rest out using key-class and key-row
*/
function buildKeysMatrix() {
    const keyMatrix = 
        [
            [7,8,9,DIVIDE,'AC'],
            [4,5,6,'x',BKSPACE],
            [1,2,3,'-'],
            [0,'.','=','+']
        ];
    let row, key;

    for (let r=0;r<keyMatrix.length;r++) {
        row = document.createElement('div');
        row.classList = 'key-row';

        for (let k=0; k<keyMatrix[r].length; k++) {
            key = document.createElement('div');
            key.classList = 'key-class';
            key.textContent = keyMatrix[r][k];
            row.appendChild(key);
        }

        keyArea.appendChild(row);
   }
}

/* Calculate - perform action based on the latest event
* ev  - latest key press, to be actioned
* op  - goal operation (if we have one yet)
* str - latest operand (entered into display)
*/
function processOp(ev, op, str) {
    switch (ev) {
    case '=':
        if (valQueue.length) {
            switch (op) {
            case '+':   return (+valQueue.shift() + +str).toString();
            case '-':   return (+valQueue.shift() - +str).toString();
            case DIVIDE:return Math.floor(+valQueue.shift() / +str).toString();
            case 'x':   return (+valQueue.shift() * +str).toString();
            }
        }
        break;

    case '+':
    case '-':
    case DIVIDE:      // Divide
    case 'x':
        if (op === '' && !valQueue.length) {
            valQueue.push(+str);
        }
        break;

    case 'AC':
        valQueue.length = [];
        break;
    }
}

/* Listener callback event (attached to key-area)
*/
function handleKeyPress(ev) {
    console.log('Key '+ev.target.textContent);

    switch (ev.target.textContent) {
    case '0':
    case '1':
    case '2':
    case '3':
    case '4':
    case '5':
    case '6':
    case '7':
    case '8':
    case '9':
        if (display.textContent === DEF_DISP)
            display.textContent = ev.target.textContent;
        else if (display.textContent.length < 8)
            display.textContent += ev.target.textContent;
        break;

    case '+':
    case '-':
    case DIVIDE:
    case 'x':
        if (modifier.textContent === '') {
            processOp(ev.target.textContent, 
                modifier.textContent, display.textContent);
            display.textContent  = DEF_DISP;
            modifier.textContent = ev.target.textContent;
        }
        break;

    case 'AC':
        modifier.textContent = '';
        display.textContent = DEF_DISP;
        processOp(ev.target.textContent, 
                modifier.textContent, display.textContent);
        break;

    case BKSPACE:
        display.textContent = display.textContent.slice(0, -1);
        if (display.textContent === '')
            display.textContent = DEF_DISP;
        break;

    case '=':
        display.textContent = processOp(ev.target.textContent, 
                modifier.textContent, display.textContent);
        modifier.textContent = '';
        break;
    }
}

/** MAIN 
 * 
 */
{
    buildKeysMatrix();
    display.textContent = DEF_DISP;
    keyArea.addEventListener('click', handleKeyPress);
}