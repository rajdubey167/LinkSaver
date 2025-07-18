import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const MONGO_URI = process.env.MONGO_URI!;

// User model definition (simplified, adjust as needed)
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true }
});
const User = mongoose.models.User || mongoose.model('User', userSchema);

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGO_URI);
  }
}

export async function POST(req: NextRequest) {
  await connectDB();
  const { firstName, lastName, email, username, password } = await req.json();
  if (!firstName || !lastName || !email || !username || !password) {
    return NextResponse.json({ message: 'All fields are required.' }, { status: 400 });
  }
  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    return NextResponse.json({ message: 'Email already registered.' }, { status: 409 });
  }
  const existingUsername = await User.findOne({ username });
  if (existingUsername) {
    return NextResponse.json({ message: 'Username already taken.' }, { status: 409 });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ firstName, lastName, email, username, password: hashedPassword });
  await user.save();
  return NextResponse.json({ message: 'User registered successfully.' });
} 