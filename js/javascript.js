const keyArea = document.querySelector("#key-area");
const display = document.querySelector("#digi-display");
const modifier= document.querySelector("#digi-modifier");

const SECRET_FLAG = ' ';            // Used to prepend a displayed number to
                                    // remind display handler that although we are
                                    // displaying a placemarker, the user still has 
                                    // to enter a real number before a calc can occur
const DEF_DISP = SECRET_FLAG+'0';   // Default display sequence
const DISP_LEN = 8;                 // Max number of characters in display
const DIVIDE   = "\u00f7";          // Division character
const BKSPACE  = "\u2190";          // Backspace character

let accumulator = 0;                // Total so far
let valQueue    = [];               // Holds the initial operand(s)


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
* str - latest operand (entered into display)
* Return - Resultant number to display on screen (string)
*/
function processOp(ev, str) {

    /* Clear calc and return */
    if (ev === 'AC') {
        valQueue.length = [];
        return DEF_DISP;
    }

    /* Push number and operation to queue */
    valQueue.push(+str);
    valQueue.push(ev);
    console.log('Adding operand '+str+' and operation '+ev);

    /* Perform calculation if num + op + num (+ op) */
    if (valQueue.length > 2) {
        let total = +valQueue.shift();
        switch (valQueue.shift()) {
        case '+':   total += +valQueue.shift(); break;
        case '-':   total -= +valQueue.shift(); break;
        case DIVIDE:total /= +valQueue.shift(); break;
        case 'x':   total *= +valQueue.shift(); break;
        }

        if (ev === '=') 
            valQueue = [];              // Calc is complete, clear queue
        else
            valQueue.unshift(total);    // Push calc to front of queue

        console.log('Resultant operand '+total);
        return total.toString();
    }

    /* Return current number by default */
    return str;
}

/* Listener callback event (attached to key-area)
*/
function handleKeyPress(ev) {
    console.log('Key '+ev.target.textContent);

    if ('0123456789'.includes(ev.target.textContent)) {
        if (display.textContent[0] === SECRET_FLAG)
            display.textContent = ev.target.textContent;

        else if (display.textContent.length < 8)
            display.textContent += ev.target.textContent;
    
    } else if (`+-x${DIVIDE}`.includes(ev.target.textContent)) {
        modifier.textContent = ev.target.textContent;
        display.textContent  = SECRET_FLAG+processOp(
            ev.target.textContent, display.textContent);

    } else if (ev.target.textContent === 'AC') {
        modifier.textContent = '';
        display.textContent  = processOp(
            ev.target.textContent, display.textContent);

    } else if (ev.target.textContent === BKSPACE) {
        display.textContent = display.textContent.slice(0, -1);
        if (display.textContent === '' || display.textContent === SECRET_FLAG)
            display.textContent = DEF_DISP;

    } else if (ev.target.textContent === '=') {
        modifier.textContent = '';
        display.textContent  = SECRET_FLAG+processOp(
            ev.target.textContent, 
            (display.textContent[0] === SECRET_FLAG)?
            DEF_DISP:display.textContent);
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