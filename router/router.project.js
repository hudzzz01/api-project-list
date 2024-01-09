import express from "express";
import ProjectController from "../controller/controler.project.js";
import cors from "cors"
import uploadProjectImage from "../middleware/upload.project.image.js";
import auth from "../middleware/auth/auth.js";

const routerProject = express.Router();
routerProject.use(cors({
    origin: '*',
  }));
//ambil seluruh data Project (wajib Login)
routerProject.get("/",auth,async(req,res)=>{
    ProjectController.readAllProject(req,res);
})

//ambil seluruh data Project by ID (wajib Login)
routerProject.get("/:id",auth,async(req,res)=>{
    ProjectController.readProjectById(req,res);
})

routerProject.post("/",auth,uploadProjectImage.single('foto'),async(req,res)=>{
    ProjectController.createProject(req,res);
})

//edit data Project by id (wajib Login)
routerProject.put("/:id",auth,uploadProjectImage.single('foto'),async(req,res)=>{
    ProjectController.updateProject(req,res);
})

//hapus data Project (requre Login)
routerProject.delete("/:id",uploadProjectImage.none(),auth,async(req,res)=>{
    ProjectController.deleteProject(req,res);
})

export default routerProject;