const express = require("express");

const app = express();
require("dotenv").config();
const cors = require("cors");
const axios = require("axios");

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`app is running in localhost:${port}`);
  });
  
  
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());


  app.get("/token",( req,res, next)=>{
    getAccessToken();
  })
  //STEP 1 getting access token

const getAccessToken = async (req, res) => {
    // const key = process.env.MPESA_CONSUMER_KEY;
    // const secret = process.env.MPESA_CONSUMER_SECRET;
    const auth = new Buffer.from("9GKUQe7IBOsxF7f3s3mlInLxevsyWABi:yhMarAPMnb5D6LOS").toString("base64");
  
    await axios
      .get(
        "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
        {
          headers: {
            authorization: `Basic ${auth}`,
          },
        }
      )
      .then((token) => {
        //   res.status(200).json(res.data);
        // token = res.data.access_token;
        console.log(token);
        // next();
      })
      .catch((err) => {
        console.log(err);
        // res.status(400).json(err.message)
      });
  };
  
//stk
  app.post("/stk", getAccessToken, async (req, res) => {
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
      .then((resp) => {
        // res.json(resp.data);
        // const data = resp.data;
        // console.log(resp.data);
        console.log(data);
        res.status(200).json(data);
      })
      .catch((err) => {
        // res.json(err);
        console.log(err.message);
        res.status(400).json(err.message);

      });
  })