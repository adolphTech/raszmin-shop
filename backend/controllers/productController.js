import asynchandler from "../middleware/asyncHandler.js";
import Product from "../models/productModel.js"

// @desc Fetch all products
// @route GET api/products
// @access Public

export const getProducts = asynchandler(async(req,res)=>{
    const products = await Product.find({});
   
    res.json(products)

})

// @desc Fetch product by ID
// @route GET api/products/:id
// @access Public
export const getProductById = asynchandler(async(req,res)=>{
    const product = await Product.findById(req.params.id)

    if(product){
     return res.json(product)
 
    }else{
     res.status(404)
     throw new Error ("Resource not found")
    }

})

// @desc create product 
// @route POST api/products
// @access Private /admin
export const createProduct= asynchandler(async(req,res)=>{
    const product = new Product({
        name:"Sample name",
        price:0,
        user:req.user._id,
        image:"/images/sample.jpg",
        brand :"Sample brand",
        category:"Sample category",
        countInStock:0,
        numReviews:0,
        description:"Sample desc"
    })
    console.log(product)

    const createdProduct  = await product.save();
    res.status(200).json(createdProduct)

})


// @desc update a product 
// @route PUT api/products/:id
// @access Private /admin
export const updateProduct= asynchandler(async(req,res)=>{
    const{name,price,description,image,brand,category,countInStock}=req.body
    
    const product = await Product.findById(req.params.id);

    if(product){
        product.name=name;
        product.price=price;
        product.description=description;
        product.image= image;
        product.brand=brand;
        product.category=category;
        product.countInStock=countInStock;

        const updatedProduct = await product.save()
        res.json(updatedProduct)
    }else{
        res.status(404)
        throw new Error("Resource not found")
    }

})

// export default {getProductById,getProducts};