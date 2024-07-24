const sliderInput = document.querySelector('.slider');
const dataLengthDisplay = document.querySelector('.dataLengthNum');

const passDisplay = document.querySelector('.password');
const passCopyBtn = document.querySelector('.copyBtn');
const copyPass = document.querySelector('.copyPass');
const upperCaseCheck = document.querySelector('#upperCase');
const lowerCaseCheck = document.querySelector('#lowerCase');
const numbersCheck = document.querySelector('#numbers');
const symbolsCheck = document.querySelector('#symbols');
const dataIndicator = document.querySelector('.dataIndicator');
const generateBtn = document.querySelector('.generateBtn');
const allCheckBoxes = document.querySelectorAll('input[type=checkbox]');
const symbols = "!@#$%^&*()_+-=[]{};':/\|,.<>/?";

let password = "";
let passLength = 10;
let checkInitial = 1;
setLength();

// set password length
function setLength() {
    sliderInput.value = passLength;
    dataLengthDisplay.innerText = passLength;
}

// color indicator
function colorIndicator(color) {
    dataIndicator.style.backgroundColor = color;
    dataIndicator.style.boxShadow = '10px 10px 5px #888888';
}

// getting random integer
function randomInt(min,max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function getRandomNum() {
    return randomInt(0,9);
}

function getLowerCase() {
    return String.fromCharCode(randomInt(97, 123));
}

function getUpperCase() {
    return String.fromCharCode(randomInt(65, 90));
}

function getSymbol() {
    return symbols[randomInt(0,symbols.length)];
}

// password strength check
function checkStrength() {
    let hasUpperCase = false;
    let hasLowerCase = false;
    let hasNumber = false;
    let hasSymbol = false;
    if(upperCaseCheck.checked) {
        hasUpperCase = true;
    }
    if(lowerCaseCheck.checked) {
        hasLowerCase = true;
    }
    if(numbersCheck.checked) {
        hasNumber = true;
    }
    if(symbolsCheck.checked) {
        hasSymbol = true;
    }

    if (hasUpperCase && hasLowerCase && (hasNumber || hasSymbol) && passLength >= 9) {
        colorIndicator("#0f0");
    } else if ((hasUpperCase || hasLowerCase) && (hasNumber || hasSymbol) && passLength >= 6) {
        colorIndicator("#ff0");
    } else {
        colorIndicator("#f00");
    }
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passDisplay.value);
        copyPass.innerText = "Copied!";
    }
    catch (err) {
        copyPass.innerText = "Failed to copy!";
    }
    // to make copy wala span visible
    copyPass.classList.add('active');
    setTimeout(() => {
        copyPass.classList.remove('active');
    }, 2000);
}

// event listeners
sliderInput.addEventListener('input', (event) => {
    passLength = event.target.value;
    setLength();
});

passCopyBtn.addEventListener('click', () => {
    if (passDisplay.value) {
        copyContent();
    }
});

function checkBoxChange() {
    let checkInitial = 1;
    if (this.checked) {
        checkInitial++;
    }

    // special condition
    if (passLength < checkInitial) {
        passLength = checkInitial;
        setLength();
    }
}

function shufflePass(password) {
    let array = password.split('');
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array.join('');
}

allCheckBoxes.forEach(checkbox => {
    checkbox.addEventListener('change', checkBoxChange);
});

generateBtn.addEventListener('click', () => {
    // none of the checkboxes are checked
    if (checkInitial <= 0) return;

    if (passLength < checkInitial) {
        passLength = checkInitial;
        setLength();
    }

    // starting to find new pass

    // first remove the previous pass
    password = "";

    // for checkboxes
    let functionArray = [];
    for (let i = 0; i < upperCaseCheck.checked; i++) {
        functionArray.push(getUpperCase);
    }
    for (let i = 0; i < lowerCaseCheck.checked; i++) {
        functionArray.push(getLowerCase);
    }
    for (let i = 0; i < numbersCheck.checked; i++) {
        functionArray.push(getRandomNum);
    }
    for (let i = 0; i < symbolsCheck.checked; i++) {
        functionArray.push(getSymbol);
    }

    // cumpulsory addition 
    for(let i=0; i<functionArray.length; i++)
        password += functionArray[i]();

    // remaining addition
    for(let i=0; i<passLength-functionArray.length; i++) {
        let randomIndex = randomInt(0,functionArray.length);
        password += functionArray[randomIndex]();
    }

    // shuffling elements
    password = shufflePass(password);
    // show in ui
    passDisplay.value = password;
    // calculate strength
    checkStrength();
});
