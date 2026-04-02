import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db, googleProvider } from '../firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoaded, setAuthLoaded] = useState(false);

  const [points, setPoints] = useState(0);
  const [lifetimePoints, setLifetimePoints] = useState(0);
  const [wishlist, setWishlist] = useState([]);
  const [dailyLog, setDailyLog] = useState({ date: new Date().toDateString(), count: 0 });

  // 1. Listen for Google Auth changes
  useEffect(() => {
    if (!auth) {
      setAuthLoaded(true);
      return;
    }
    
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          // Fetch from Google Cloud Firestore
          const docRef = doc(db, 'points', currentUser.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            setPoints(data.points || 0);
            setLifetimePoints(data.lifetimePoints || data.points || 0);

            // Backwards compatibility hook to cast old database objects strictly into Strings! 
            let cloudWishlist = data.wishlist || [];
            if (cloudWishlist.length > 0 && typeof cloudWishlist[0] === 'object') {
              cloudWishlist = cloudWishlist.map(b => {
                const author = b.author_name ? (Array.isArray(b.author_name) ? b.author_name.join(' & ') : b.author_name) : 'Unknown';
                return `${b.title}, ${author}`;
              });
            }
            setWishlist(cloudWishlist);
            
            setDailyLog(data.dailyLog || { date: new Date().toDateString(), count: 0 });
          } else {
            // First time logging in? Initialize fresh cloud record!
            const defaultLog = { date: new Date().toDateString(), count: 0 };
            await setDoc(docRef, { points: 10, lifetimePoints: 10, wishlist: [], dailyLog: defaultLog, meals: [] }); 
            setPoints(10);
            setLifetimePoints(10);
            setWishlist([]);
            setDailyLog(defaultLog);
          }
        } catch (error) {
          console.error("Firestore loading delay - check rules or config!", error);
        }
      } else {
        // Logged out
        setUser(null);
        setPoints(0);
        setLifetimePoints(0);
        setWishlist([]);
      }
      setAuthLoaded(true);
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    if (!auth) {
      alert("Uh oh! I'm missing my Firebase Keys. Please check your .env file!");
      return;
    }
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error(err);
      alert("Google Login Error: " + err.message);
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  // Generalized Firebase mutation hook
  const syncToFirestore = async (updates) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'points', user.uid), updates);
    } catch(err) {
      console.error('Failed pushing remote state to Firebase:', err);
    }
  };

  const logMeal = (mealString, amount = 10) => {
    if (!user) return false; // Guest protection
    
    if (!mealString || typeof mealString !== 'string') return false; // Must provide meal

    const today = new Date().toDateString();
    let updatedLog = { ...dailyLog };
    let newPoints = points;
    let newLifetime = lifetimePoints;
    
    // Day checking rate boundaries
    if (dailyLog.date !== today) {
      updatedLog = { date: today, count: 1 };
      newPoints += amount;
      newLifetime += amount;
    } else {
      if (dailyLog.count >= 4) return false;
      updatedLog.count += 1;
      newPoints += amount;
      newLifetime += amount;
    }
    
    // Instantly update front-end
    setDailyLog(updatedLog);
    setPoints(newPoints);
    setLifetimePoints(newLifetime);

    // Blast it identically to Google Servers with our new Array payload
    syncToFirestore({ 
      points: newPoints, 
      lifetimePoints: newLifetime,
      dailyLog: updatedLog,
      meals: arrayUnion({ meal: mealString, timestamp: new Date().toLocaleDateString('en-US') })
    });
    return true;
  };

  const getRemainingLogs = () => {
    if (!user) return 0;
    const today = new Date().toDateString();
    if (dailyLog.date !== today) return 4;
    return Math.max(0, 4 - dailyLog.count);
  };

  const addBooksToWishlist = (book) => {
    if (!user) return; // Ignore if guest trying to track a book
    setWishlist(prev => {
      if (prev.length >= 600) {
        alert("Wishlist full! You can only store up to 600 books.");
        return prev;
      }
      
      const author = book.author_name ? (Array.isArray(book.author_name) ? book.author_name.join(' & ') : book.author_name) : 'Unknown';
      const bookString = `${book.title}, ${author}`;

      if (!prev.includes(bookString)) {
        const newWishlist = [...prev, bookString];
        syncToFirestore({ wishlist: newWishlist });
        return newWishlist;
      }
      return prev;
    });
  };

  const removeBookFromWishlist = (bookStringToRemove) => {
    if (!user) return;
    setWishlist(prev => {
      const slimmedList = prev.filter(b => b !== bookStringToRemove);
      syncToFirestore({ wishlist: slimmedList });
      return slimmedList;
    });
  };

  const isBookInWishlist = (bookObj) => {
    const author = bookObj.author_name ? (Array.isArray(bookObj.author_name) ? bookObj.author_name.join(' & ') : bookObj.author_name) : 'Unknown';
    const bookString = `${bookObj.title}, ${author}`;
    return wishlist.includes(bookString);
  };

  return (
    <AppContext.Provider value={{
      user,
      authLoaded,
      login,
      logout,
      points,
      lifetimePoints,
      logMeal,
      getRemainingLogs,
      wishlist,
      addBooksToWishlist,
      removeBookFromWishlist,
      isBookInWishlist
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
