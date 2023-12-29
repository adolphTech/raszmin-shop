import asynchandler from "../middleware/asyncHandler.js";
import Product from "../models/productModel.js";

// @desc Fetch all products
// @route GET api/products
// @access Public

export const getProducts = asynchandler(async (req, res) => {
  const pageSize = 8;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: "i" } }
    : {};

  const count = await Product.countDocuments({ ...keyword });

  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc Fetch product by ID
// @route GET api/products/:id
// @access Public
export const getProductById = asynchandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    return res.json(product);
  } else {
    res.status(404);
    throw new Error("Resource not found");
  }
});

// @desc create product
// @route POST api/products
// @access Private /admin
export const createProduct = asynchandler(async (req, res) => {
  const product = new Product({
    name: "Sample name",
    price: 0,
    user: req.user._id,
    image: "/images/sample.jpg",
    brand: "Sample brand",
    category: "Sample category",
    countInStock: 0,
    numReviews: 0,
    description: "Sample desc",
  });
  // console.log(product)

  const createdProduct = await product.save();
  res.status(200).json(createdProduct);
});

// @desc update a product
// @route PUT api/products/:id
// @access Private /admin
export const updateProduct = asynchandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Resource not found");
  }
});

// @desc delete a product
// @route DELETE api/products/:id
// @access Private /admin
export const deleteProduct = asynchandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deletion({ _id: product._id });
    res.status(200).json({ message: "Product deleted" });
  } else {
    res.status(404);
    throw new Error("Resource not found");
  }
});

// @desc create a new product review
// @route POST api/products/:id/reviews
// @access Private /

export const createProductReview = asynchandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400).json({ message: "Product already reviewed" });
    } else {
      const newReview = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      product.reviews.push(newReview);

      // Update review-related fields
      product.numReviews = product.reviews.length;
      const totalRating = product.reviews.reduce(
        (acc, review) => acc + review.rating,
        0
      );
      product.rating = totalRating / product.numReviews;

      // Save the document
      await product.save();
      res.status(201).json({ message: "Review added", product });
    }
  } else {
    res.status(404).json({ message: "Resource not found" });
  }
});


// @desc Get top rated products
// @route GET api/products/:id
// @access Public
export const getTopProducts = asynchandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);

  res.json(products);
});
