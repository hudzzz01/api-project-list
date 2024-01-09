import express from "express";
import UserController from "../controller/controler.user.js";
import cors from "cors"
import upload from "../middleware/upload.js";
import auth from "../middleware/auth/auth.js";

const routerUser = express.Router();
routerUser.use(cors({
    origin: '*',
  }));
//ambil seluruh data user (wajib Login)
routerUser.get("/",auth,async(req,res)=>{
    UserController.readAllUser(req,res);
})

//ambil seluruh data user by ID (wajib Login)
routerUser.get("/:id",auth,async(req,res)=>{
    UserController.readUserById(req,res);
})

routerUser.post("/",upload.single('img'),async(req,res)=>{
    UserController.createUser(req,res);
})

//edit data user by id (wajib Login)
routerUser.put("/:id",auth,upload.single('img'),async(req,res)=>{
    UserController.updateUser(req,res);
})

//hapus data user (requre Login)
routerUser.delete("/:id",upload.none(),auth,async(req,res)=>{
    UserController.deleteUser(req,res);
})

export default routerUser;