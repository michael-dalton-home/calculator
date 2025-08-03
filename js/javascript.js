const keyArea = document.querySelector("#key-area");
const display = document.querySelector("#digi-display");
const modifier= document.querySelector("#digi-modifier");

const DEF_DISP = '0';       // Default display sequence
const DISP_LEN = 8;         // Max number of characters in display

let accumulator = 0;        // Total so far


function buildKeysMatrix() {
    const keyMatrix = 
        [
            [7,8,9,"\u00f7",'AC'],
            [4,5,6,'x',"\u2190"],
            [1,2,3,'-'],
            [0,'.','=','+']
        ];
    let row, key;

    for (r=0;r<keyMatrix.length;r++) {
        row = document.createElement('div');
        row.classList = 'key-row';

        for (k=0; k<keyMatrix[r].length; k++) {
            key = document.createElement('div');
            key.classList = 'key-class wdxl-lubrifont-tc-regular';
            key.textContent = keyMatrix[r][k];
            row.appendChild(key);
        }

        keyArea.appendChild(row);
   }
}

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
        case "\u00f7":      // Divide
        case 'x':
            if (modifier.textContent === '') {
                //calculate(ev.target.textContent);
                display.textContent = DEF_DISP;
            }
            modifier.textContent = ev.target.textContent;
            break;
        case 'AC':
            modifier.textContent = '';
            display.textContent = DEF_DISP;
            break;
        case '\u2190':      // Backspace
            display.textContent = display.textContent.slice(0, -1);
            if (display.textContent === '')
                display.textContent = DEF_DISP;
            break;
        case '=':
            if (modifier.textContent) {
                //calculate(ev.target.textContent);
            }
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