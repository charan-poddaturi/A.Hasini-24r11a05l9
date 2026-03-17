import { Schema, model, Document, Types } from "mongoose";

export interface EmergencyContact {
  _id?: Types.ObjectId;
  name: string;
  relation: string;
  phone: string;
  isVerified: boolean;
}

export interface DonorDetails {
  isAvailable: boolean;
  lastDonated?: Date;
  verifiedByAdmin: boolean;
}

export interface Address {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  bloodType?: string;
  medicalInfo?: string;
  emergencyContacts: EmergencyContact[];
  address: Address;
  isDonor: boolean;
  donorDetails: DonorDetails;
  role: "user" | "admin";
  createdAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const EmergencyContactSchema = new Schema<EmergencyContact>({
  name: { type: String, required: true },
  relation: { type: String, required: true },
  phone: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
});

const AddressSchema = new Schema<Address>({
  street: String,
  city: String,
  state: String,
  country: String,
  zip: String,
  coordinates: {
    lat: Number,
    lng: Number,
  },
});

const DonorDetailsSchema = new Schema<DonorDetails>({
  isAvailable: { type: Boolean, default: false },
  lastDonated: Date,
  verifiedByAdmin: { type: Boolean, default: false },
});

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    phone: String,
    bloodType: String,
    medicalInfo: String,
    emergencyContacts: { type: [EmergencyContactSchema], default: [] },
    address: { type: AddressSchema, default: {} },
    isDonor: { type: Boolean, default: false },
    donorDetails: { type: DonorDetailsSchema, default: () => ({}) },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// bcrypt hashing
import bcrypt from "bcryptjs";

UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

export const User = model<IUser>("User", UserSchema);
