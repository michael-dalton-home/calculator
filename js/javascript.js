const keyArea = document.querySelector("#key-area");
const display = document.querySelector("#digi-display");
const modifier= document.querySelector("#digi-modifier");

const DEF_DISP = '0';               // Default display sequence
const DISP_LEN = 8;                 // Max number of characters in display
const DIVIDE   = "\u00f7";          // Division character
const BKSPACE  = "\u2190";          // Backspace character
const CLEAR    = 'AC';              // Clear operation

const STATE_DEFAULT         = 1;    // Reset state
const STATE_FIRST_NUMBER    = 2;    // Collect first number
const STATE_SECOND_NUMBER   = 3;    // Collect subsequent number

let accumulator = 0;                // Total so far
let valQueue    = [];               // Holds the initial operand(s)

let inBuffer    = '';
let inDisplay   = DEF_DISP;
let inState     = STATE_DEFAULT;


/* Add all the key button objects to the display key-area
* CSS will sort the rest out using key-class and key-row
*/
function buildKeysMatrix() {
    const keyMatrix = 
        [
            [7,8,9,DIVIDE,CLEAR],
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

function stateDefault(ev) {
    valQueue = [];
    inBuffer   = '';
    inDisplay  = DEF_DISP;
    inModifier = '';
    return STATE_FIRST_NUMBER;
}

function stateFirstNumber(ev) {
    let state = STATE_FIRST_NUMBER;

    if ('0123456789'.includes(ev)) {
        if (inBuffer === '') {
            inBuffer = ev;
            inDisplay = ev;

        } else if (inBuffer.length < DISP_LEN) {
            if ((ev === '0' && inBuffer !== '0') ||
                (ev !== '0')) {
                inBuffer += ev;
                inDisplay += ev;
            }
        }
    
    } else if (ev === BKSPACE) {
        if (inBuffer !== '') {
            inBuffer  = inBuffer.slice(0, -1);
            inDisplay = inBuffer;
            if (inDisplay === '')
                inDisplay = DEF_DISP;
        } 
    
    } else if (`+-x${DIVIDE}`.includes(ev)) {
        if (inBuffer !== '') {
            /* Push number and operation to queue */
            valQueue.push(+inBuffer);
            valQueue.push(ev);
            inModifier = ev;
            console.log('Adding first num '+inBuffer+' and operation '+ev);

            inBuffer = '';
            state = STATE_SECOND_NUMBER;
        }
    }

    return state;
}

function stateSecondNumber(ev) {
    let state = STATE_SECOND_NUMBER;

    if ('0123456789'.includes(ev)) {
        if (inBuffer === '') {
            inBuffer = ev;
            inDisplay = ev;

        } else if (inBuffer.length < DISP_LEN) {
            if ((ev === '0' && inBuffer !== '0') ||
                (ev !== '0')) {
                inBuffer += ev;
                inDisplay = inBuffer;
            }
        }
    
    } else if (ev === BKSPACE) {
        if (inBuffer !== '') {
            inBuffer  = inBuffer.slice(0, -1);
            inDisplay = inBuffer;
            if (inDisplay === '')
                inDisplay = ''+valQueue[0];
        }
    
    } else if (`+-x${DIVIDE}=`.includes(ev)) {
        if (inBuffer !== '') {
            /* Push number and operation to queue */
            valQueue.push(+inBuffer);

            if (ev !== '=') {
                valQueue.push(ev);
                inModifier = ev;
            } else {
                inModifier = '';
            }

            console.log('Adding second num '+inBuffer+' and operation '+ev);

            inDisplay = performOperation();
            inBuffer = '';
        }
    }

    return state;
}

function performOperation() {
    ret = inDisplay;

    /* Perform calculation if num + op + num (+ op) */
    if (valQueue.length > 2) {
        let total = +valQueue.shift();
        switch (valQueue.shift()) {
        case '+':   total += +valQueue.shift(); break;
        case '-':   total -= +valQueue.shift(); break;
        case DIVIDE:total /= +valQueue.shift(); break;
        case 'x':   total *= +valQueue.shift(); break;
        }

        valQueue.unshift(total);    // Push calc to front of queue

        console.log('Resultant operand '+total);
        ret = total.toString();
    }

    return ret;
}

function stateProcessor(ev) {
    let retState = undefined;

    if (ev === CLEAR) {
        inState = STATE_DEFAULT;
    }

    switch (inState) {
    case STATE_DEFAULT:         retState = stateDefault(ev);      break;
    case STATE_FIRST_NUMBER:    retState = stateFirstNumber(ev);  break;
    case STATE_SECOND_NUMBER:   retState = stateSecondNumber(ev); break;
    }

    if (inState !== retState) {
        console.log('State changed from '+inState+' to '+retState);
        inState = retState;
    }

    return retState;
}

/* Listener callback event (attached to key-area)
*/
function handleMousePress(ev) {
    console.log('Key '+ev.target.textContent);

    stateProcessor(ev.target.textContent);

    display.textContent = inDisplay;
    modifier.textContent= inModifier;
}

/** MAIN 
 * 
 */
{
    buildKeysMatrix();
    display.textContent = DEF_DISP;
    stateProcessor(CLEAR);
    keyArea.addEventListener('click', handleMousePress);
}