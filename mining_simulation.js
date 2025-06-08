// mining_simulation.js

document.getElementById("miningForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const blockData = document.getElementById("blockData").value;
  const difficulty = parseInt(document.getElementById("difficulty").value);
  const resultDiv = document.getElementById("miningResult");

  if (!blockData || isNaN(difficulty)) {
    resultDiv.innerHTML = "<p style='color:red;'>Please enter valid block data and difficulty.</p>";
    return;
  }

  class Block {
    constructor(data) {
      this.data = data;
      this.nonce = 0;
      this.hash = this.calculateHash();
    }

    calculateHash() {
      return CryptoJS.SHA256(this.data + this.nonce).toString();
    }

    mineBlock(difficulty) {
      const target = Array(difficulty + 1).join("0");
      const start = Date.now();
      while (!this.hash.startsWith(target)) {
        this.nonce++;
        this.hash = this.calculateHash();
      }
      const end = Date.now();
      const timeTaken = ((end - start) / 1000).toFixed(3);

      return {
        data: this.data,
        nonce: this.nonce,
        hash: this.hash,
        time: timeTaken,
        difficulty: difficulty
      };
    }
  }

  const block = new Block(blockData);
  const mined = block.mineBlock(difficulty);

  resultDiv.innerHTML = `
    <h3>Mined Block Result</h3>
    <p><strong>Mined Block Data:</strong> ${mined.data}</p>
    <p><strong>Nonce found:</strong> ${mined.nonce}</p>
    <p><strong>Hash:</strong> ${mined.hash}</p>
    <p><strong>Difficulty:</strong> ${mined.difficulty}</p>
    <p><strong>Time taken:</strong> ${mined.time} seconds</p>
  `;
});
