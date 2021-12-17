"use strict";
const printName = (name) => `Hi ${name}`;

const printBill = (name, bill) => {
  return `Hi ${name}, please pay: ${bill}`;
};

const person = {
  name: "Noam Chomsky",
  age: 92,
};
const { name, age } = person;
console.log(name);
console.log(age);
console.log(printName("Zemoso"));
