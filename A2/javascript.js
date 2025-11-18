const mainDisplay = document.getElementById('main-display');
const historyDisplay = document.getElementById('history-display');
let currentInput = '0';
let expression = '';
let isNewCalculation = true;

// Utility function to update the display
function updateDisplay() {
    // Truncate display if too long
    if (currentInput.length > 18) {
        mainDisplay.textContent = parseFloat(currentInput).toExponential(10);
    } else {
        mainDisplay.textContent = currentInput;
    }
    historyDisplay.textContent = expression;
}

// 1. Implementation of Number/Parentheses Buttons
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
    
    // Logic for building the full expression string
    if (['(', ')', '.', '00'].includes(value) || !isNaN(parseFloat(value))) {
        expression += value;
    }
    
    updateDisplay();
}

// 2. Implementation of Arithmetic Operations
function appendOperator(operator) {
    if (isNewCalculation) {
        // Start a new expression if we apply an operator immediately
        expression = currentInput + operator;
        isNewCalculation = false;
    } else {
        // Prevent stacking operators (e.g., ++, **). Replace the last one if it was an operator.
        const lastChar = expression.slice(-1);
        if (['+', '-', '*', '/'].includes(lastChar)) {
            expression = expression.slice(0, -1) + operator;
        } else {
            expression += operator;
        }
    }
    currentInput = operator; // Update main display briefly with the operator
    updateDisplay();
}

// 3. Implementation of Clear, Delete, and Equal Buttons
function clearDisplay() {
    currentInput = '0';
    expression = '';
    isNewCalculation = true;
    updateDisplay();
}

function deleteLast() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }

    // Try to remove the last part from the full expression as well
    if (expression.length > 0) {
        expression = expression.slice(0, -1);
    }
    isNewCalculation = false;
    updateDisplay();
}

function calculateResult() {
    if (expression === '') return;
    
    // Replace custom '^' for power with Math.pow and 'π' with Math.PI for safe evaluation
    // Note: A more robust solution would use a dedicated expression parser.
    let finalExpression = expression.replace(/π/g, 'Math.PI')
                                   .replace(/\^/g, '**');

    try {
        // Use the Function constructor for safe dynamic expression evaluation
        const result = new Function('return ' + finalExpression)();
        
        historyDisplay.textContent = expression + ' =';
        currentInput = result.toString();
        expression = currentInput; // Set result as the start of the next expression
        isNewCalculation = true;
        updateDisplay();
        
    } catch (error) {
        currentInput = 'Error';
        historyDisplay.textContent = 'Invalid Expression';
        isNewCalculation = true;
        updateDisplay();
    }
}

// 4. Implementation of Scientific Functions
function calculateScientific(func) {
    // Treat 'π' as a special case for direct insertion
    if (func === 'π') {
        appendInput(Math.PI);
        return;
    }

    let value = parseFloat(currentInput);
    if (isNaN(value)) {
        value = 0; // Default to 0 if input is not a number
    }
    
    let result;
    let funcSymbol = '';

    switch (func) {
        case 'sin':
            result = Math.sin(value * (Math.PI / 180)); // Convert to Radians for standard sin/cos/tan
            funcSymbol = `sin(${value}°)`
            break;
        case 'cos':
            result = Math.cos(value * (Math.PI / 180));
            funcSymbol = `cos(${value}°)`
            break;
        case 'tan':
            result = Math.tan(value * (Math.PI / 180));
            funcSymbol = `tan(${value}°)`
            break;
        case 'log':
            result = Math.log10(value); // Assuming base 10 for 'log'
            funcSymbol = `log(${value})`
            break;
        case 'exp':
            result = Math.exp(value); // e^x
            funcSymbol = `e^(${value})`
            break;
        case 'sqrt':
            result = Math.sqrt(value);
            funcSymbol = `sqrt(${value})`
            break;
        case 'pow':
             // If pow is clicked, we reset input to '0' and add '^' to expression, 
             // waiting for the second number to complete the x^y expression.
             expression += `^`;
             currentInput = '0';
             isNewCalculation = false;
             updateDisplay();
             return; // Exit to wait for the second operand
        default:
            return;
    }

    // Update display after scientific calculation
    historyDisplay.textContent = funcSymbol + ' =';
    currentInput = result.toString();
    expression = currentInput; // New calculation starts with the result
    isNewCalculation = true;
    updateDisplay();
}

// Initialize the display
updateDisplay();