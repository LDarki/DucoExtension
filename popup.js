const extVersion = "1.1";

// Check for updates

getJSON("https://raw.githubusercontent.com/LDarki/DucoExtension/main/manifest.json").then((data) => {
  let version = data["version"];
  if (version != extVersion) {
    document.querySelector(".container").remove();

    let newNode = document.createElement("div");

    let parentDiv = document.querySelector(".footer").parentNode;
    let sp2 = document.querySelector(".footer");

    newNode.classList.add("update");
    newNode.classList.add("container");
    newNode.classList.add("text-center");

    newNode.innerHTML = `
      <img src="./images/icon.png" class="img-shadow"/>
      <h1>Outdated</h1>
      <div class="input-group">
        <p>There is a new version of this extension</p>
        <a href="https://github.com/LDarki/DucoExtension/" target="_blank"><button type="button">Check</button></a>
      </div>
    `;

    parentDiv.insertBefore(newNode, sp2);
  }
});

let ducoPrice = "0.0";
let hashRate = 0;

getJSON("http://51.15.127.80/api.json").then((jsonData) => {
  ducoPrice = jsonData["Duco price"];
  ducoPrice = ducoPrice.toFixed(6);
});

document.querySelector('button').addEventListener("click", function(){
    let username = document.querySelector("input").value;
    
    getJSON("http://51.15.127.80/api.json").then((jsonData) => {
      let username = document.querySelector("input").value;
      let myMiners = [];
      let contentjson = {};
      contentjson = jsonData;
      for (process in contentjson["Miners"]) {
        if (contentjson["Miners"][process]["User"].includes(username)) {
          myMiners.push(contentjson["Miners"][process]);
        }
      }
      for (miner in myMiners) {
        hashRate = hashRate + myMiners[miner]["Hashrate"];
      }
    });
    getJSON(
        "http://51.15.127.80/balances.json"
      ).then((data) => {
        if(data[username] != undefined)
        {
          let ctrBalance = data[username];
          let balanceStr = ctrBalance.split(" ");
          let balance = balanceStr[0];

          document.querySelector(".container").remove();

          let newNode = document.createElement("div");
      
          let parentDiv = document.querySelector(".footer").parentNode;
          let sp2 = document.querySelector(".footer");
      
          newNode.classList.add("update");
          newNode.classList.add("container");
          newNode.classList.add("text-center");
      
          newNode.innerHTML = `
            ${getUserImage(username).outerHTML}
            <div class="data">
              <h2>Balance</h2>
              <span>
                ${balance} ᕲ ($ ${(balance * ducoPrice).toFixed(6)})
              </span>
            </div>
            <div class="data">
              <h2>Hashrate</h2>
              <span>
              ${calculateHashrate(hashRate)}
              </span>
            </div>
            <div class="data">
              <h2>Duco Price</h2>
              <span>
              1 ᕲ ≈ $${ducoPrice}
              </span>
            </div>
          `;

          let donateBtn = document.createElement("button");
          donateBtn.innerHTML = "Donate";
          donateBtn.type = "button";
          donateBtn.classList.add("btnMargin");
          donateBtn.onclick = (e) => {
            e.preventDefault();
            document.querySelector(".container").remove();

            let newNode = document.createElement("div");
        
            let parentDiv = document.querySelector(".footer").parentNode;
            let sp2 = document.querySelector(".footer");
        
            newNode.classList.add("update");
            newNode.classList.add("container");
            newNode.classList.add("text-center");
        
            newNode.innerHTML = `
              <div class="data">
                <h2>Donate to Me</h2>
                <span>
                  Duco Username:<br/>
                  LDarki<br/>
                  Bitcoin:<br/>
                  <div class="input-group input-group-copy">
                    <i class="fab fa-btc"></i>
                    <input type="text" id="btcI" value="3NBfP9PpwZM14SR2notzzThjwHDEhotXPR"/>
                    <label for="btcI" id="btc"></label>
                  </div>
                  Ethereum:<br/>
                  <div class="input-group input-group-copy">
                    <i class="fab fa-ethereum"></i>
                    <input type="text" id="ethI" value="0x50C7019e8692c6e132edEb2CDd3310B8E16563d0"/>
                    <label for="ethI" id="eth"></label>
                  </div>
              </div>
              <a href="https://duinocoin.com/donate" target="_blank">
                <button type="button" class="data">
                  Donate to DuinoCoin
                </button>
              </a>
            `;

            parentDiv.insertBefore(newNode, sp2);
          }

          newNode.appendChild(donateBtn);
      
          parentDiv.insertBefore(newNode, sp2);

          var checkExist = setInterval(() => {
            if (document.body.contains(document.getElementById("eth"))) {
              document.getElementById("btc").onclick = (e) => 
              {
                e.preventDefault();
                var copyText = document.getElementById("btcI");
    
                copyText.select();
                copyText.setSelectionRange(0, 99999);
                document.execCommand("copy");
                alert("Copied the text: " + copyText.value);
              };
              document.getElementById("eth").onclick = (e) => 
              {
                e.preventDefault();
                var copyText = document.getElementById("ethI");
    
                copyText.select();
                copyText.setSelectionRange(0, 99999);
                document.execCommand("copy");
                alert("Copied the text: " + copyText.value);
              };
              clearInterval(checkExist);
            }
         }, 100);
        }
        else {
          document.querySelector(".error").innerHTML = `Error logging-in, please try again`;
          document.querySelector('.container').classList.add("warning");
        }
      });
});

