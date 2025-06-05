const btnList = document.querySelector("#btnList");
const result = document.querySelector("#result");
const listResoults = document.querySelector("#listResoults");
const MAX_LENGTH = 16;
let pressedEquals = false;

const calculator = {
  strFirstNumber: "",
  strSecondNumber: "",
  waitingForSecondNumber: false,
  action: "",
  strResult: "",
};

btnList.addEventListener("click", (e) => {
  /* Смотрим, какую нажали кнопку, если цифра, то получаем число, 
  если действие, то обрабатываем действие, 
  если Clean - чистим объект 'калькулятор' */
  // let btnType = e.target.dataset.type;
  // let btnValue = e.target.value;

  // if (btnType === "value") {
  //   getNumber(btnValue);
  //   pressedBtnValue = true;
  // } else if (btnType === "action") {
  //   handleClickActionBtn(btnValue);
  // } else if (btnType === "clean") {
  //   clean();
  // }
  handleClickBtn(e.target);
  navigator.vibrate(200);
  console.log("пошагово", calculator);
});

function handleClickBtn(btn) {
  /* если нет второго числа и не нажали равно, то ждем второе число и сохраняем операцию
если нажали равно и операция записана, то второе число делаем таким не, как первое */
  let result = "";
  let btnType = btn.dataset.type;
  let btnValue = btn.value;

  deleteNullDot();

  if (btnType === "value") {
    getNumber(btnValue);
  }
  
  if(btnType === 'clean'){
    clean()
  }


  if (btnType === "value" && pressedEquals === true) {
    pressedEquals = false;
    clean();
    getNumber(btnValue);
  }

  if (btnType === "action") {
    let actionValue = btn.value;

    if (actionValue !== "=") {
      if (calculator.strFirstNumber == "") {
        calculator.strFirstNumber = 0;
        console.log("1");
      }
      if (
        calculator.strFirstNumber !== "" &&
        calculator.strSecondNumber == ""
      ) {
        calculator.waitingForSecondNumber = true;
        calculator.action = actionValue;
        console.log("2");
      }
      if (
        calculator.strFirstNumber !== "" &&
        calculator.strSecondNumber !== ""
      ) {
        if (pressedEquals == false) {
          result = calculate();
          calculator.strResult = result;
          printNumber(calculator.strResult);
          renderActionList();
          calculator.strFirstNumber = calculator.strResult;
          calculator.action = actionValue;
          calculator.strSecondNumber = "";
          calculator.strResult = "";
          console.log("4");
        } else {
          calculator.waitingForSecondNumber = true;
          calculator.action = actionValue;
          calculator.strSecondNumber = "";
          calculator.strResult = "";
          pressedEquals = false;
        }
      }
    }

    if (actionValue == "=") {
      if (calculator.strSecondNumber == "") {
        calculator.strSecondNumber = calculator.strFirstNumber;
      }
      if (
        calculator.strFirstNumber !== "" &&
        calculator.strSecondNumber !== ""
      ) {
        result = calculate();
        calculator.strResult = result;
        printNumber(calculator.strResult);
        renderActionList();
        calculator.strFirstNumber = calculator.strResult;
        calculator.waitingForSecondNumber = false;
        calculator.strResult = "";
        pressedEquals = true;
      }
    }
    console.log("pressedEquals=", pressedEquals, calculator);
  }
}


function equals() {
  let result = "";
  if (
    calculator.strFirstNumber !== "" &&
    calculator.strSecondNumber !== "" &&
    calculator.action !== ""
  ) {
    result = calculate();
    calculator.strResult = result;
    calculator.strFirstNumber = result;
    printNumber(calculator.strResult);
    calculator.strSecondNumber = "";
  }
}

function calculate() {
  let firstNumber = Number(calculator.strFirstNumber);
  let secondNumber = Number(calculator.strSecondNumber);
  let action = calculator.action;
  let result = 0;
  switch (action) {
    case "+":
      result = firstNumber + secondNumber;
      break;
    case "-":
      result = firstNumber - secondNumber;
      break;
    case "x":
      result = firstNumber * secondNumber;
      break;
    case ":":
      result = firstNumber / secondNumber;
      break;
  }
  return String(result);
}

function getNumber(btnValue) {
  if (calculator.waitingForSecondNumber === false) {
    if (calculator.strFirstNumber.length < MAX_LENGTH) {
      calculator.strFirstNumber = formatNumber(
        calculator.strFirstNumber + btnValue
      );
      printNumber(calculator.strFirstNumber);
    }
  } else if (calculator.strSecondNumber.length < MAX_LENGTH) {
    calculator.strSecondNumber = formatNumber(
      calculator.strSecondNumber + btnValue
    );
    printNumber(calculator.strSecondNumber);
  }
}

function formatNumber(str) {
  //убирает лишние нули и точки
  //если число не ноль и не начинается с '0.', то проверяем, начинается ли
  // строка с нуля, если да, то ноль вырезаем, далее проверяем, начинается ли строка с точки,
  //если да, то возвращаем '0.'

  if (str !== "0" && !str.startsWith("0.")) {
    str = str.startsWith("0") ? str.slice(1) : str;
    if (str.startsWith(".")) {
      str = "0.";
    }
  } else if (str !== "0" && str.startsWith("0.")) {
    // let indexDot = str.indexOf(".");
    // let masStr = str.split("");
    if (str.split("")[str.indexOf(".") + 1] === ".") {
      str = "0.";
    }
  }
  return str;
}

function deleteNullDot() {
  if (calculator.strFirstNumber === "0.") {
    calculator.strFirstNumber = "0";
    printNumber((calculator.strFirstNumber = "0"));
  }

  if (calculator.strSecondNumber === "0.") {
    calculator.strSecondNumber = "0";
    printNumber((calculator.strSecondNumber = "0"));
  }
}

function clean() {
  Object.assign(calculator, {
    strFirstNumber: "",
    strSecondNumber: "",
    waitingForSecondNumber: false,
    action: "",
    strResult: "",
  });
  result.value = "0";
}

function printNumber(strNumber) {
  result.value = strNumber;
}

function renderActionList() {
  //если нет пустых ключей, выводим пример
  const keys = Object.keys(calculator);
  let currentEmpty = 0;
  keys.forEach((key) => {
    if (key == "") {
      currentEmpty++;
    }
  });
  if (currentEmpty === 0) {
    let listElement = `<div class="listElement">${calculator.strFirstNumber} ${calculator.action} 
  ${calculator.strSecondNumber} = ${calculator.strResult}</div>`;

    listResoults.insertAdjacentHTML("beforeend", listElement);
  }
}
