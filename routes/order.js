import express from "express";
import { Order } from "../db-utils/models.js";
import {v4} from "uuid";
const orderRouter = express.Router();

orderRouter.post("/place-order", async (req, res) => {

  try {
    const id = v4();
    const {products} = req.body;
    const body = {
      products,
      orderId : id,
      orderTotal : products.reduce((p, val) => p + val.price, 0)
    };

    const order = new Order(body);

    await order.save();
    res.json({ msg: `OrderNo: ${id} Placed Successfully`, orderNo: id });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Something went wrong" });
  }
});

export default orderRouter;