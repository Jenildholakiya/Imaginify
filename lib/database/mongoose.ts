import { error } from 'console';
import mongoose, { Mongoose } from 'mongoose';

const MongoURL = process.env.MONGODB_URL

interface MongooseConnection {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null
}

let cached: MongooseConnection = (global as any).mongoose

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null }
}

export const connectToDatabase = async () => {
  if (cached.conn) {
    return cached.conn
  }

  if (!MongoURL) {
    throw new Error('Missing MongoURL')
  }

  cached.promise =
    cached.promise || mongoose.connect(MongoURL, {
      dbName: 'imaginify', bufferCommands: false
    })

  cached.conn = await cached.promise

  return cached.conn
}