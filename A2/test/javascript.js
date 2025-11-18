const mainDisplay = document.getElementById('main-display');
const historyDisplay = document.getElementById('history-display');

let currentInput = '0';
let expression = '';
let isNewCalculation = true;
let waitingForExponent = false;

// Update display
function updateDisplay() {
    mainDisplay.textContent = currentInput;
    historyDisplay.textContent = expression;
}

// Number, decimal, parentheses input
function appendInput(value) {
    if (isNewCalculation) {
        currentInput = (value === '.') ? '0.' : value;
        expression = '';
        isNewCalculation = false;
    } else if (currentInput === '0' && value !== '.') {
        currentInput = value;
    } else {
        currentInput += value;
    }

    if (['(', ')', '.', '00'].includes(value) || !isNaN(parseFloat(value))) {
        expression += value;
    }

    updateDisplay();
}

// Operators
function appendOperator(operator) {
    if (isNewCalculation) {
        expression = currentInput + operator;
        isNewCalculation = false;
    } else {
        const lastChar = expression.slice(-1);
        if (['+', '-', '*', '/', '%', '^'].includes(lastChar)) {
            expression = expression.slice(0, -1) + operator;
        } else {
            expression += operator;
        }
    }
    currentInput = operator;
    updateDisplay();
}

// Clear and Delete
function clearDisplay() {
    currentInput = '0';
    expression = '';
    isNewCalculation = true;
    waitingForExponent = false;
    updateDisplay();
}

function deleteLast() {
    if (currentInput.length > 1) currentInput = currentInput.slice(0, -1);
    else currentInput = '0';

    if (expression.length > 0) expression = expression.slice(0, -1);

    updateDisplay();
}

// Equal
function calculateResult() {
    if (expression === '') return;
    let finalExpression = expression.replace(/π/g, 'Math.PI').replace(/\^/g, '**');
    try {
        const result = new Function('return ' + finalExpression)();
        historyDisplay.textContent = expression + ' =';
        currentInput = result.toString();
        expression = currentInput;
        isNewCalculation = true;
        updateDisplay();
    } catch {
        currentInput = 'Error';
        historyDisplay.textContent = 'Invalid Expression';
        isNewCalculation = true;
        updateDisplay();
    }
}

// π insertion
function insertPi() {
    appendInput('π');
    currentInput = 'π';
    updateDisplay();
}

// Scientific functions
function calculateScientific(func) {
    let value = parseFloat(currentInput);
    if (isNaN(value)) value = 0;
    let result;
    let funcSymbol = '';

    switch (func) {
        case 'sin':
            result = Math.sin(value * Math.PI/180);
            funcSymbol = `sin(${value}°)`; break;
        case 'cos':
            result = Math.cos(value * Math.PI/180);
            funcSymbol = `cos(${value}°)`; break;
        case 'tan':
            result = Math.tan(value * Math.PI/180);
            funcSymbol = `tan(${value}°)`; break;
        case 'log':
            result = Math.log10(value);
            funcSymbol = `log(${value})`; break;
        case 'exp':
            result = Math.exp(value);
            funcSymbol = `e^(${value})`; break;
        case 'sqrt':
            result = Math.sqrt(value);
            funcSymbol = `√(${value})`; break;
        case 'pow':
            expression += `^`;
            currentInput = '0';
            waitingForExponent = true;
            updateDisplay();
            return;
        default: return;
    }

    historyDisplay.textContent = funcSymbol + ' =';
    currentInput = result.toString();
    expression = currentInput;
    isNewCalculation = true;
    updateDisplay();
}

updateDisplay();
