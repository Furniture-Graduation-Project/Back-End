import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import Product from "../models/product";

export const create = async (req, res) => {
  try {
    const productData = {
      name: req.body.name,
      productId: new mongoose.Types.ObjectId(),
      categoryID: req.body.categoryID,
      images: req.body.images || [],
      price: req.body.price,
      quantity: req.body.quantity || 0,
      title: req.body.title || "",
      description: req.body.description || "",
      brand: req.body.brand || "",
      colors: req.body.colors || [],
      sizes: req.body.sizes || [],
      discount: req.body.discount || 0,
    };

    const product = await Product.create(productData);
    return res.status(StatusCodes.CREATED).json(product);
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("categoryID", "name");
    if (products.length === 0) {
      return res.status(StatusCodes.OK).json({ data: [] });
    }
    return res.status(StatusCodes.OK).json({ data: products });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "categoryID",
      "name"
    );
    if (!product) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Không tìm thấy sản phẩm nào!" });
    }
    return res.status(StatusCodes.OK).json(product);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  }
};

export const deleteProductById = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    return res.status(StatusCodes.OK).json(product);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  }
};

export const updateProductById = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(StatusCodes.OK).json(product);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  }
};

export const related = async (req, res) => {
  try {
    const products = await Product.find({
      categoryID: req.params.categoryID,
      _id: { $ne: req.params.productId },
    }).populate("categoryID", "name");
    return res.status(StatusCodes.OK).json(products);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const { categoryID } = req.params;
    const products = await Product.find({ categoryID }).populate(
      "categoryID",
      "name"
    );

    if (products.length === 0) {
      return res.status(StatusCodes.OK).json({ data: [] });
    }
    return res.status(StatusCodes.OK).json({ data: products });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};
