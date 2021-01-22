const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const BlockedEmail = require("../models/BlockedEmail");

// Require sgMail package
// For demo purposes only, no api key will make this package inert
const sgMail = require("@sendgrid/mail");
// no api key, will throw error if initiated
sgMail.setApiKey("<apikey>");

// Requre AWS SDK package
// For demo purposes only, no access keys will make this package inert
const AWS = require("aws-sdk");
// no id keys, will throw error if initiated
const SES_CONFIG = {
  accessKeyId: "<SES IAM user access key>",
  secretAccessKey: "<SES IAM user secret access key>",
  region: "us-west-2",
};

const AWS_SES = new AWS.SES(SES_CONFIG);

// Demo AWS SES send email method
let sendUsingSES = (from, to, subject, email_body, email_html) => {
  let params = {
    Source: from,
    Destination: {
      ToAddresses: [to],
    },
    ReplyToAddresses: [],
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: email_html,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
  };
  return AWS_SES.sendEmail(params).promise();
};

// POST Route
// Takes in parameters: from, to, subject, body_text, body_html
// Demo Route, will validate parameter input
// Will check if 'to' email is on bounched email list on database
router.post(
  "/send-email",
  [
    check("from", "Please include a valid email").isEmail(),
    check("to", "Please include a valid email").isEmail(),
    check("subject", "Subject is required").not().isEmpty(),
    check("body_text", "Body Text is required").not().isEmpty(),
    check("body_html", "Subject is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(401).json({ success: false, error: errors.array() });
    const { from, to, subject, body_text, body_html } = req.body;
    try {
      // Check if to email is on bounced email list on database
      let foundEmail = await BlockedEmail.findOne({ email_address: to });
      if (foundEmail)
        return res
          .status(401)
          .json({ success: false, error: "Email is on bounced email list" });
      // Demo for sending email with SendGrid email service
      const message = {
        to,
        from,
        subject,
        text: body_text,
        html: body_html,
      };

      // Following will send email via SendGrid email service:
      // sgMail.send(msg);

      // Following will send email via AWS SES service
      // sendUsingSES(from, to, subject, email_body, email_html)

      // Return success message assuming email service method was fired
      return res.status(200).json({ success: true, message });
    } catch (error) {
      return res.status(500).json({
        error: "Problem saving blocked email",
        message: error.message,
      });
    }
  }
);

// POST Route
// Takes in parameter email_address
// Will validate email and check if provided email is on bounced list
// Returns JSON message if email is already on bounched list
// Saves and returns JSON message with saved database object when email is saved
router.post(
  "/bounced-email",
  [check("email_address", "Please include a valid email").isEmail()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(401).json({ success: false, error: errors.array() });
    const { email_address } = req.body;
    try {
      // Check if posted bounced email has already been logged
      let foundEmail = await BlockedEmail.findOne({ email_address });
      if (foundEmail)
        return res
          .status(401)
          .json({ success: false, error: "Bounced email already logged" });
      // Save new bounced email to block
      let newBlockedEmail = new BlockedEmail({ email_address });
      let savedBlockedEmail = await newBlockedEmail.save();
      res.json({ success: true, savedBlockedEmail });
    } catch (error) {
      return res.status(500).json({
        error: "Problem saving blocked email",
        message: error.message,
      });
    }
  }
);

module.exports = router;
