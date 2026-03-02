// service will return data to controller
// how exactly backend api works 
// Request → Route → Controller → Service → Controller → Response
import redis from "../config/redis.js";
import { sendEmail } from "../utils/email.js";
import { sendSMS } from "../utils/sms.js";
import { sendWhatsApp } from "../utils/whatsapp.js";
export const authHealthService = () => {
    return {
      status: "Auth service is working",
    };
  };


export const generateOtp = () => {
  const otp = Math.floor(100000 + Math.random() * 900000); // range of math.random is 0<math.random()<1
  // maximum otp range 100000->999999
  return otp.toString(); // we are returning to string to prevent issues with leading zeros later
};

  //   console.log(generateOtp());
  
export const storeOtp = async (identifierKey) => {
  const otp = generateOtp();

  await redis.set(identifierKey, otp, "EX", 300);

  return otp;
};



export const sendOtpEmailService = async (email) => {
  const key = `otp:email:${email}`;
  const otp = await storeOtp(key);

  await sendEmail(
    email,
    "Your OTP Code",
    `Your OTP is: ${otp}\nThis OTP is valid for 5 minutes.`
  );

  return {
    success: true,
    message: "OTP sent via email",
  };
};


export const sendOtpSmsService = async (phone) => {
  const key = `otp:phone:${phone}`;
  const otp = await storeOtp(key);

  await sendSMS(
    phone,
    `Your OTP is ${otp}. It is valid for 5 minutes.`
  );

  return {
    success: true,
    message: "OTP sent via SMS",
  };
};


export const sendOtpWhatsAppService = async (phone) => {
  const key = `otp:whatsapp:${phone}`;
  const otp = await storeOtp(key);

  await sendWhatsApp(
    phone,
    `Your OTP is ${otp}. It is valid for 5 minutes.`
  );

  return {
    success: true,
    message: "OTP sent via WhatsApp",
  };
};

export const verifyOtp = async (email, userOtp) => {
  const key = `otp:email:${email}`;

  // 1. get stored OTP from Redis
  const storedOtp = await redis.get(key);

  // 2. check if OTP exists (expired or not requested)
  if (!storedOtp) {
    return {
      success: false,
      message: "OTP expired or not found",
    };
  }

  // 3. compare OTPs
  if (storedOtp !== userOtp) {
    return {
      success: false,
      message: "Invalid OTP",
    };
  }

  // 4. OTP is valid → delete it (one-time use)
  await redis.del(key);

  return {
    success: true,
    message: "OTP verified successfully",
  };
};