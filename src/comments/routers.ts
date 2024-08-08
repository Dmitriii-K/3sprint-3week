import { Router } from "express";
import { CommentsController } from "./commentsController";
import { checkUser, commentsValidation, inputCheckErrorsMiddleware, likeStatusValidation } from "../middlewares/middlewareForAll";
import { bearerAuth } from "../middlewares/middlewareForAll";

export const commentsRouters = Router();

commentsRouters.get("/:id", checkUser, CommentsController.getComment);
commentsRouters.put("/:id", bearerAuth, commentsValidation, inputCheckErrorsMiddleware, CommentsController.updateComment);
commentsRouters.put("/:id/like-status", bearerAuth, checkUser, likeStatusValidation, inputCheckErrorsMiddleware, CommentsController.likeStatus);
commentsRouters.delete("/:id", bearerAuth, CommentsController.deleteComment);