const clearBtn = document.querySelector('button.clear');
const digitBtns = document.querySelectorAll('button.digit');
const operatorBtns = document.querySelectorAll('button.operator');
const decimalBtn = document.querySelector('button.decimal');
const equalsBtn = document.querySelector('button.equals');
const negateBtn = document.querySelector('button.negate');
const backBtn = document.querySelector('button.backspace');

const newValDisplay = document.querySelector('.new-value');
const EvalDisplay = document.querySelector('.current-value');

let currentEval = 0;
let newValue = 0;
let currentOperator = null;
let lastBtnPressed = null;

const DECIMALS = 10;

clearBtn.addEventListener('click', clearAll);
digitBtns.forEach(btn => btn.addEventListener('click', handleDigitClick));
operatorBtns.forEach(btn => btn.addEventListener('click', handleOperatorClick));
decimalBtn.addEventListener('click', handleDecimalClick);
equalsBtn.addEventListener('click', handleEqualsClick);
negateBtn.addEventListener('click', handleNegateClick);
backBtn.addEventListener('click', handleBackClick);

function clearAll() {
  currentEval = 0;
  newValue = 0;
  currentOperator = null;
  lastBtnPressed = null;
  newValDisplay.textContent = "0";
  EvalDisplay.textContent = "";
}

function handleDigitClick() {
  if (lastBtnPressed === "equals") clearAll();
  if (newValue.toString() === "0") newValue = "";
  if (lastBtnPressed === "operator") {
    newValue = this.textContent;
  } else {
    newValue += this.textContent;
  }
  newValDisplay.textContent = newValue;
  lastBtnPressed = "digit";
}

function handleOperatorClick() {
  if (lastBtnPressed !== "operator" && lastBtnPressed !== "equals") {
    currentEval = operate(currentOperator, currentEval, newValue);
  }
  currentOperator = this.textContent;
  EvalDisplay.textContent = `${round(currentEval)} ${currentOperator} `;
  newValDisplay.textContent = round(currentEval);
  lastBtnPressed = "operator";
}

function handleDecimalClick() {
  if (lastBtnPressed === "equals") clearAll();
  else if (newValue.toString().includes('.') && lastBtnPressed !== "operator") {
    return;
  } else if (lastBtnPressed === "operator") {
    newValDisplay.textContent = 0;
    newValue = 0;
  } 
  newValDisplay.textContent += '.';
  newValue += '.';
  lastBtnPressed = "decimal";
}

function handleEqualsClick() {
  if (currentOperator === null) {
    EvalDisplay.textContent = `${round(newValue)} = `;
  } else {
    EvalDisplay.textContent = `${round(currentEval)} ${currentOperator} ${round(newValue)} = `;
  }
  currentEval = operate(currentOperator, currentEval, newValue);
  if (currentEval === "zero_division") {
    clearAll();
    newValDisplay.textContent = "Can't divide by 0";
    return;
  }
  newValDisplay.textContent = round(currentEval);
  lastBtnPressed = "equals";
}

function handleNegateClick() {
  
}

function handleBackClick() {
  if (lastBtnPressed === "operator" || lastBtnPressed === "equals") return;
  if (newValue.toString().length === 1) {
    newValue = "0";
    newValDisplay.textContent = "0";
  } else {
    newValue = newValue.toString().slice(0, newValue.toString().length -1);
    newValDisplay.textContent = newValue;
  }
  lastBtnPressed = "digit";
}

function round(number) {
  return Math.round(number * 10**DECIMALS) / 10**DECIMALS;
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
  let eval = 0;
  switch(op) {
    case "+":
      eval = add(a, b);
      break;
    case "-":
      eval = sub(a, b);
      break;
    case "*":
      eval = mult(a, b);
      break;
    case "/":
      eval = div(a, b);
      break;
    case "%":
      eval = mod(a, b);
      break;
    default:
      eval = b;
  }
  return eval;
}
