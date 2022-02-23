const clearBtn = document.querySelector('button.clear');
const digitBtns = document.querySelectorAll('button.digit');
const operatorBtns = document.querySelectorAll('button.operator');
const decimalBtn = document.querySelector('button.decimal');
const equalsBtn = document.querySelector('button.equals');
const negateBtn = document.querySelector('button.negate');
const backBtn = document.querySelector('button.backspace');

const mainDisplay = document.querySelector('.new-value');
const operationDisplay = document.querySelector('.current-value');

let currentEval = 0;
let inputValue = 0;
let currentOperator = null;
let lastBtnPressed = null;

const MAX_DECIMALS = 10;

clearBtn.addEventListener('click', clearAll);
digitBtns.forEach(btn => btn.addEventListener('click', handleDigitClick));
operatorBtns.forEach(btn => btn.addEventListener('click', handleOperatorClick));
decimalBtn.addEventListener('click', handleDecimalClick);
equalsBtn.addEventListener('click', handleEqualsClick);
negateBtn.addEventListener('click', handleNegateClick);
backBtn.addEventListener('click', handleBackClick);

function clearAll() {
  currentEval = 0;
  inputValue = 0;
  currentOperator = null;
  lastBtnPressed = null;
  mainDisplay.textContent = "0";
  operationDisplay.textContent = "";
}

function handleDigitClick() {
  if (lastBtnPressed === "equals") clearAll();
  if (inputValue.toString() === "0") inputValue = "";
  if (lastBtnPressed === "operator") {
    inputValue = this.textContent;
  } else {
    inputValue += this.textContent;
  }
  mainDisplay.textContent = inputValue;
  lastBtnPressed = "digit";
}

function handleOperatorClick() {
  if (lastBtnPressed !== "operator" && lastBtnPressed !== "equals") {
    currentEval = operate(currentOperator, currentEval, inputValue);
  }
  currentOperator = this.textContent;
  operationDisplay.textContent = `${round(currentEval)} ${currentOperator} `;
  mainDisplay.textContent = round(currentEval);
  lastBtnPressed = "operator";
}

function handleDecimalClick() {
  if (lastBtnPressed === "equals") clearAll();
  else if (inputValue.toString().includes('.') && lastBtnPressed !== "operator") {
    return;
  } else if (lastBtnPressed === "operator") {
    mainDisplay.textContent = 0;
    inputValue = 0;
  } 
  mainDisplay.textContent += '.';
  inputValue += '.';
  lastBtnPressed = "decimal";
}

function handleEqualsClick() {
  if (currentOperator === null) {
    operationDisplay.textContent = `${round(inputValue)} = `;
  } else {
    operationDisplay.textContent = `${round(currentEval)} ${currentOperator} ${round(inputValue)} = `;
  }
  currentEval = operate(currentOperator, currentEval, inputValue);
  if (currentEval === "zero_division") {
    clearAll();
    mainDisplay.textContent = "Can't divide by 0";
    return;
  }
  mainDisplay.textContent = round(currentEval);
  lastBtnPressed = "equals";
}

function handleNegateClick() {

}

function handleBackClick() {
  if (lastBtnPressed === "operator" || lastBtnPressed === "equals") return;
  if (inputValue.toString().length === 1) {
    inputValue = "0";
    mainDisplay.textContent = "0";
  } else {
    inputValue = inputValue.toString().slice(0, inputValue.toString().length -1);
    mainDisplay.textContent = inputValue;
  }
  lastBtnPressed = "digit";
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
