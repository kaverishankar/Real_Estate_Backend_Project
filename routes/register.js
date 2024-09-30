import {Router} from 'express';
import bcrypt from 'bcryptjs';
import {User} from '../db-utils/models.js';

const router = Router();

router.post('/', async (req, res) => {
  const { name, phone, email, address, userType, password } = req.body;

  try {
  
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const saltRounds = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const userId = Date.now().toString();

    const newUser = new User({
      name,
      userId,
      phone,
      email,
      address,
      userType,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
