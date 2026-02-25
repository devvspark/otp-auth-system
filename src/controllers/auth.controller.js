import { authHealthService } from "../services/auth.service.js";
import { verifyOtp,storeOtp } from "../services/auth.service.js";
import { generateToken } from "../utils/jwt.js";

export const authHealthCheck = (req, res) => {
      const result=authHealthService();
      return res.status(200).json(result);
  };




export const sendOtpController = async (req, res) => {
  try {
    const { email } = req.body;

    // 1️⃣ Missing email
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // 2️⃣ Invalid email format (basic check)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // 3️⃣ Generate & store OTP
    const otp = await storeOtp(email);
    console.log("OTP stored for", email, otp);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });

  } catch (error) {

    // 4️⃣ Redis-related errors
    if (error?.message?.includes("Redis")) {
      return res.status(503).json({
        success: false,
        message: "OTP service temporarily unavailable",
      });
    }

    // 5️⃣ Unexpected errors (fallback)
    console.error("Send OTP Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};



export const verifyOtpController = async (req, res) => {
try {
  const { email, otp } = req.body;

  // basic validation
  if (!email || !otp) {
    return res.status(400).json({
      success: false,
      message: "Email and OTP are required",
    });
  }
  // console.log(" user entered otp: ",otp);
  const result = await verifyOtp(email, otp);

  if (!result.success) {
    return res.status(400).json(result);
  }

  // ✅ OTP verified → generate JWT
  const token = generateToken({ email });
  
  return res.status(200).json({
    success: true,
    message: "OTP verified successfully",
    token,
  });
} catch (error) {
  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}
};



export const getMeController = (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
};
