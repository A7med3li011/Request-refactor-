import jwt from "jsonwebtoken";
import { AppError } from "../../utilities/AppError.js";

export const auth = (role = ["owner"], right = null) => {
  return (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
      return next(new AppError("Token required", 401));
    }

    jwt.verify(token, process.env.SECRETEKEY, (err, decode) => {
      if (err) return next(new AppError(err.message, 401));

      if (decode && decode?.role == "user") {
        if (
          role.includes(decode?.role) &&
          decode?.rights &&
          decode?.rights.includes(right)
        ) {
          req.user = decode;
          return next();
        } else {
          return next(new AppError("Unauthorized", 403));
        }
      } else {
        if (decode && role.includes(decode?.role)) {
          req.user = decode;
          return next();
        } else {
          return next(new AppError("Unauthorized", 403));
        }
      }
    });
  };
};
