"use server";
import connectToDb from "@/db";
import Donation from "@/db/models/donation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Razorpay from "razorpay";
import crypto from "crypto";
import { sendEmail } from "./email";
import axios from "axios";

export const createOrder = async (amount: number) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) {
      throw new Error("the user is not authenticated");
    }
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });
    const options = {
      amount: Math.round(Number(amount) * 100),
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      payment_capture: 1,
      notes: { donorName: session.user.name, donorEmail: session.user.email },
    };
    const order = await razorpay.orders.create(options);
    await connectToDb();
    await Donation.create({
      amount: order.amount,
      orderId: order.id,
      currency: "INR",
      userId: session.user.id,
    });
    return {
      name: session.user.name,
      email: session.user.email,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID!,
    };
  } catch (error) {
    console.error(error);
    return {
      message: "failed to create order",
    };
  }
};

export const verifyPayment = async (items: any) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) {
      throw new Error("the user is not authenticated");
    }
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      donorName,
      donorEmail,
      amount,
    } = items;
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      throw new Error("missing razorpay params");
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");
    if (expectedSignature !== razorpay_signature) {
      throw new Error("not a valid signature");
    }
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });
    const payment = await razorpay.payments.fetch(razorpay_payment_id);
    if (payment.status !== "captured") {
      throw new Error("unable to capture payment");
    }
    await connectToDb();
    await Donation.findOneAndUpdate(
      { userId: session.user.id, orderId: razorpay_order_id },
      { $set: { status: "paid" } }
    );
    await sendEmail(donorEmail, amount, razorpay_order_id);
    try {
      await axios.post(
        "https://onesignal.com/api/v1/notifications",
        {
          app_id: process.env.ONESIGNAL_APP_ID!,
          include_external_user_ids: [session.user.id],
          headings: { en: "Donation Confirmed!" },
          contents: {
            en: "Thank you for your generous donation to RaktaXetu! Your payment was successful. Please check your inbox (and spam folder) for the confirmation email.",
          },
        },
        {
          headers: {
            Authorization: `Basic ${process.env.ONESIGNAL_REST_API_KEY!}`,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error(error);
    }
    return {
      ok: true,
      payment: { id: payment.id, status: payment.status },
    };
  } catch (error) {
    console.error(error);
    return {
      message: "failed to verify payment",
    };
  }
};
