const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise(resolve => {
    rl.question(question, answer => resolve(answer));
  });
}

async function getValidatorsInput() {
  // For PoW miners
  const miners = [];
  console.log('Enter mining power for 3 miners:');
  for (let i = 1; i <= 3; i++) {
    const power = await ask(`Miner${i} power: `);
    miners.push({ name: `Miner${i}`, power: parseInt(power) });
  }

  // For PoS stakers
  const stakers = [];
  console.log('\nEnter stake for 3 stakers:');
  for (let i = 1; i <= 3; i++) {
    const stake = await ask(`Staker${i} stake: `);
    stakers.push({ name: `Staker${i}`, stake: parseInt(stake) });
  }

  // For DPoS delegates votes
  const delegates = [];
  console.log('\nEnter votes for 3 delegates:');
  for (let i = 1; i <= 3; i++) {
    const votes = await ask(`Delegate${i} votes: `);
    delegates.push({ name: `Delegate${i}`, votes: parseInt(votes) });
  }

  return { miners, stakers, delegates };
}

function simulateConsensus({ miners, stakers, delegates }) {
  console.log('\n=== Proof of Work (PoW) Simulation ===');
  console.log('Miners with their mining power:', miners);
  const selectedMiner = miners.reduce((max, miner) => (miner.power > max.power ? miner : max), miners[0]);
  console.log(`Selected Miner: ${selectedMiner.name} with power: ${selectedMiner.power}`);
  console.log('Selection logic: Miner with the highest computational power wins.\n');

  console.log('=== Proof of Stake (PoS) Simulation ===');
  console.log('Stakers with their stakes:', stakers);
  const selectedStaker = stakers.reduce((max, staker) => (staker.stake > max.stake ? staker : max), stakers[0]);
  console.log(`Selected Staker: ${selectedStaker.name} with stake: ${selectedStaker.stake}`);
  console.log('Selection logic: Validator with the highest stake wins.\n');

  console.log('=== Delegated Proof of Stake (DPoS) Simulation ===');
  console.log('Delegates with their votes:', delegates);

  // Create weighted array of delegates based on votes
  const weightedDelegates = [];
  delegates.forEach(delegate => {
    for (let i = 0; i < delegate.votes; i++) {
      weightedDelegates.push(delegate);
    }
  });

  // Pick randomly from weighted list
  const randomIndex = Math.floor(Math.random() * weightedDelegates.length);
  const selectedDelegate = weightedDelegates[randomIndex];
  console.log(`Selected Delegate: ${selectedDelegate.name} with votes: ${selectedDelegate.votes}`);
  console.log('Selection logic: Delegate is chosen randomly but weighted by number of votes received.');
}

async function main() {
  const validators = await getValidatorsInput();
  simulateConsensus(validators);
  rl.close();
}

main();
