import BaseController from "../../shared/baseController";
import httpStatus from "http-status";
import { AuthService } from "./auth.service";

class Controller extends BaseController {
    register = this.catchAsync(async (req, res, next) => {
        const payload = req.body;
        const result = await AuthService.AddUser(payload);
        this.sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "User created successfully!",
            data: result
        });
    }); 
}

export const AuthController = new Controller();
