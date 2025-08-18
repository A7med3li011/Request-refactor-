import { AppError } from "../../utilities/AppError.js";

export const access = (right) => {
  return (req, res, next) => {
    if (req.user.role != "user") {
      return next();
    } else {
      if (req?.user?.rights?.includes(right)) {
        return next();
      } else {
        return next(new AppError("Forbidden", 403));
      }
    }
  };
};
