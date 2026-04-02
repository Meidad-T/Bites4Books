import { auth, provider, signInWithPopup, signOut, onAuthStateChanged, db, doc, getDoc, setDoc } from './firebase.js';

window.currentUser = null;
window.globalData = { points: 0, lifetimePoints: 0, wishlist: [], dailyLog: { count: 0, date: new Date().toDateString() }, meals: [] };

export async function login() {
  try { 
    await signInWithPopup(auth, provider); 
  } catch(e) { 
    console.error(e); 
    alert("Login Error: " + e.message); 
  }
}

export async function logout() {
  await signOut(auth);
  window.location.reload();
}

export function attachNavigation(activePage = 'home') {
  const topNavHTML = `
    <nav class="top-nav">
      <div class="top-nav-logo">Bites2Books</div>
      <div class="top-nav-links">
        <a href="index.html" class="top-nav-item">Home</a>
        <a href="explore.html" class="top-nav-item">Books</a>
        <a href="wishlist.html" class="top-nav-item">Wishlist</a>
        <button id="auth-btn" class="top-nav-item" style="cursor: pointer; background: transparent; border: none; padding: 0; font-family: inherit; font-size: inherit; color: inherit; font-weight: inherit;">Login</button>
        <a href="faq.html" class="top-nav-item">FAQ</a>
      </div>
    </nav>
  `;

  const bottomNavHTML = `
    <nav class="bottom-nav">
      <a href="index.html" class="nav-item ${activePage === 'home' ? 'active' : ''}">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        <span>Home</span>
      </a>
      <a href="explore.html" class="nav-item ${activePage === 'explore' ? 'active' : ''}">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
        <span>Explore</span>
      </a>
      <a href="wishlist.html" class="nav-item ${activePage === 'wishlist' ? 'active' : ''}">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
        <span>Wishlist</span>
      </a>
    </nav>
  `;

  document.body.insertAdjacentHTML('afterbegin', topNavHTML);
  document.body.insertAdjacentHTML('beforeend', bottomNavHTML);
}

export function observeAuth(callback) {
  onAuthStateChanged(auth, async (user) => {
    window.currentUser = user;
    const authBtn = document.getElementById('auth-btn');
    
    if (user) {
      if (authBtn) {
        authBtn.textContent = \`Logout (\${user.displayName.split(' ')[0]})\`;
        authBtn.onclick = logout;
      }
      
      // Load context from Firebase natively
      const docRef = doc(db, 'points', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        let cloudWishlist = data.wishlist || [];
        // Catch object mapping bugs natively just like React
        if (cloudWishlist.length > 0 && typeof cloudWishlist[0] === 'object') {
          cloudWishlist = cloudWishlist.map(b => \`\${b.title}, \${b.author_name ? (Array.isArray(b.author_name) ? b.author_name.join(' & ') : b.author_name) : 'Unknown'}\`);
        }

        window.globalData = {
          points: data.points || 0,
          lifetimePoints: data.lifetimePoints || data.points || 0,
          wishlist: cloudWishlist,
          dailyLog: data.dailyLog || { date: new Date().toDateString(), count: 0 },
          meals: data.meals || []
        };
      } else {
        const defaultLog = { date: new Date().toDateString(), count: 0 };
        window.globalData = { points: 10, lifetimePoints: 10, wishlist: [], dailyLog: defaultLog, meals: [] };
        await setDoc(docRef, window.globalData);
      }
    } else {
      if (authBtn) {
        authBtn.textContent = 'Login';
        authBtn.onclick = login;
      }
      window.globalData = { points: 0, lifetimePoints: 0, wishlist: [], dailyLog: { count: 0, date: new Date().toDateString() }, meals: [] };
    }
    
    if (callback) callback(user);
  });
}
