const clearBtn = document.querySelector('button.clear');
const digitBtns = document.querySelectorAll('button.digit');
const operatorBtns = document.querySelectorAll('button.operator');
const decimalBtn = document.querySelector('button.decimal');
const equalsBtn = document.querySelector('button.equals');
const negateBtn = document.querySelector('button.negate');
const undoBtn = document.querySelector('button.undo');

const allBtns = document.querySelectorAll('button');

const mainDisplay = document.querySelector('.main-display > bdi');
const operationDisplay = document.querySelector('.operation-display > bdi');

let currentEval = 0;
let inputValue = 0;
let currentOperator = null;
let lastBtnRegistered = null;

const MAX_DECIMALS = 10;

window.addEventListener('keydown', handleKeyboardInput)
digitBtns.forEach(btn => btn.addEventListener('click', handleDigitClick));
operatorBtns.forEach(btn => btn.addEventListener('click', handleOperatorClick));

clearBtn.addEventListener('click', clearAll);
decimalBtn.addEventListener('click', handleDecimalClick);
equalsBtn.addEventListener('click', handleEqualsClick);
negateBtn.addEventListener('click', handleNegateClick);
undoBtn.addEventListener('click', handleUndoClick);

allBtns.forEach(btn => {
  btn.addEventListener('click', addTransition);
  btn.addEventListener('transitionend', removeTransition);
});

function addTransition(e) {
  e.target.classList.add('clicked');
}

function removeTransition(e) {
  if (e.propertyName !== 'transform') return;
    e.target.classList.remove('clicked');
}

function handleKeyboardInput(e) {
  if (e.key >= 0 && e.key <= 9)
    Array.from(digitBtns).find(btn => btn.textContent === e.key).click();

  if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/')
    Array.from(operatorBtns).find(btn => btn.textContent === e.key).click();

  if (e.key === 'Escape') clearBtn.click();
  if (e.key === '.') decimalBtn.click();
  if (e.key === '=' || e.key === 'Enter') equalsBtn.click();
  if (e.key === 'Backspace') undoBtn.click();
}

function clearAll() {
  currentEval = 0;
  inputValue = 0;
  currentOperator = null;
  lastBtnRegistered = null;
  mainDisplay.textContent = "0";
  operationDisplay.textContent = "";
}

function handleDigitClick() {
  if (lastBtnRegistered === "equals") clearAll();
  if (inputValue.toString() === "0") inputValue = "";
  if (lastBtnRegistered === "operator") {
    inputValue = this.textContent;
  } else {
    inputValue += this.textContent;
  }
  mainDisplay.textContent = inputValue;

  lastBtnRegistered = "digit";
}

function handleOperatorClick() {
  if (lastBtnRegistered !== "operator" && lastBtnRegistered !== "equals") {
    evaluate();
  }
  currentOperator = this.textContent;
  operationDisplay.textContent = `${round(currentEval)} ${currentOperator} `;
  inputValue = currentEval;

  lastBtnRegistered = "operator";
}

function evaluate() {
  currentEval = operate(currentOperator, currentEval, inputValue);
  if (currentEval === "zero_division") {
    clearAll();
    mainDisplay.textContent = "Can't divide by 0";
    return;
  }
  mainDisplay.textContent = round(currentEval);
}

function handleEqualsClick() {
  if (currentOperator === null) {
    operationDisplay.textContent = `${round(inputValue)} = `;
  } else {
    operationDisplay.textContent = `${round(currentEval)} ${currentOperator} ${round(inputValue)} = `;
  }
  evaluate();

  lastBtnRegistered = "equals";
}

function handleDecimalClick() {
  if (lastBtnRegistered === "equals") clearAll();
  else if (inputValue.toString().includes('.') && lastBtnRegistered !== "operator") {
    return;
  } else if (lastBtnRegistered === "operator") {
    mainDisplay.textContent = 0;
    inputValue = 0;
  }
  mainDisplay.textContent += '.';
  inputValue += '.';

  lastBtnRegistered = "decimal";
}

function handleNegateClick() {
  if (lastBtnRegistered === "digit") {
    inputValue = -inputValue;
    mainDisplay.textContent = inputValue;
  } else if (lastBtnRegistered === "decimal") {
    if (inputValue.startsWith('-')) inputValue = inputValue.substring(1);
    else inputValue = '-' + inputValue;
    mainDisplay.textContent = inputValue;
  } else if (lastBtnRegistered === "equals") {
    currentEval = -currentEval
    mainDisplay.textContent = round(currentEval);
    operationDisplay.textContent = round(currentEval);
  } else {
    inputValue = -inputValue;
    operationDisplay.textContent = `${round(currentEval)} ${currentOperator} ${round(inputValue)}`;
    mainDisplay.textContent = round(inputValue);
  }
}

function handleUndoClick() {
  if (lastBtnRegistered === "operator" || lastBtnRegistered === "equals") return;
  if (inputValue.toString().length === 1) {
    inputValue = "0";
    mainDisplay.textContent = "0";
  } else {
    inputValue = inputValue.toString().slice(0, inputValue.toString().length -1);
    mainDisplay.textContent = inputValue;
  }
  lastBtnRegistered = "digit";
}

function round(number) {
  return Math.round(number * 10**MAX_DECIMALS) / 10**MAX_DECIMALS;
}

function add(a, b) {
  return Number(a) + Number(b);
}

function sub(a, b) {
  return Number(a) - Number(b);
}

function mult(a, b) {
  return Number(a) * Number(b);
}

function div(a, b) {
  if (b == 0) return "zero_division";
  else return Number(a) / Number(b);
}

function mod(a, b) {
  if (b == 0) return "zero_division";
  else return Number(a) % Number(b);
}

function operate(op, a, b) {
  switch(op) {
    case "+":
      return add(a, b);
    case "-":
      return sub(a, b);
    case "*":
      return mult(a, b);
    case "/":
      return div(a, b);
    case "%":
      return mod(a, b);
    default:
      return b;
  }
}
