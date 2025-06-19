import { useEffect, useState } from 'react';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { Button } from './ui/button';

export default function GoogleLogin() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => setUser(u));
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-800">{user.displayName}</span>
        <Button size="sm" onClick={handleLogout}>Sign Out</Button>
      </div>
    );
  }

  return (
    <Button size="sm" onClick={handleLogin}>Sign in with Google</Button>
  );
}
