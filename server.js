import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import registerRouter from './routes/register.js';
import loginRouter from './routes/login.js';
import prodRouter from './routes/products.js';
import orderRouter from './routes/order.js';
import connectViaMongoose from './db-utils/mongoose-connection.js';
import paymentRouter from './routes/payment.js';
import MailRouter from './routes/mail.js';


const app = express();
app.use(express.json());
app.use(cors({
  origin: 'https://capstonerealestateproject.netlify.app',              // Allow requests from your frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  credentials: true, // If you are sending cookies or authorization headers
}));

const logger =(req,res,next) =>
{
  console.log(new Date().toString(), req.method, req.url);
  next();
};

app.use(logger);

await connectViaMongoose();

app.use("/register", registerRouter);
app.use("/login", loginRouter);

const tokenVerify = (req, res, next) => {
  const token = req.headers["authorization"];

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ msg: err.message });
  }
};

app.use("/products",tokenVerify,prodRouter);
app.use("/order",tokenVerify,orderRouter);
app.use("/payment",tokenVerify,paymentRouter);
app.use("/mail",tokenVerify,MailRouter);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
