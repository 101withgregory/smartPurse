/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require("firebase-functions");

exports.mpesaCallback = functions.https.onRequest((req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const callbackData = req.body;

  if (callbackData.Body && callbackData.Body.stkCallback) {
    const stkCallback = callbackData.Body.stkCallback;

    let transactionDetails = {
      MerchantRequestID: stkCallback.MerchantRequestID,
      CheckoutRequestID: stkCallback.CheckoutRequestID,
      ResultCode: stkCallback.ResultCode,
      ResultDesc: stkCallback.ResultDesc,
      Amount: null,
      MpesaReceiptNumber: null,
      TransactionDate: null,
      PhoneNumber: null,
    };

    if (stkCallback.CallbackMetadata) {
      stkCallback.CallbackMetadata.Item.forEach((item) => {
        if (item.Name === "Amount") transactionDetails.Amount = item.Value;
        if (item.Name === "MpesaReceiptNumber")
          transactionDetails.MpesaReceiptNumber = item.Value;
        if (item.Name === "TransactionDate")
          transactionDetails.TransactionDate = item.Value;
        if (item.Name === "PhoneNumber")
          transactionDetails.PhoneNumber = item.Value;
      });
    }

    console.log("Mpesa Callback Data:", transactionDetails);

    // TODO: Store in Firestore or Realtime Database
    return res.status(200).json({ message: "Callback received" });
  }

  return res.status(400).json({ error: "Invalid callback data" });
});
