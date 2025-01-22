const jwt = require("jsonwebtoken");

// Middleware untuk autentikasi pengguna
exports.authenticate = (req, res, next) => {
  console.log("=== Authentication Middleware Debug ===");
  console.log("All Headers:", req.headers);
  console.log("Auth Header:", req.headers.authorization);

  const authHeader = req.headers.authorization;

  // Pastikan header Authorization tersedia
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // console.log("Authentication Failed: No auth header or invalid format");
    console.log("Auth Header Value:", authHeader);
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  // Ambil token dari header Authorization
  const token = authHeader.split(" ")[1];
  console.log("Extracted Token:", token.substring(0, 20) + "..."); // Hanya tampilkan sebagian token untuk keamanan

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("JWT Verification Error:", err.name);
      console.log("Error Details:", err.message);

      const errorMessage =
        err.name === "TokenExpiredError"
          ? "Token has expired."
          : "Invalid token.";
      return res.status(403).json({ message: errorMessage });
    }

    console.log("JWT Verification Success");
    console.log("Decoded User:", {
      id: decoded.id,
      role: decoded.role,
      // tambahkan field lain yang perlu di-debug
    });

    req.user = decoded; // Simpan data user yang telah terverifikasi ke `req.user`
    next();
  });
};

// Middleware untuk otorisasi pengguna berdasarkan role
exports.authorize = (requiredRole) => (req, res, next) => {
  console.log("=== Authorization Middleware Debug ===");
  console.log("User Data:", req.user);
  console.log("Required Role:", requiredRole);

  if (!req.user || !req.user.role) {
    console.log("Authorization Failed: No user data or role");
    return res.status(403).json({
      message: "Access forbidden. No role found in user data.",
    });
  }

  if (req.user.role !== requiredRole) {
    console.log("Authorization Failed: Invalid role");
    console.log("User Role:", req.user.role);
    console.log("Required Role:", requiredRole);
    return res.status(403).json({
      message: "Access forbidden. You do not have the required permissions.",
    });
  }

  console.log("Authorization Success");
  next();
};
