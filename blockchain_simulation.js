const crypto = require("crypto");
const readline = require("readline");

class Block {
  constructor(index, timestamp, data, previousHash = "") {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.nonce = 0;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return crypto
      .createHash("sha256")
      .update(
        this.index +
          this.timestamp +
          JSON.stringify(this.data) +
          this.previousHash +
          this.nonce
      )
      .digest("hex");
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    return new Block(0, new Date().toISOString(), "Genesis Block", "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.hash = newBlock.calculateHash();
    this.chain.push(newBlock);
  }

  printChain() {
    this.chain.forEach((block, i) => {
      console.log(`\nBlock ${i} ----------------`);
      console.log(`Data         : ${JSON.stringify(block.data)}`);
      console.log(`Hash         : ${block.hash}`);
      console.log(`PreviousHash : ${block.previousHash}`);
    });
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const current = this.chain[i];
      const previous = this.chain[i - 1];

      if (current.hash !== current.calculateHash()) {
        return false;
      }

      if (current.previousHash !== previous.hash) {
        return false;
      }
    }
    return true;
  }
}

// Use readline to get user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let myChain = new Blockchain();
let blockCount = 0;

function askBlockData() {
  if (blockCount >= 3) {
    console.log("\n✅ Final Blockchain:");
    myChain.printChain();
    console.log("\nIs blockchain valid? ", myChain.isChainValid());
    rl.close();
    return;
  }

  rl.question(`Enter data for block ${blockCount + 1}: `, (inputData) => {
    myChain.addBlock(
      new Block(
        blockCount + 1,
        new Date().toISOString(),
        { message: inputData }
      )
    );
    blockCount++;
    askBlockData();
  });
}

askBlockData();
