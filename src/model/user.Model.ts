import mongoose, { Document, Schema } from 'mongoose';



// User Schema
export interface IUser extends Document {
  clerkId: string;
  email: string | null;
  firstName?: string;
  lastName?: string;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, unique: true, sparse: true },
  firstName: { type: String },
  lastName: { type: String },
}, {
  timestamps: true,
});

UserSchema.pre('save', function (next) {
  if (this.email === null) {
    this.email = undefined;
  }
  next();
});



// Export Models
// const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", userScheme);
const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);


export { User };