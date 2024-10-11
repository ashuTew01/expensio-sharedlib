// Auth Middleware
import { logError } from "@expensio/sharedlib";
import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
	const token = req.header("Authorization")?.replace("Bearer ", "");
	try {
		if (token === "guest") {
			const guestUser = {
				id: 0,
				phone: "+911234567890",
				email: "guest@test.com",
			};
			req.user = guestUser;
		} else {
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			req.user = decoded;
		}
		req.userToken = token;
		next();
	} catch (error) {
		logError(`User Authentication Failed. \n ${error}`);

		res.status(401).json({ error: "Please authenticate." });
	}
};

export default authMiddleware;
