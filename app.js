const digitBtns = document.querySelectorAll('button.digit');
const clearBtn = document.querySelector('button.clear');
const operatorBtns = document.querySelectorAll('button.operator');
const equalBtn = document.querySelector('button.equal');
const decimalBtn = document.querySelector('button.decimal');
const backBtn = document.querySelector('button.backspace');

const newValDisplay = document.querySelector('.new-value');
const EvalDisplay = document.querySelector('.current-value');

let currentEval = 0;
let newValue = 0;
let currentOperator = null;
let lastBtnPressed = null;

function clearAll() {
  currentEval = 0;
  newValue = 0;
  currentOperator = null;
  lastBtnPressed = null;
  newValDisplay.textContent = "0";
  EvalDisplay.textContent = "";
}

clearBtn.addEventListener('click', clearAll);

digitBtns.forEach(btn => btn.addEventListener('click', () => {
  writeDigit(btn.textContent);
  lastBtnPressed = "digit";
}
));

operatorBtns.forEach(btn => btn.addEventListener('click', () => {
  if (lastBtnPressed !== "operator" && lastBtnPressed !== "equals") {
    currentEval = operate(currentOperator, currentEval, newValue);
  }
  currentOperator = btn.textContent;
  EvalDisplay.textContent = `${Math.round(currentEval * 10**10) / 10**10} ${currentOperator} `;
  newValDisplay.textContent = Math.round(currentEval * 10**10) / 10**10;
  newValue = 0;
  lastBtnPressed = "operator";
}
));

decimalBtn.addEventListener('click', () => {
  if (lastBtnPressed === "equals") clearAll();
  else if (newValue.toString().includes('.')) return;
  else if (lastBtnPressed === "operator") newValDisplay.textContent = 0;
  newValDisplay.textContent += '.';
  newValue += '.';
  lastBtnPressed = "decimal";
});

equalBtn.addEventListener('click', () => {
  if (currentOperator === null) {
    EvalDisplay.textContent = `${Math.round(newValue * 10**10) / 10**10} = `;
  } else {
    EvalDisplay.textContent = `${Math.round(currentEval * 10**10) / 10**10} ` +
                              `${currentOperator} ${Math.round(newValue * 10**10) / 10**10} = `;
  }
  newValue = operate(currentOperator, currentEval, newValue);
  newValDisplay.textContent = Math.round(newValue * 10**10) / 10**10;
  currentEval = newValue;
  lastBtnPressed = "equals";
});

backBtn.addEventListener('click', () => {
  if (lastBtnPressed === "operator" || lastBtnPressed === "equals") return;
  if (newValue.toString().length === 1) {
    newValue = 0;
    newValDisplay.textContent = 0;
  } else {
    newValue = newValue.toString().slice(0, newValue.toString().length -1);
    newValDisplay.textContent = newValue;
  }
});


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
  if (b == 0) alert("Can't divide by 0!");
  else return Number(a) / Number(b);
}

function mod(a, b) {
  if (b == 0) alert("Can't divide by 0!");
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

function writeDigit(digit) {
  if (lastBtnPressed === "equals") clearAll();
  if (newValue.toString() === "0") newValue = "";
  if (lastBtnPressed === "operator") {
    newValue = digit;
  } else {
    newValue += digit;
  }
  newValDisplay.textContent = newValue;
}
