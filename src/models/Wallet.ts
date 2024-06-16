import { Model, Schema, model } from "mongoose";

const WalletSchema: Schema = new Schema({
  ranking: {
    type: Number,
    required: true,
  },
  wallet_address: {
    type: String,
    required: true,
    unique: true
  },
  balance: {
    type: Number,
    default: 0
  },
  energy: {
    type: Number,
    default: 500
  },
  level: {
    type: Number,
    default: 0
  },
  createdDate: {
    type: String,
    default: new Date().toISOString()
  }
});

const Wallet: Model<any> = model("Wallet", WalletSchema);

export default Wallet;