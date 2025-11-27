import { UserService } from "../services/user.js";
import { ApiResponse } from "../types/index.js";
import { verifyFirebaseToken } from "../utils/index.js";



export const UsersController = {
    create: async ({ body, headers }: any): Promise<ApiResponse<any>> => {
        try {
            const authHeader = headers["authorization"];
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return { success: false, message: "Missing Authorization header" };
            }

            const idToken = authHeader.replace("Bearer ", "");
            const decoded = await verifyFirebaseToken(idToken);

            if (!decoded)
                return { success: false, message: "Invalid Firebase token" };

            const { uid, email, name, photo } = body;
    
          if (!uid || !email) {
            return {
              success: false,
              message: "Missing required fields: uid or email",
            };
          }

          if (decoded.uid !== uid) {
            return {
            success: false,
            message: "UID mismatch — token does not match user",
            };
        }
    
          const existing = await UserService.getUser(uid);
    
          if (existing) {
            return {
              success: true,
              data: existing,
              message: "User already exists",
            };
          }


          const user = await UserService.addUser({
            uid,
            name,
            email,
            photo,
          });
    
          return {
            success: true,
            data: user,
            message: "User created",
          };
    
        } catch (error: any) {
          console.error("Error creating user:", error);
    
          return {
            success: false,
            message: error.message || "Failed to create user",
          };
        }
      },
};
