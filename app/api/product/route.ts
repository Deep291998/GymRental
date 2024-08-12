import { NextResponse } from "next/server";
import connect from "@/lib/db";
import Product from "@/lib/models/product";
import { Types } from "mongoose";

export const GET = async (request: Request) => {
  try {
    // establish the connection with database
    await connect();

    // extract all the available products
    const products = await Product.find({});

    // send them to the frontend
    return new NextResponse(
      JSON.stringify({
        message: "Products fetched successfully!",
        data: products,
      }),
      { status: 200 }
    );
  } catch (err) {
    return new NextResponse("Error in fetching products " + err, {
      status: 500,
    });
  }
};

export const POST = async (request: Request) => {
  try {
    // extract the values frem the request object
    const { name, description, price, type } = await request.json();

    // establish the connection with database
    await connect();

    // create the new product object
    const newProduct = new Product({
      name,
      description,
      price,
      type,
    });

    // save the info in the dabatabse
    await newProduct.save();

    // send the confirmation to frontend
    return new NextResponse(
      JSON.stringify({
        message: "Product created successfully!",
        data: newProduct,
      }),
      {
        status: 201,
      }
    );
  } catch (err) {
    return new NextResponse("Error in creating product " + err, {
      status: 500,
    });
  }
};

export const PUT = async (request: Request) => {
  try {
    // extract the fields from the request object
    const { productId, productName, description, type, price } =
      await request.json();

    // establish the connection with database
    await connect();

    // check if the productId is valid
    if (!productId || !Types.ObjectId.isValid(productId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing productId!" }),
        { status: 400 }
      );
    }

    // check if the product exists in the database
    const product = await Product.findById(productId);
    if (!product) {
      return new NextResponse(
        JSON.stringify({ message: "Product does not exist!" }),
        { status: 400 }
      );
    }

    // update the product
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: product._id },
      {
        productName,
        description,
        type,
        price,
      },
      {
        new: true,
      }
    );

    // check if the process successed
    if (!updatedProduct) {
      return new NextResponse(
        JSON.stringify({ message: "Product not updated!" }),
        { status: 400 }
      );
    }

    return new NextResponse(
      JSON.stringify({
        message: "Product updated successfully!",
        data: updatedProduct,
      }),
      {
        status: 200,
      }
    );
  } catch (err) {
    return new NextResponse("Error in updating product " + err, {
      status: 500,
    });
  }
};

export const DELETE = async (request: Request) => {
  try {
    // extract the fields from the request object
    const { productId } = await request.json();

    // establish the connection with database
    await connect();

    // check if the productId is valid
    if (!productId || !Types.ObjectId.isValid(productId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing productId!" }),
        { status: 400 }
      );
    }

    // check if the product exists in the database
    const product = await Product.findById(productId);
    if (!product) {
      return new NextResponse(
        JSON.stringify({ message: "Product does not exist!" }),
        { status: 400 }
      );
    }

    const deleteProduct = await Product.findByIdAndDelete({
      _id: product._id,
    });

    // check if the process successed
    if (!deleteProduct) {
      return new NextResponse(
        JSON.stringify({ message: "Product not deleted!" }),
        { status: 400 }
      );
    }

    return new NextResponse(
      JSON.stringify({
        message: `${product.productName} has been deleted successfully!`,
      }),
      {
        status: 200,
      }
    );
  } catch (err) {
    return new NextResponse("Error in deleting product " + err, {
      status: 500,
    });
  }
};
