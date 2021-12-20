function getData(uId) {
  return new Promise((reslove, reject) => {
    setTimeout(() => {
      console.log("Data fetched!");
      reslove("skc@gmail.com");
    }, 1000);
  });
}

console.log("start");
var email = getData("skc");
email.then((email) => {
  console.log("Email id of the user id is: " + email);
  console.log("end");
});
