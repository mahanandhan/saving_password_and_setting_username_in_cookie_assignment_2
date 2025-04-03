const MIN = 100;
const MAX = 999;
const pinInput = document.getElementById('pin');
const sha256HashView = document.getElementById('sha256-hash');
const resultView = document.getElementById('result');
const checkButton = document.getElementById('check');

// Function to store in local storage
function store(key, value) {
  localStorage.setItem(key, value);
}

// Function to retrieve from local storage
function retrieve(key) {
  return localStorage.getItem(key);
}

// Function to generate a random 3-digit number
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to clear local storage
function clearStorage() {
  localStorage.clear();
}

// Function to generate SHA-256 hash of a given string
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Function to get or generate SHA-256 hash of a random number
async function getSHA256Hash() {
  let cachedNumber = retrieve('randomNumber');
  let cachedHash = retrieve('sha256');

  if (!cachedNumber || !cachedHash) {
    cachedNumber = getRandomNumber(MIN, MAX).toString();
    cachedHash = await sha256(cachedNumber);
    store('randomNumber', cachedNumber);
    store('sha256', cachedHash);
  }

  return cachedHash;
}

// Function to initialize and display the hash
async function main() {
  sha256HashView.innerHTML = 'Calculating...';
  const hash = await getSHA256Hash();
  sha256HashView.innerHTML = hash;
}

// Function to check user input against the stored hash
async function test() {
  const pin = pinInput.value;
  if (pin.length !== 3) {
    resultView.innerHTML = '💡 Please enter a 3-character input';
    resultView.classList.remove('hidden');
    return;
  }

  const storedNumber = retrieve('randomNumber');
  if (pin === storedNumber) {
    resultView.innerHTML = '🎉 Success! You guessed the correct input!';
    resultView.classList.add('success');
  } else {
    resultView.innerHTML = '❌ Incorrect! Try again.';
  }
  resultView.classList.remove('hidden');
}

// Ensure pinInput only accepts up to 3 characters
pinInput.addEventListener('input', (e) => {
  pinInput.value = e.target.value.slice(0, 3);
});

// Attach the test function to the button
checkButton.addEventListener('click', test);

main();