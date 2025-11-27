import {Elysia} from "elysia";
import { UsersController } from "../controllers/users.controller.js";

export const UsersRoute = new Elysia()
  .post("/api/add-user", UsersController.create)