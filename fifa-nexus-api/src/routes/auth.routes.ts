import { Router } from 'express';
import { verifyToken, AuthRequest } from '../middleware/auth';
import { User } from '../models/User';

const router = Router();

// Endpoint called by frontend after Firebase login to sync user data
router.post('/sync', verifyToken, async (req: AuthRequest, res) => {
  try {
    const firebaseUser = req.user.firebaseUser;
    
    // Check if user exists in MongoDB
    let user = await User.findOne({ uid: firebaseUser.uid });

    if (!user) {
      // Create new user
      user = new User({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.name || '',
        photoURL: firebaseUser.picture || '',
        role: 'user' // Default role
      });
      await user.save();
    } else {
      // Update info just in case
      user.email = firebaseUser.email || user.email;
      user.displayName = firebaseUser.name || user.displayName;
      user.photoURL = firebaseUser.picture || user.photoURL;
      await user.save();
    }

    res.status(200).json({
      message: 'User synced successfully',
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Sync Error:', error);
    res.status(500).json({ error: 'Failed to sync user data' });
  }
});

// Endpoint to fetch current user profile
router.get('/me', verifyToken, async (req: AuthRequest, res) => {
  if (!req.user.dbUser) {
    return res.status(404).json({ error: 'User not found in DB' });
  }
  res.status(200).json(req.user.dbUser);
});

export default router;
