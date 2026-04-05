import { auth, provider, signInWithPopup, signOut, onAuthStateChanged, db, doc, getDoc, updateDoc, setDoc } from './firebase.js';
import { initNav, USER_ICON } from './nav.js';

// Init Navigation and Auth just like other pages
initNav();
const authBtn = document.getElementById('auth-btn');

let currentUser = null;

onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUser = user;
    authBtn.innerHTML = `${USER_ICON} Logout (${user.displayName.split(' ')[0]})`;
    authBtn.onclick = () => signOut(auth).then(() => location.reload());

    // Sync feeds
    try {
      const docRef = doc(db, 'globalData', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && docSnap.data().petFeeds !== undefined) {
        // Sync local to highest value
        const firebaseFeeds = docSnap.data().petFeeds;
        if (firebaseFeeds > feedCount) {
          feedCount = firebaseFeeds;
          localStorage.setItem('bites4books_pet_feeds', feedCount);
          updateStatsUI();
        } else if (feedCount > firebaseFeeds) {
          // Push local ahead to firebase
          await updateDoc(docRef, { petFeeds: feedCount });
        }
      } else {
        // Init firebase pet tracking
        await setDoc(docRef, { petFeeds: feedCount }, { merge: true });
      }
    } catch (e) {
      console.log('Firebase sync error', e);
    }
  } else {
    currentUser = null;
    authBtn.innerHTML = `${USER_ICON} Login`;
    authBtn.onclick = () => signInWithPopup(auth, provider).catch(e => alert(e.message));
  }
});

// Pet Logic
const petWrapper = document.getElementById('pet-wrapper');
const petSpeech = document.getElementById('pet-speech');
const foodItems = document.querySelectorAll('.food-item');
const feedDisplay = document.getElementById('feed-display');
const levelDisplay = document.getElementById('level-display');
const xpFill = document.getElementById('xp-fill');

// Reset pig tap logic
petWrapper.addEventListener('pointerdown', (e)=>{
  if(e.target===petWrapper || petWrapper.contains(e.target)){
    petWrapper.classList.add('laugh');
    petSpeech.classList.add('show');
    petSpeech.textContent = 'Haha!';
    setTimeout(()=>{
      petWrapper.classList.remove('laugh');
      petSpeech.classList.remove('show');
    }, 600);
  }
});

// Load stored progress
let feedCount = parseInt(localStorage.getItem('bites4books_pet_feeds') || '0');
let dailyPetLog = JSON.parse(localStorage.getItem('bites4books_daily_pet') || '{"date":"","count":0}');
const growthStages = [5, 15, 25, 35, 45, 60, 70, 80];
updateStatsUI();

// Drag & Drop State
let dragClone = null;
let currentEmoji = '';
let dragTimeout = null;
let startX = 0;
let startY = 0;

foodItems.forEach(item => {
  item.addEventListener('pointerdown', (e) => {
    if (dragClone) return;

    startX = e.clientX;
    startY = e.clientY;

    e.target.releasePointerCapture(e.pointerId);
    dragClone = document.createElement('div');
    dragClone.className = 'food-clone';
    currentEmoji = item.querySelector('.food-emoji').textContent;
    dragClone.textContent = currentEmoji;

    document.body.appendChild(dragClone);
    moveClone(e.clientX, e.clientY);

    document.addEventListener('pointermove', onPointerMove, { passive: false });
    document.addEventListener('pointerup', onPointerUp);
    document.addEventListener('pointercancel', onPointerUp);
  });
});

function moveClone(x, y) {
  if (dragClone) {
    dragClone.style.left = `${x}px`;
    dragClone.style.top = `${y}px`;
  }
}

function onPointerMove(e) {
  if (dragClone) {
    e.preventDefault(); // Stop native scrolling while dragging the clone
    moveClone(e.clientX, e.clientY);
  }
}

function onPointerUp(e) {
  document.removeEventListener('pointermove', onPointerMove);
  document.removeEventListener('pointerup', onPointerUp);
  document.removeEventListener('pointercancel', onPointerUp);

  if (!dragClone) return;

  const petRect = petWrapper.getBoundingClientRect();
  const x = e.clientX;
  const y = e.clientY;

  // Give a generous drop zone around the pet
  const isOverPet = x > petRect.left - 30 && x < petRect.right + 30 && y > petRect.top - 30 && y < petRect.bottom + 30;

  if (isOverPet) feedPet(x, y);

  dragClone.remove();
  dragClone = null;
}

async function feedPet(x, y) {
  const today = new Date().toDateString();
  if (dailyPetLog.date !== today) {
    dailyPetLog = { date: today, count: 0 };
  }

  if (dailyPetLog.count >= 5) {
    // Refuse logic
    petWrapper.classList.add('refuse');
    petSpeech.classList.add('show');
    petSpeech.textContent = "I am not hungry";
    setTimeout(() => {
      petWrapper.classList.remove('refuse');
      petSpeech.classList.remove('show');
    }, 1500);
    return;
  }

  dailyPetLog.count++;
  localStorage.setItem('bites4books_daily_pet', JSON.stringify(dailyPetLog));

  feedCount++;
  localStorage.setItem('bites4books_pet_feeds', feedCount);

  updateStatsUI();

  // Sync to Firebase if logged in
  if (currentUser) {
    try {
      const docRef = doc(db, 'globalData', currentUser.uid);
      await updateDoc(docRef, { petFeeds: feedCount });
    } catch (e) { console.log('Firebase sync error', e); }
  }

  // Create Crumbs
  for (let i = 0; i < 6; i++) {
    const crumb = document.createElement('div');
    crumb.className = 'crumb';
    crumb.textContent = currentEmoji;
    crumb.style.left = `${x}px`;
    crumb.style.top = `${y}px`;
    
    // Spread outward and fall down
    const dx = (Math.random() * 100 - 50) + 'px';
    const dy = (Math.random() * 60 + 40) + 'px'; // Fall downwards
    const rot = (Math.random() * 360 - 180) + 'deg';
    
    crumb.style.setProperty('--dx', dx);
    crumb.style.setProperty('--dy', dy);
    crumb.style.setProperty('--rot', rot);
    
    document.body.appendChild(crumb);
    setTimeout(() => crumb.remove(), 800);
  }

  // Pet Reaction
  petWrapper.classList.add('happy', 'jump');
  petSpeech.classList.add('show');

  const phrases = ["Yum! 💖", "So fresh!", "Thank u!", "*Nibble nibble*", "Delish! 🐹", "More pls!", "Ahhh~"];
  petSpeech.textContent = phrases[Math.floor(Math.random() * phrases.length)];

  setTimeout(() => {
    petWrapper.classList.remove('happy', 'jump');
    petSpeech.classList.remove('show');
  }, 1200);
}

function updateStatsUI() {
  feedDisplay.textContent = feedCount;

  // Custom levels based on specific feed milestones
  // Stages: 5, 15, 25, 35, 45, 60, 70, 80
  let levelIndex = 0;
  for (let i = 0; i < growthStages.length; i++) {
    if (feedCount >= growthStages[i]) {
      levelIndex = i + 1;
    } else {
      break;
    }
  }

  const currentLevel = levelIndex + 1; // Start at level 1
  levelDisplay.textContent = currentLevel;

  // Calculate XP %
  const currentMilestone = levelIndex === 0 ? 0 : growthStages[levelIndex - 1];
  const nextMilestone = growthStages[levelIndex] || 100; // Cap out logic cleanly

  let percent = 100;
  if (levelIndex < growthStages.length) {
    const xpInLevel = feedCount - currentMilestone;
    const requiredForNext = nextMilestone - currentMilestone;
    percent = (xpInLevel / requiredForNext) * 100;
  }
  xpFill.style.width = `${Math.min(percent, 100)}%`;

  // Scale pet: grows exactly with each growth stage threshold crossed
  const baseScale = 0.9;
  // Adds 0.08 scale per level increment explicitly
  const scale = baseScale + (levelIndex * 0.08);
  petWrapper.style.transform = `scale(${scale})`;
  petWrapper.style.setProperty('--current-scale', scale);
}
