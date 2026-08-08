import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      maxlength: [80, "Name cannot exceed 80 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
      trim: true,
      match: [/^\+?[\d\s\-]{7,15}$/, "Invalid mobile number"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false, // never returned in queries by default
    },

    // Wallet
    walletBalance: { type: Number, default: 0, min: 0 },
    totalRoi:      { type: Number, default: 0, min: 0 },
    levelIncome:   { type: Number, default: 0, min: 0 },

    // Referral
    referralCode: {
      type: String,
      unique: true,   // this already creates the index
      uppercase: true,
    },
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    isActive: { type: Boolean, default: true },

    // Email verification
    emailVerified: { type: Boolean, default: false },
    emailOtp:      { type: String,  select: false, default: null },
    emailOtpExpiry:{ type: Date,    select: false, default: null },
  },
  { timestamps: true },
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
// referralCode index is created by unique:true on the field — don't duplicate it
userSchema.index({ referredBy: 1 });

// ─── Pre-save: hash password + generate referral code ────────────────────────
userSchema.pre("save", async function () {
  // Hash password if modified
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
  }

  // Generate referral code on first save
  if (!this.referralCode) {
    this.referralCode = "NEXA-" + crypto.randomBytes(3).toString("hex").toUpperCase();
  }
});

// ─── Instance method: compare password ───────────────────────────────────────
userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// ─── Sanitise output ─────────────────────────────────────────────────────────
userSchema.methods.toPublic = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.emailOtp;
  delete obj.emailOtpExpiry;
  return obj;
};

const User = mongoose.model("User", userSchema);
export default User;
