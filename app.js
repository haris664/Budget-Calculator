class TransactionList {
  constructor() {
    this.incomeList = [];
    this.expenseList = [];
    this.transactionId = 0;
  }

  addNewTransaction(description, enterAmount) {
    if (enterAmount >= 0) {
      const incomeValue = Math.abs(enterAmount);
      this.incomeList.push(new Transaction(description, incomeValue, this.transactionId++));
      this.reCalculate();
    } else {
        const expenseValue = Math.abs(enterAmount);
        this.expenseList.push(new Transaction(description, expenseValue, this.transactionId++));
        this.reCalculate();
      }
  }

  removeIncome(id) {
    this.incomeList = this.incomeList.filter(remove => remove.id != id);
    this.reCalculate();
  }

  removeExpense(id) {
    this.expenseList = this.expenseList.filter(remove => remove.id != id);
    this.reCalculate();
  }

  totalExpense() {
    let sum = 0;
    
    this.expenseList.forEach(function(exp) {
      sum = sum +  exp.amount ;
    });

    return sum;
  }

  totalIncome() {
    let sum = 0;

    this.incomeList.forEach(function(total) {
      sum = sum + total.amount;
    });

    return sum;
  }

  totalAmount() { 
    const incomeList = this.totalIncome();
    const expenseList = this.totalExpense();

    return incomeList - expenseList;

  }

  getTime() {
    const options = { month:'long', year:'numeric'};
    const today = new Date();
    const showTime = today.toLocaleDateString("en-US",options);

    return showTime;
  }

  expensesPercentage() {
    const income = Math.abs(this.totalIncome());
    const expense = Math.abs(this.totalExpense());
    
    return Math.round(expense / income * 100);
  }

  reCalculate() {
    const timeEle = document.querySelector('.budget__title--month'); 
    const totalAmountEle = document.querySelector('.budget__value');
    const totalIncomeEle = document.querySelector('.budget__income--value');
    const totalExpenses = document.querySelector('.budget__expenses--value');
    const expensePercentage = document.querySelector('.budget__expenses--percentage');

    incomeEle.innerHTML = "";
    expenseEle.innerHTML = "";

    this.incomeList.forEach(function(income) {
      incomeEle.insertAdjacentHTML('afterbegin',
      `<div class="item" data-transaction-id="${income.id}" wfd-id="32">
        <div class="item__description" wfd-id="37"> ${income.description} </div>            
        <div class="right" wfd-id="34">
          <div class="item__value" wfd-id="36">+ $${income.amount.toFixed(2)} </div>
          <div class="item__delete" wfd-id="35">
            <button class="item__delete--btn" wfd-id="61">
              <i class="ion-ios-close-outline"></i>
            </button>
          </div>
        </div>
        <div class="item__date" wfd-id="33">${income.date}</div>
      </div> `
      )
    });

    const calculatePercentage = this.totalIncome();
    
    this.expenseList.forEach(function(expense) {
      expenseEle.insertAdjacentHTML(`afterbegin`, 
      ` <div class="item" data-transaction-id="${expense.id}" wfd-id="11">
          <div class="item__description" wfd-id="17">${expense.description}</div>
          <div class="right" wfd-id="13">
            <div class="item__value" wfd-id="16">- $${(expense.amount).toFixed(2)}</div>
            <div class="item__percentage" wfd-id="15">
            ${(Math.round(expense.amount / calculatePercentage * 100))}%</div> 
            <div class="item__delete" wfd-id="14">
              <button class="item__delete--btn" wfd-id="58"><i class="ion-ios-close-outline"></i></button>
            </div>
          </div>
          <div class="item__date" wfd-id="12">${expense.date}</div>
        </div>
      `)
    });

    totalIncomeEle.textContent = `+$${this.totalIncome().toFixed(2)}`; 
    totalExpenses.textContent = `-$${this.totalExpense().toFixed(2)}`;
    timeEle.textContent = `${this.getTime()}`; 
    expensePercentage.textContent = `${this.expensesPercentage()}%`;
    totalAmountEle.textContent = `${(this.totalAmount() > 0)
      ? `+$${this.totalAmount().toFixed(2)}` 
      : `-$${Math.abs(this.totalAmount()).toFixed(2)}`}`;
  }
}

class Transaction {
  constructor(description, amount, id) {
    this.description = description;
    this.amount = amount;
    this.id = id;
    this.date = this.callDate();
  }

  callDate() {
    const todayDate = { month:'short', day:'numeric', year:'numeric'};
    const today = new Date();
    const showDate = today.toLocaleDateString("en-US", todayDate);

    return showDate;
  }
}

const inputEle = document.querySelector('.add__container');
const descriptionEle = document.querySelector('.add__description');
const valueEle = document.querySelector('.add__value');
const incomeEle = document.querySelector('.income__list');
const expenseEle = document.querySelector('.expenses__list');
const transactionList = new TransactionList();

inputEle.addEventListener('click', function(e) {
  if (e.target.nodeName === "I") {
    if (descriptionEle.value !== "" && !isNaN (valueEle.value) && (valueEle.value !== "")) {
      transactionList.addNewTransaction(descriptionEle.value,valueEle.value);
      descriptionEle.value = "";
      valueEle.value = "";
    }
  }
});

incomeEle.addEventListener('click', function(e) {
  if (e.target.nodeName === "I") {
   const btn = e.target.closest(".item");
   transactionList.removeIncome((btn.dataset.transactionId));
  }
});

expenseEle.addEventListener('click', function(e) {
  if (e.target.nodeName === "I") {
    const btn = e.target.closest(".item");
    transactionList.removeExpense(btn.dataset.transactionId);
  }
});