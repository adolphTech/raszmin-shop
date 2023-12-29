export const createProductReview = asynchandler(async(req,res)=>{
    
    const {rating,comment} = req.body;
    const product = await Product.findById(req.params.id);
   
    
    if(product){
       const alreadyReviewed = product.reviews.find(
        (review) => review.user.toString() === req.user._id.toString()
       );

       if(alreadyReviewed){
        res.status(400);
        throw new Error("Product already reviewed");
       }

        const review ={
            name:req.user.name,
            rating:Number(rating),
            comment,
            user:req.user_id,
           };
    
           product.reviews.push(review);
    
           product.numReviews = product.reviews.length;
    
           product.rating =
           product.reviews.reduce((acc,review) => acc + review.rating,0) /
           product.reviews.length;

    
           await product.save();
           res.status(201).json({message : "Review added"})
       }

       
    else{
        res.status(404)
        throw new Error("Resource not found")
    }

})
