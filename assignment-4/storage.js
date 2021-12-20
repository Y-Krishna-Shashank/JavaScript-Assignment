let localScore = window.localStorage;
let sessionScore = window.sessionStorage;
if (!localScore.num) {
  localScore.setItem("num", "0");
}
if (!sessionScore.num) {
  sessionScore.setItem("num", "0");
}
document.getElementById("localScore").value = localScore.getItem("num");
document.getElementById("sessionScore").value = sessionScore.getItem("num");
function increment() {
  localStoreNum = Number(localScore.getItem("num"));
  localStoreNum++;
  sessionStoreNum = Number(sessionScore.getItem("num"));
  sessionStoreNum++;
  localScore.setItem("num", localStoreNum);
  sessionScore.setItem("num", sessionStoreNum);
  document.getElementById("localScore").value = localScore.getItem("num");
  document.getElementById("sessionScore").value = sessionScore.getItem("num");
}
