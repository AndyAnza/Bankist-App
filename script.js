'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2024-04-26T17:01:17.194Z',
    '2024-04-28T23:36:17.929Z',
    '2024-04-29T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  console.log(daysPassed);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    // const day = `${date.getDate()}`.padStart(2, 0);
    // const month = `${date.getMonth() + 1}`.padStart(2, 0);
    // const year = date.getFullYear();
    // // day/month/year
    // return `${day}/${month}/${year}`;
    return new Intl.DateTimeFormat(locale).format(date);
  }
};

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date);
    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map((name) => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

///////////////////////////////////////
// Event handlers
let currentAccount;

// FAKE ALWAYS LOGGED IN
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

// const now = new Date();
// const day = `${now.getDate()}`.padStart(2, 0);
// const month = `${now.getMonth() + 1}`.padStart(2, 0);
// const year = now.getFullYear();
// const hour = `${now.getHours()}`.padStart(2, 0);
// const min = `${now.getMinutes()}`.padStart(2, 0);
// day/month/year
// labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Create current date and time
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    };

    // const locale = navigator.language;
    // console.log(locale);

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    // Add movement
    currentAccount.movements.push(amount);

    // Add loan date
    currentAccount.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

/*
// 172.
// Base 10 - 0 to 9. 1/10 = 0.1   3/10 = 3.33333333
// Base 2 - 0 1
console.log(0.1 + 0.2);
console.log(0.1 + 0.2 === 0.3);

//  Turn a string into a number
console.log(Number('23'));
console.log(+'23');

// Parsing
// parseInt: Transforms strings that start with numbers and then letter into a integer. It won't work if the string starts with a letter.
console.log(Number.parseInt('30px', 10));
// This wont work
console.log(Number.parseInt('e23', 10));
console.log(Number.parseInt('2.5rem'));
// parseFloat: same as parseInt but the number will remain a float
console.log(Number.parseFloat('2.5rem'));

// Check if value is NaN - NOT RECOMMENDED
console.log(Number.isNaN(23));
console.log(Number.isNaN('23'));
console.log(Number.isNaN(+'20X'));
console.log(Number.isNaN(23 / 0));

//Check if value is number - RECOMMENDED✅
console.log(Number.isFinite(20));
console.log(Number.isFinite('20'));
console.log(Number.isFinite(+'20X'));
console.log(Number.isFinite(23 / 0));
*/

/*
/////////////////////////
// 172. Math and rounding
// Square - cuadrado
console.log(Math.sqrt(25));
console.log(25 ** (1 / 2));
console.log(8 ** (1 / 3));

// Get max value
console.log(Math.max(5, 18, 23, 11, 2));
console.log(Math.max(5, 18, '23', 11, 2));
// Math.max won't parse ⛔
console.log(Math.max(5, 15, '23px', 11, 2));

// Get MIN value
console.log(Math.min(5, 18, 23, 11, 2));

// Get PI
console.log(Math.PI * Number.parseFloat('10px') ** 2);

// Formula to get a number from 0 to a selecter number
console.log(Math.trunc(Math.random() * 6) + 1);

// Formula to get a random integer between two integers
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max, min) + 1) + min;
console.log(randomInt(10, 20));

// Rounding integers - all these methods do type coersion so 23 and '23' will work
// Math.trunc only removes decimals
console.log(Math.trunc(23.3));

// Math.round always round to the NEAREST integer
console.log(Math.round(23.2));
console.log(Math.round(23.9));

// Math.ceil will round UP
console.log(Math.ceil(23.2));
console.log(Math.ceil(23.9));

// Math.floor will ROUND DOWN
console.log(Math.floor(23.2));
console.log(Math.floor(23.9));

// The difference between Math.trunc and Math.floor is that when using negative numbers math floor works best because the rounding works the other way around
console.log(Math.trunc(-23.3));
console.log(Math.floor(-23.3));

// ROUNDING DECIMALS
// ⚠ IMPORTANT: when we use .toFixed the value will be returned as a string, so we should always convert it to number with the plus sign at the beginning
console.log((2.7).toFixed(0));
console.log((2.7).toFixed(3));
console.log((2.345).toFixed(2));
console.log(+(2.345).toFixed(2));
*/

/*
// 173. Remainder Operator
// USE CASES when we want something to have an effect according to its remainder. Example if want the background color to change if the element is even or odd
console.log(5 % 2);
console.log(5 / 2); // 5 = 2 * 2 + 1

console.log(8 % 2);
console.log(8 / 2); // 8 = 2 * 3 + 2

console.log(6 % 2);
console.log(6 / 2);

console.log(7 % 2);
console.log(7 / 2);

const isEven = (n) => n % 2 === 0;
console.log(isEven(2));
console.log(isEven(5));
console.log(isEven(6));
console.log(isEven(15));

*/
// Here we are transforming the node list into an array and spreading all its elements inside the array
labelBalance.addEventListener('click', function () {
  [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
    if (i % 2 === 0) row.style.backgroundColor = 'orangered';
    if (i % 3 === 0) row.style.backgroundColor = 'blue';
  });
});

/*
// 174. Numeric Separators
// Introduced in ES2021 to help developers to add meaning to numbers without affecting its execution in javascript, which makes it easier to read and understand.
// Numeric Separators are underscores added ONLY in between numbers to add meaning.

const diameter = 287_460_000_000;
console.log(diameter);

const price = 345_99;
console.log(price);

const transferFee1 = 15_00;
const transferFee2 = 1_500;

const PI = 3.1415;
console.log(PI);

// this wont work since our original value is a string
console.log(Number('230_000'));
// here it will give us a bug turning the number into 230
console.log(parseInt('230_000'));
*/

/*
// 175. Working with BigInt
// Primitive data type added in ES2020 - special type of integers.
// RULES:
// 1. Declaration: To declare a BigInt, append an "n" to the end of an integer literal or convert a numeric string to a BigInt using the BigInt() constructor.
// 2.Arithmetic Operations: You can perform arithmetic operations such as addition, subtraction, multiplication, division, and modulo on BigInt values just like with regular numbers.
// 3. Comparison: BigInt values can be compared using standard comparison operators (<, >, <=, >=, ==, ===, !=, !==).
// 4. Mixing Types: Operations between BigInt and other numeric types (e.g., Number) are not allowed without explicit conversion.
// 5. Type Conversion: You can convert BigInt to other numeric types using the Number() or parseInt() functions.
// 6.Limitations: BigInt cannot be used with certain built-in mathematical functions or methods that only accept regular numbers, for example Math.sqrt()

console.log(2 ** 53 - 1);
console.log(Number.MAX_SAFE_INTEGER);
console.log(2 ** 53 + 1);
console.log(2 ** 53 + 2);
console.log(2 ** 53 + 3);
console.log(2 ** 53 + 4);

console.log(6543654784876487487674576547654634554254325n);
console.log(BigInt(4321765543n));

// Operations
console.log(5432677564n + 543254325n);
console.log(5432543254326776546543656632n * 10000000000n);

const huge = 534264536587682432423423n;
const num = 23;
console.log(huge * BigInt(num));

console.log(20n > 15);
console.log(20n === 20);
console.log(typeof 20n);
console.log(20n == '20');

console.log(huge + ' is REALLY big!!');

// Divisions
console.log(11n / 3n);
console.log(10 / 3);
*/

/*
// 176. Creating dates
// Notes:
// - Dates have autocorrect
// - There are different ways to create dates but you should avoid writing them manually
// - Months are 0 based - Example 10 = Nov instead of 11

// Create a date
const now = new Date();
console.log(now);

console.log(new Date('Apr 29 2024 16:43:04'));
console.log(new Date('December 24, 2015'));
console.log(new Date(account1.movementsDates[0]));

console.log(new Date(2037, 10, 19, 15, 23, 5));
console.log(new Date(2037, 10, 31));

console.log(new Date(0));
console.log(new Date(3 * 24 * 60 * 60 * 1000));

// Working with dates
const future = new Date(2037, 10, 19, 15, 23);
console.log(future);
console.log(future.getFullYear());
console.log(future.getMonth());
console.log(future.getDate());
console.log(future.getDay());
console.log(future.getHours());
console.log(future.getMinutes());
console.log(future.getSeconds());
console.log(future.toISOString()); //2037-11-19T21:23:00.000Z
// Timestamps in JavaScript
// A timestamp typically refers to a numeric value representing the number of milliseconds elapsed since the Unix Epoch. The Unix Epoch is defined as midnight UTC on January 1, 1970. This timestamp is often used to represent dates and times in JavaScript, as it provides a standardized way to measure time across different systems and platforms.
console.log(future.getTime()); //this is how you get a timestamp
//  Timestamp to date
console.log(new Date(2142278580000));

console.log(Date.now()); //this is how you get todays timestamp

// you can modify the date using the set methods, there are more than this one
future.setFullYear(2024);
console.log(future);
*/

/*
// 178. Operations with dates

const future = new Date(2037, 10, 19, 15, 23);
console.log(future);

const calcDaysPassed = (date1, date2) =>
  Math.abs(date2 - date1) / (1000 * 60 * 60 * 24); //

const day1 = calcDaysPassed(new Date(2037, 3, 4), new Date(2037, 3, 14));
console.log(day1);
*/

/*
// 180. Internationalizing Dates (Intl)
const num = 23454654.45;
const options = {
  style: 'unit',
  unit: 'mile-per-hour',
};
console.log(new Intl.NumberFormat('en-US', options).format(num));
*/
