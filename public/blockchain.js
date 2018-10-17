const CryptoJS = require("crypto-js");

class Block{
  constructor(index, hash, previousHash, timestamp, data){
    this.index = index;
    this.hash = hash;
    this.previousHash = previousHash;
    this.timestamp = timestamp;
    this.data = data;
  }
}

const nowTime= (new Date).getTime().now / 1000;

const genesisBlock = new Block(
  0,
  "2C4CEB90344F20CC4C77D626247AED3ED530C1AEE3E6E85AD494498B17414CAC",
  null,
  1520312194926,
  "This is the genesis!!"
);

let blockchain = [genesisBlock];

const getLastBlock = () => blockchain[blockchain.length - 1]

const getTimestamp = () => new Date().getTime() / 1000;

const getBlockchain = () => blockchain;

const createHash = (index, previousHash, timestamp, data)=>
  CryptoJS.SHA256(
    index + previousHash + timestamp + JSON.stringify(data)
  ).toString();

const createNewBlock = data => {
  const previousBlock = getLastBlock();
  const newBlockIndex = previousBlock.index + 1;
  const newTimestamp = getTimestamp();
  const newHash = createHash(
    newBlockIndex,
    previousBlock.hash,
    newTimestamp,
    data
  );
  const newBlock = new Block(
    newBlockIndex,
    newHash,
    previousBlock.hash,
    newTimestamp,
    data
  );
  addBlockToChain(newBlock);
  return newBlock;
};

const getBlockHash = block =>
  createHash(block.index, block.previousHash, block.timestamp, block.data);

const isNewBlockValid = (candidateBlock, latestBlock) => {
  if(!isNewStructureValid(candidateBlock)){
    console.log("The candidate block structure is not valid")
    return false;
  }else if(latestBlock.index + 1 !== candidateBlock.index){
    console.log("The candidate block doesnt have a valid index")
    return false;
  }else if(latestBlock.hash !== candidateBlock.previousHash){
    console.log(
      "The previousHash of the candidate block is not the latest block"
    );
    return false;
  }else if(getBlockHash(candidateBlock) !== candidateBlock.hash){
    console.log("The hash of this block is invalid");
    return false;
  }
  return true;
};

const isNewStructureValid = (block) => {
  console.log(typeof block.index);
  console.log(typeof block.hash);
  console.log(typeof block.previousHash);
  console.log(typeof block.timestamp);

  return (
    typeof block.index === "number" &&
    typeof block.hash === "string" &&
    typeof block.previousHash === 'string' &&
    typeof block.timestamp === "number" &&
    typeof block.data === "string"
  );
};

const isChainValid = (candidateChain) => {
  const isGenesisValid = block => {
    return JSON.stringify(block) === JSON.stringify(genesisBlock);
  };
  if(!isGenesisValid(candidateChain[0])){
    console.log(
      "The candidateChain's genesisBlock is not the same as ourr genesisBlock"
    );
    return false;
  }
  //제네시스 블록을 검증하고 싶지 않긱 때문에 i=1부터 시작
  for(let i= 1; i < candidateChain.length; i++){
    if(!isNewBlockValid(candidateChain[i], candidateChain[i - 1])){
      return false;
    }
  }
  return true;
};

const replaceChain = newChain => {
  if(
    isChainValid(candidateChain) &&
    candidateChain.length > getBlockchain().length
  ){
    blockchain = candidateChain;
    return true;
  }else {
    return false;
  }
};
const addBlockToChain = candidateBlock => {
  if(isNewBlockValid(candidateBlock, getLastBlock())){
    getBlockchain().push(candidateBlock);
    return true;
  } else {
    return false;
  }
};

module.exports = {
  getBlockchain,
  createNewBlock
};
