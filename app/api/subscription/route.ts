import { NextResponse } from "next/server";
import connect from "@/lib/db";
import Product from "@/lib/models/product";
import { Types } from "mongoose";
import User from "@/lib/models/user";
import Subscription from "@/lib/models/subscription";
import { sendEmail } from "@/utils/mail";

// get all subscription for a user
export const GET = async (request: Request) => {
  try {
    // extract the user id from the search params
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    // check if the userId exist and is valid
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing userId!" }),
        { status: 400 }
      );
    }

    // establish the database connection
    await connect();

    // check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "User does not exist!" }),
        { status: 400 }
      );
    }

    // fetch all the subscriptions where storeId is equal to params store id
    const subscriptions = await Subscription.find({
      user: new Types.ObjectId(userId),
    }).populate({
      path: "product",
      select: ["_id", "name", "description", "price", "type"],
    });

    return new NextResponse(
      JSON.stringify({
        message: "Subscription fetched successfully!",
        data: subscriptions,
      }),
      { status: 200 }
    );
  } catch (err) {
    return new NextResponse("Error in fetching subscriptions " + err, {
      status: 500,
    });
  }
};

export const POST = async (request: Request) => {
  try {
    // extract the values from the request object
    const {
      userId,
      products,
    }: {
      userId: string;
      products: Array<{
        productId: string;
        quantity: number;
        type: string;
        amount: number;
      }>;
    } = await request.json();

    let subtotal = 0;
    let hst = 0;
    let total = 0;

    let productSubscribed: any = [];

    // establish the connection with database
    await connect();

    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "User does not exist!" }),
        { status: 400 }
      );
    }

    // Map through products and perform async operations
    const results = await Promise.all(
      products?.map(async (product: any) => {
        // check if the productId exists and is valid
        if (
          !product?.productId ||
          !Types.ObjectId.isValid(product?.productId)
        ) {
          return new NextResponse(
            JSON.stringify({ message: "Invalid or missing productId!" }),
            { status: 400 }
          );
        }
        // find the product with the given id;
        const selectedProduct = await Product.findById(product?.productId);
        productSubscribed.push({
          selectedProduct,
          quantity: product?.quantity,
        });
        subtotal += Math.round(selectedProduct?.price * product?.quantity);

        // create the new subscription object
        const newSubscription = new Subscription({
          user: new Types.ObjectId(userId),
          product: new Types.ObjectId(product?.productId),
          quantity: product?.quantity,
          type: product?.type,
          amount: Math.round(selectedProduct?.price * product?.quantity),
        });

        // save the info in the database
        const createSubscription = await newSubscription.save();
        if (!createSubscription) {
          return false;
        }
        return true;
      })
    );

    hst = subtotal * 0.13;
    total = subtotal + hst;

    const sender = {
      name: "Gym Rentals",
      address: "noreply@gymrentals.com",
    };
    const recipient = [
      {
        name: `${user.firstName} ${user.lastName}`,
        address: user.email,
      },
    ];

    const emailHtml = `
    <div>
      <h1>
        Welcome, ${user.firstName} ${user.lastName}!
      </h1>
      <p>
        Thank you for subscribing to ${products.length} 
        ${products.length > 1 ? "products" : "product"}.
      </p>
      <h2>Transaction Summary</h2>
      <hr />
      <div style="width: 250px">
        <p>Sub Total: ${subtotal.toFixed(2)}</p>
        <p>HST (13%): ${hst.toFixed(2)}</p>
        <hr />
        <p>Total Amount: ${total.toFixed(2)}</p>
      </div>
      <hr />
      <h2>Products Subscribed</h2>
      <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse;">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Description</th>
            <th>Quantity</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          ${productSubscribed
            .map(
              (product: any) => `
            <tr key="${product.selectedProduct._id}">
              <td>${product.selectedProduct.name}</td>
              <td>${product.selectedProduct?.description}</td>
              <td>${product.quantity}</td>
              <td>$${product.selectedProduct.price}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;

    const emailResults = await sendEmail({
      sender,
      recipient,
      subject: "Subscription Confirmation",
      html: emailHtml,
    });

    if (!emailResults.accepted) {
      return new NextResponse(
        JSON.stringify({
          message:
            "Error in sending email, we will send you the email in sometime!",
        }),
        {
          status: 500,
        }
      );
    }

    const allCheckPassed = results.every(Boolean);

    if (allCheckPassed) {
      // send the confirmation to frontend
      return new NextResponse(
        JSON.stringify({
          message: "Subscription created successfully!",
        }),
        {
          status: 201,
        }
      );
    }

    // send the confirmation to frontend
    return new NextResponse(
      JSON.stringify({
        message: "Error in creating some subscription!",
      }),
      {
        status: 500,
      }
    );
  } catch (err) {
    return new NextResponse("Error in creating subscription " + err, {
      status: 500,
    });
  }
};
