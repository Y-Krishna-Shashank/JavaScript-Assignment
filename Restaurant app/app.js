const menuUrl = "foodMenu.json";
const tableUrl = "table.json";
let menuData = new Array([{}]);
let tableData = new Array([{}]);
itemList = document.getElementById("food-items");
tableList = document.getElementById("table-items");
billDetails = new Map();
tableDetails = new Map();
parseMenuItems(menuUrl);
function parseMenuItems(url) {
  fetch(url)
    .then((response) => response.json())
    .then((items) => {
      menuData = items;
      return loadMenuData(menuData);
    });
}

parseTableItems(tableUrl);

function parseTableItems(url) {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      tableData = data;
      return loadTableData(tableData);
    });
}

function allowDrop(event) {
  event.preventDefault();
}
function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  // console.log(data);
  str = String(data);
  firstIndex = str.indexOf(",");
  lastIndex = str.lastIndexOf(",");
  foodItem = str.substring(firstIndex + 1, lastIndex);

  price = Number(str.slice(data.lastIndexOf(",") + 1));
  let id = ev.target.id;
  let arr = [];
  tableOrdering = new Map();
  if (!billDetails.get(id)) {
    itemPrice = price;
    tableOrdering.set(foodItem, [price, 1, itemPrice]);

    arr = [price, 1, tableOrdering];
    // console.log(arr);
    billDetails.set(id, arr);
  } else {
    arr = billDetails.get(id);
    arr[0] += price;
    arr[1]++;
    tableOrdering = arr[2];
    if (!tableOrdering.get(foodItem)) {
      itemPrice = price;
      tableOrdering.set(foodItem, [price, 1, itemPrice]);
    } else {
      let foodArr = [];
      foodArr = tableOrdering.get(foodItem);
      foodArr[0] += price;
      foodArr[1]++;
      tableOrdering.set(foodItem, foodArr);
    }
    arr[2] = tableOrdering;
    billDetails.set(id, arr);
  }

  let index = Number(id.slice(id.indexOf("-") + 1)) - 1;
  tableData[index].tableName = id;
  tableData[index].bill = arr[0];
  tableData[index].itemCount = arr[1];
  console.log();
  document.getElementById(
    id
  ).outerHTML = `<li id="${id}"  ondrop="drop(event)" ondragover="allowDrop(event)" onclick="displayTableDetails('${id}',billDetails)">${id}<br><br> Rs. ${arr[0]} | Total items: ${arr[1]}</li>`;
}
function loadTableData(items) {
  let li1 = "";
  for (const [index] of Object.entries(items)) {
    num = items[index].tableName.indexOf("-") + 1;
    let listId = `Table-${items[index].tableName[num]}`;
    // arr = billDetails.get(listId);
    // if (arr[0] !== 0)
    li1 += `<li id="${listId}" ondrop="drop(event)" ondragover="allowDrop(event)"onclick="displayTableDetails('${listId}',billDetails)"> ${items[index].tableName}<br><br> Rs. ${items[index].bill} | Total items: ${items[index].itemCount}</li>`;
    // else
    //   li1 += `<li id="${listId}" ondrop="drop(event)" ondragover="allowDrop(event)> ${items[index].tableName}<br><br> Rs. ${items[index].bill} | Total items: ${items[index].itemCount}</li>`;
  }
  tableList.innerHTML = li1;
}

function loadMenuData(items) {
  let li = "";
  for (const [index] of Object.entries(items)) {
    let item = items[index].itemName;
    let price = items[index].price;
    num = Number(index) + 1;
    li += `<li draggable="true"id="food-item-${num}" ondragstart="dragStart(event,'${item}',${price})"> ${items[index].itemName}<br><br> ₹${items[index].price}</li>`;
  }
  itemList.innerHTML = li;
}

//filter menu
input = document.getElementById("filter-menu");
let filterMenu = function (event) {
  keyword = input.value.toLowerCase();
  filteredItems = menuData.filter((obj) => {
    return Object.keys(obj).some(function (key) {
      if (key !== "price") {
        return obj[key].toLowerCase().indexOf(keyword) != -1;
      }
    });
  });
  loadMenuData(filteredItems);
};
input.addEventListener("keyup", filterMenu);
function dragStart(event, itemName, price) {
  foodItemData = new Array([event.target.id, itemName, price]);
  event.dataTransfer.setData("Text", foodItemData);

  // console.log(document.getElementById(event.target.id).textContent);
}

input1 = document.getElementById("filter-tables");

let filterTable = function (event) {
  keyword1 = input1.value.toLowerCase();
  filteredTables = tableData.filter((obj) => {
    return Object.keys(obj).some(function (key) {
      if (key == "tableName") {
        return obj[key].toLowerCase().indexOf(keyword1) != -1;
      }
    });
  });
  loadTableData(filteredTables);
};
input1.addEventListener("keyup", filterTable);

let displayTableDetails = function (key, map) {
  listId = document.getElementById(key);
  var body = document.getElementById("modal");
  var modal_header = document.createElement("div");
  modal_header.classList.add("modal-header");
  modal_heading = document.createElement("h2");
  modal_heading.id = "table-heading";
  modal_heading_text = document.createTextNode(`${key} | Order Details`);
  modal_heading.appendChild(modal_heading_text);
  var close_modal = document.createElement("span");
  close_modal.classList.add("close");
  close_modal.setAttribute("onclick", `closing('${key}')`);
  close_modal_text = document.createTextNode("x");
  close_modal.appendChild(close_modal_text);
  modal_header.appendChild(close_modal);
  modal_header.appendChild(modal_heading);

  var tbl = document.createElement("table");
  tbl.id = "table-details";
  if (listId.classList.contains("active")) {
    listId.classList.remove("active");
  } else {
    var Parent = document.getElementById("modal");
    while (Parent.hasChildNodes()) {
      Parent.removeChild(Parent.firstChild);
    }
    listId.classList.add("active");

    arr = billDetails.get(key);
    map = arr[2];
    orderedItems = [];
    foodArr = [[]];
    orderedItems = [...map.keys()];
    foodArr = [...map.values()];
    // console.log(orderedItems, prices);
    table_heading = document.getElementsByTagName("h2");
    table_heading.innerHTML = `<h2 id="table-heading">${key}</h2>`;
    // creates a <table> element and a <tbody> element

    var tblHead = document.createElement("thead");
    var tblHeadRow = document.createElement("tr");
    var tblHeading1 = document.createElement("th");
    var heading1 = document.createTextNode("S.No");
    tblHeading1.appendChild(heading1);
    var tblHeading2 = document.createElement("th");
    var heading2 = document.createTextNode("Item");
    tblHeading2.appendChild(heading2);

    var tblHeading3 = document.createElement("th");
    var heading3 = document.createTextNode("Price");
    tblHeading3.appendChild(heading3);
    tblHeadRow.appendChild(tblHeading1);
    tblHeadRow.appendChild(tblHeading2);
    tblHeadRow.appendChild(tblHeading3);
    tblHead.appendChild(tblHeadRow);
    tbl.appendChild(tblHead);

    var tblBody = document.createElement("tbody");

    // creating all cells
    for (var i = 0; i < orderedItems.length; i++) {
      // creates a table row
      var row = document.createElement("tr");
      row.id = key + "-" + Number(i + 1);
      // Create a <td> element and a text node, make the text
      // node the contents of the <td>, and put the <td> at
      // the end of the table row
      var cell = document.createElement("td");
      var cellText = document.createTextNode(`${i + 1}`);
      cell.appendChild(cellText);
      row.appendChild(cell);

      itemId = "";
      cell = document.createElement("td");
      cell.id = orderedItems[i];
      itemId = cell.id;
      cellText = document.createTextNode(`${orderedItems[i]}`);
      cell.appendChild(cellText);
      row.appendChild(cell);

      cell = document.createElement("td");
      cellText = document.createTextNode(`${foodArr[i][0]}`);
      cell.appendChild(cellText);
      row.appendChild(cell);

      cell = document.createElement("td");
      cellNode = document.createElement("input");
      cellNode.type = "number";
      cellNode.id = key + "-input";
      cellNode.setAttribute(
        "onchange",
        `incOrDec('${row.id}','${itemId}','${key}','${cellNode.id}')`
      );
      cellNode.setAttribute("min", 0);
      cellNode.setAttribute("max", 10);
      cellNode.value = foodArr[i][1];
      cell.appendChild(cellNode);
      row.appendChild(cell);

      itemPrice = foodArr[i][2];

      cell = document.createElement("td");
      cellNode = document.createElement("button");
      cellNode.setAttribute(
        "onclick",
        `deleteRow('${row.id}','${itemId}','${key}')`
      );
      image = document.createElement("img");
      image.src = "trash.png";
      cellNode.appendChild(image);
      cell.appendChild(cellNode);
      row.appendChild(cell);

      tblBody.appendChild(row);

      // add the row to the end of the table body
    }
    var modal_footer = document.createElement("div");
    modal_footer.classList.add("modal-footer");
    modal_footer_button = document.createElement("button");
    modal_footer.setAttribute("onclick", "refresh()");
    modal_footer_button_textContent = document.createTextNode(
      "CLOSE SESSION (GENERATE BILL)"
    );
    modal_footer_button.id = "left";
    modal_footer_button.appendChild(modal_footer_button_textContent);
    modal_footer.appendChild(modal_footer_button);
    // put the <tbody> in the <table>
    tbl.appendChild(tblBody);
    // appends <table> into <body>
    body.appendChild(modal_header);

    body.appendChild(tbl);
    body.appendChild(modal_footer);
    // sets the border attribute of tbl to 2;
    tbl.setAttribute("border", "0");
    body.style.display = "block";
  }
};
span = document.getElementsByClassName("close")[0];
function closing(id) {
  id = document.getElementById(id);
  id.classList.remove("active");
  // console.log("closing");
  modal = document.getElementById("modal");
  modal.style.display = "none";
}
function deleteRow(rowId, itemId, key) {
  rowId = document.getElementById(rowId);
  rowId.classList.add("hidden");

  arr = billDetails.get(key);
  map = new Map();
  map = arr[2];
  foodArr = [[]];
  foodArr = map.get(itemId);

  total = arr[0];
  currentItemTotalPrice = Number(foodArr[0]);
  // console.log(foodArr[0]);
  total -= currentItemTotalPrice;
  arr[0] = total;
  arr[1]--;
  map.delete(itemId);
  arr[2] = map;
  billDetails.set(key, arr);
  // console.log(billDetails.get(key));
  if (arr[1] == 0) {
    closing(key);
    document.getElementById(
      key
    ).outerHTML = `<li id="${key}" ondrop="drop(event)" ondragover="allowDrop(event)" >${key}<br><br> Rs. ${total} | Total items: ${arr[1]}</li>`;
  } else
    document.getElementById(
      key
    ).outerHTML = `<li id="${key}" class="active" ondrop="drop(event)" ondragover="allowDrop(event)" onclick="displayTableDetails('${key}',billDetails)">${key}<br><br> Rs. ${total} | Total items: ${arr[1]}</li>`;
}

function incOrDec(rowId, itemId, key, numberId) {
  rowId = document.getElementById(rowId);

  numberId = document.querySelector("#" + numberId);
  currentCount = Number(numberId.value);
  // console.log("changed value: " + numberId.value);
  arr = [];
  foodArr = [];
  arr = billDetails.get(key);
  totalPrice = arr[0];
  totalItems = arr[1];
  // console.log(arr);
  map = arr[2];
  foodArr = map.get(itemId);
  itemPrice = foodArr[2];
  currentItemTotalPrice = foodArr[0];
  itemCount = foodArr[1];
  if (itemCount > currentCount) {
    //decrement
    itemCount--;
    currentItemTotalPrice -= itemPrice;
    totalPrice -= itemPrice;
    totalItems--;
  } else if (itemCount < currentCount) {
    //increment
    itemCount++;
    currentItemTotalPrice += itemPrice;
    totalPrice += itemPrice;
    totalItems++;
  }
  foodArr[0] = currentItemTotalPrice;
  foodArr[1] = itemCount;
  if (currentCount == 0) {
    map.delete(itemId);
    rowId.classList.add("hidden");
  }
  map.set(itemId, foodArr);
  arr[0] = totalPrice;
  arr[1] = totalItems;
  arr[2] = map;
  billDetails.set(key, arr);
  if (arr[1] == 0) {
    closing(key);
    document.getElementById(
      key
    ).outerHTML = `<li id="${key}" ondrop="drop(event)" ondragover="allowDrop(event)">${key}<br><br> Rs. ${total} | Total items: ${arr[1]}</li>`;
  } else
    document.getElementById(
      key
    ).outerHTML = `<li id="${key}" class="active" ondrop="drop(event)" ondragover="allowDrop(event)" onclick="displayTableDetails('${key}',billDetails)">${key}<br><br> Rs. ${totalPrice} | Total items: ${totalItems}</li>`;

  // console.log(foodArr);
}
function refresh() {
  location.reload();
}
