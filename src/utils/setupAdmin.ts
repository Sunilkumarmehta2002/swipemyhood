import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export async function setupDefaultAdmin() {
  try {
    // Create admin user with Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      'admin@swipemyhood.in',
      'admin123456'
    );

    // Set admin data in Firestore
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      email: 'admin@swipemyhood.in',
      name: 'Admin User',
      isAdmin: true,
      createdAt: new Date(),
      lastActive: new Date()
    });

    console.log('✅ Default admin user created successfully!');
    console.log('📧 Email: admin@swipemyhood.in');
    console.log('🔑 Password: admin123456');
    console.log('⚠️  Remember to change these credentials in production!');

    return userCredential.user;
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      console.log('ℹ️  Admin user already exists');
      
      // Update existing user to be admin
      const user = auth.currentUser;
      if (user) {
        await setDoc(doc(db, 'users', user.uid), {
          email: 'admin@swipemyhood.in',
          name: 'Admin User',
          isAdmin: true,
          createdAt: new Date(),
          lastActive: new Date()
        }, { merge: true });
        
        console.log('✅ Existing user updated to admin');
      }
    } else {
      console.error('❌ Error creating admin user:', error);
      throw error;
    }
  }
}

// Function to run this setup (can be called from browser console)
(window as any).setupAdmin = setupDefaultAdmin; 