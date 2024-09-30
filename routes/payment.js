import express from "express";
import stripFunc from "stripe";

const paymentRouter = express.Router();

const stripe = stripFunc('sk_test_51Q4Hx6G6vFpQQ4as3T5RTuTcii852963xAKJqXEY3PqVCiQ4SOT1OA1hL0bKeB5ymLqOFD87DzN39lybpcPRek8J002gUfBO0z');

paymentRouter.post("/get-payment-session", async (req, res) => {
  const { products = [] } = req.body;

  const lineItems = products.map((pd) => ({
    price_data: {
      currency: "USD",
      product_data: {
        name: pd.name,
        images: pd.images,
      },
      unit_amount: pd.price * 100, 
    },
    quantity: pd.qty || 1,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: `${process.env.FE_URL}/orderSuccess`,
    cancel_url: `${process.env.FE_URL}/cart?payment=cancelled`,
  });

  res.json({ id: session.id });
});

export default paymentRouter;
