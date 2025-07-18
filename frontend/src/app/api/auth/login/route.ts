import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const MONGO_URI = process.env.MONGO_URI!;
const JWT_SECRET = process.env.JWT_SECRET!;

// User model definition (simplified, adjust as needed)
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String },
  firstName: { type: String },
  lastName: { type: String }
});
const User = mongoose.models.User || mongoose.model('User', userSchema);

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGO_URI);
  }
}

export async function POST(req: NextRequest) {
  await connectDB();
  const { email, password } = await req.json();
  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ message: 'Invalid credentials.' }, { status: 401 });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return NextResponse.json({ message: 'Invalid credentials.' }, { status: 401 });
  }
  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
  return NextResponse.json({ token });
} 