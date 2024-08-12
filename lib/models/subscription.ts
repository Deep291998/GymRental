import { Schema, model, models } from "mongoose";

const SubscriptionSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    type: {
      type: String,
      enum: ["BIWEEKLY", "MONTHLY"],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Subscription =
  models.Subscription || model("Subscription", SubscriptionSchema);
export default Subscription;
