// cart to order place

let cards = document.querySelectorAll(".cardCart");
let placeOrder = document.querySelector("#PlaceOrder");

placeOrder.addEventListener("click", placeOrderAll);

function cal(card) {
  let sizeS,
    quantityS = 0;
  let checkItem = card.children[0].children[0].children[0].children[0];
  if (checkItem.checked) {
    // console.log("order place successfully", checkItem.value);
    // // inCase cart.ejs change
    // console.log(card.children[0].children[2].children[0].children[6]);
    // console.log(
    //   card.children[0].children[2].children[0].children[3].children[1]
    //     .children
    // );
    // console.log(
    //   card.children[0].children[2].children[0].children[4].children[1]
    //     .children
    // );
    let target = card.children[0].children[2].children[0].children[6];
    let sizes =
      card.children[0].children[2].children[0].children[3].children[1].children;
    let quantities =
      card.children[0].children[2].children[0].children[4].children[1].children;

    for (let size of sizes) {
      if (size.selected) {
        sizeS = size.value;
      }
    }
    for (let quantity of quantities) {
      if (quantity.selected) {
        quantityS = quantity.value;
      }
    }
    //covert string to number
    let totalPrice = parseInt(quantityS) * parseInt(target.innerText);

    let data = {
      _id: checkItem.value,
      selectedSize: sizeS,
      quantity: quantityS,
      price: totalPrice,
    };
    return data;
  } else {
    console.log("items not checked");
  }
}

function placeOrderAll() {
  let all_data = [];
  let data = 0;
  for (let card of cards) {
    data = cal(card);
    if(data) {
      all_data.push(data);
    }
  }
  sendPostReq(all_data);
}

for (let card of cards) {
  let target = card.children[0].children[2].children[0].children[6];
  let ePrice = card.children[0].children[2].children[0].children[7];
  let select = card.children[0].children[2].children[0].children[4].children[1];
  select.addEventListener("change", () => {
    let Qty,
      Price = 0;
    for (let quantity of select.children) {
      if (quantity.selected) {
        Qty = parseInt(quantity.value);
      }
    }
    Price = parseInt(target.innerText);
    changePrice(Price, Qty, ePrice);
  });
}

function changePrice(Price, Qty, ePrice) {
  let value = Price * Qty;
  ePrice.innerText = "₹ " + value.toLocaleString("en-IN");
  value = 0;
}

async function sendPostReq(all_data) {
  if (all_data == []) {
    alert("Something went wrong while placing the order.");
  } else {
    try {
      const response = await axios.post(
        "http://localhost:8081/confirm",
        all_data,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.success) {
        window.location.href = "/checkout"; // ✅ manual redirect
      } else {
        if (response.data.message) {
          alert(response.data.message);
        } else {
          alert("Failed to save order.");
        }
      }
    } catch (err) {
      console.error("Error sending request:", err);
      alert("Something went wrong while placing the order.");
    }
  }
}
