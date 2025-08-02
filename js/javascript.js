
function buildKeysMatrix() {
    const keyMatrix = 
        [
            [7,8,9,"\u00f7",'AC'],
            [4,5,6,'x'],
            [1,2,3,'-'],
            [0,'.','=','+']
        ];
    const keyArea = document.querySelector("#key-area");
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


/** MAIN 
 * 
 */
{
    buildKeysMatrix();
}