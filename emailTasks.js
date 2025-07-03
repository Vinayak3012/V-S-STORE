require("dotenv").config();

const nodeMailer = require("nodemailer");
const ejs = require("ejs");

const transporter = nodeMailer.createTransport({
  service: "gmail",
  auth: {
    user: "t1868123@gmail.com",
    pass: process.env.PASS,
  },
});

async function sendPlaceOrderEmail({ fullName, email, order }) {
  console.log(`Sending email to ${email}`);
  // Here you'd integrate with nodemailer or send grid
  const formattedDate = new Date(order.Time).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "long",
    timeStyle: "short",
  });

  const emailContent = await ejs.renderFile(__dirname + "/views/email.ejs", {
    fullName: fullName,
    email: email,
    orderId: order.order_id,
    orderDate: formattedDate,
  });
  // console.log(emailContent);

  const mailOptions = {
    from: "t1868123@gmail.com",
    to: email,
    subject: "Order Placed Successfully",
    html: emailContent,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log(info.response);
    }
  });
}

async function sendConfirmationEmail({ fullName, email, order }) {
  console.log(`Sending email to ${email}`);
  // Here you'd integrate with nodemailer or send grid

  const formattedDate = new Date(order.Time).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "long",
    timeStyle: "short",
  });

  const emailContent = await ejs.renderFile(
    __dirname + "/views/email_confirm.ejs",
    {
      fullName: fullName,
      email: email,
      orderId: order.order_id,
      orderDate: formattedDate,
    }
  );
  // console.log(emailContent);

  const mailOptions = {
    from: "t1868123@gmail.com",
    to: email,
    subject: "Your Order Is Accepted",
    html: emailContent,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log(info.response);
    }
  });
}

async function sendRejectionEmail({ fullName, email, order }) {
  console.log(`Sending email to ${email}`);
  // Here you'd integrate with nodemailer or send grid
  const formattedDate = new Date(order.Time).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "long",
    timeStyle: "short",
  });

  const emailContent = await ejs.renderFile(
    __dirname + "/views/email_reject.ejs",
    {
      fullName: fullName,
      email: email,
      orderId: order.order_id,
      orderDate: formattedDate,
    }
  );
  // console.log(emailContent);

  const mailOptions = {
    from: "t1868123@gmail.com",
    to: email,
    subject: "Your Order Is Rejected",
    html: emailContent,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log(info.response);
    }
  });
}

async function sendDeliveredEmail({ fullName, email, order, address }) {
  console.log(`Sending email to ${email}`);
  // Here you'd integrate with nodemailer or send grid
  const formattedDate = new Date(order.delivery_time).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "long",
    timeStyle: "short",
  });

  const emailContent = await ejs.renderFile(
    __dirname + "/views/email_delivered.ejs",
    {
      fullName: fullName,
      email: email,
      orderId: order.order_id,
      deliveryDate: formattedDate,
      deliveryAddress: address,
    }
  );
  // console.log(emailContent);

  const mailOptions = {
    from: "t1868123@gmail.com",
    to: email,
    subject: "Your Order Has Been Delivered!",
    html: emailContent,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log(info.response);
    }
  });
}

async function sendLatestUpdateEmail({ email }) {
  console.log(`Sending email to ${email}`);

  const emailContent = await ejs.renderFile(
    __dirname + "/views/latest_email.ejs",
    {
      email: email,
    }
  );
  // console.log(emailContent);

  const mailOptions = {
    from: "t1868123@gmail.com",
    to: email,
    subject: "Get Latest Updates Of V&S",
    html: emailContent,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log(info.response);
    }
  });
}

module.exports = {
  sendPlaceOrderEmail,
  sendConfirmationEmail,
  sendRejectionEmail,
  sendDeliveredEmail,
  sendLatestUpdateEmail,
};
