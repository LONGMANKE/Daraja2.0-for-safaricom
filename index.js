const express = require("express");

const app = express();
require("dotenv").config();
const cors = require("cors");

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`app is running in localhost:${port}`);
  });
  
  
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());

  app.post("/stk", async (req, res) => {
    const phone = req.body.phone.substring(1); //formated to 72190........
    const amount = req.body.amount;

res.json({phone,amount})
  
    const date = new Date();
    const timestamp =
      date.getFullYear() +
      ("0" + (date.getMonth() + 1)).slice(-2) +
      ("0" + date.getDate()).slice(-2) +
      ("0" + date.getHours()).slice(-2) +
      ("0" + date.getMinutes()).slice(-2) +
      ("0" + date.getSeconds()).slice(-2);
    const shortCode = process.env.MPESA_PAYBILL;
    const passkey = process.env.MPESA_PASSKEY;
  
    const callbackurl = process.env.CALLBACK_URL;
  
    const password = new Buffer.from(shortCode + passkey + timestamp).toString(
      "base64"
    );
  
    await axios
      .post(
        "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
        {
          BusinessShortCode: shortCode,
          Password: password,
          Timestamp: timestamp,
          TransactionType: "CustomerPayBillOnline",
          Amount: amount,
          PartyA: `254${phone}`,
          PartyB: shortCode,
          PhoneNumber: `254${phone}`,
          CallBackURL: `${callbackurl}/${process.env.CALLBACK_ROUTE}`,
          AccountReference: `254${phone}`,
          TransactionDesc: "Mburu dev",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
    //   .then((resp) => {
    //     res.json(resp.data);
    //     const data = resp.data;
    //     console.log(resp.data);
    //   })
    //   .catch((err) => {
    //     res.json(err);
    //     console.log(err.message);
    //   });
  })