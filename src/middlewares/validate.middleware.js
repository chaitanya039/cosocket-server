import { ApiResponse } from "../utils/ApiResponse.js";

const validate = (schema) => async (req, res, next) => {
    try {
        await schema.parseAsync(req.body);
        next();
    } catch (error) {
       return res.status(400).json(
            new ApiResponse(400, {}, error.errors[0].message)
       );
    }
}

export default validate;