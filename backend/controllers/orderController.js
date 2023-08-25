import asynchandler from "../middleware/asyncHandler.js";
import Order from "../models/orderModel.js";

// @desc Create new order
// @route POST api/orders
// @access Private

export const addOrderItems = asynchandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("No order Items");
  } else {
    const order = new Order({
      orderItems: orderItems.map((x) => ({
        ...x,
        product: x._id,
        _id: undefined,
      })),
      user:req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createOrder = await order.save();
  //  await (console.log(createOrder))

    res.status(201).json(createOrder);
  }
});

// @desc Get logged in user order
// @route GET api/orders/myOrders
// @access Private
export const getMyOrders = asynchandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.status(200).json(orders);
});

// @desc Get orders by id
// @route GET api/orders/:id
// @access Private
export const getOrderById = asynchandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (order){
    res.status(200).json(order)
  }else{
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc Update orders to  paid
// @route PUT api/orders/:id/pay
// @access Private/admin



export const updateOrderToPaid = asynchandler(async (req, res) => {
  console.log(req.body)
  const order = await Order.findById(req.params.id)

  if(order){
    order.isPaid = true;
    order.paidAt =Date.now();
    order.paymentResult={
      id:req.body.id,
      status:req.body.status,
      update_time:req.body.update_time,
      email_address:req.body.payer.email_address
    }
    const updatedOrder = await order.save()
    
    res.status(200).json(updatedOrder)
  }else{
    res.status(404 )
    throw new Error ("Order not found")
  }
});
  
// @desc Update orders to  delivered
// @route put api/orders/:id/delivered
// @access Private/admin
export const updateOrderToDelivered = asynchandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  console.log("l")

  if(order){
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    

    const updatedOrder = await order.save();
    
    res.status(200).json(updatedOrder)
  }else{
    res.status(404);
    throw new Error("order not found")
  }
});

// @desc GET All orders
// @route GET api/orders/
// @access Private/Admin
export const getAllOrders = asynchandler(async (req, res) => {
  const orders = await Order.find({}).populate("user","id name");
  res.status(200).json(orders)
});
