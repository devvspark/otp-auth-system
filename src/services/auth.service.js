// service will return data to controller
// how exactly backend api works 
// Request → Route → Controller → Service → Controller → Response
import redis from "../config/redis.js";
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
  


export const storeOtp = async (email) => {
  const otp = generateOtp();
  const key = `otp:email:${email}`;
  // console.log("Generated OTP:", otp);
  // store OTP with 5 min expiry
  
  await redis.set(key, otp, "EX", 300);
  // console.log("OTP stored for", email, otp);
  return otp;
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