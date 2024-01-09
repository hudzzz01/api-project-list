import prisma from "../prisma/client/client.js";
import CryptoJS from "crypto-js";
import { customAlphabet } from "nanoid";
import deleteFile from "../middleware/deleteFile.js";

const nanoid = customAlphabet('12345678',8);


class ProjectService{
    static async createProject(project){
        const user = await prisma.user.findUnique({
            where:{
                id:project.user.data.id
            }
        })

        if(!user){
            throw new Error("anda harus login")
        }

        return await prisma.Project.create({
            data : {
                id:nanoid(),
                nama_project:project.body.nama,
                deskripsi:project.body.deskripsi,
                foto:project.foto,
                user: { connect: { id: user.id } }
            }
        })
    }
    static async readAllProject(){
        return await prisma.Project.findMany();
    }
    static async readById(id){
        const data = await prisma.Project.findUnique({
            where:{
                id:id
            }
        })
        if(!data){
            throw new Error("Data tidak di temukan");
        }
        return data
    }

    static async readByProjectname(projectname){
        
        let data = await prisma.Project.findMany({
            where:{
                projectname:projectname
            }
        })

        if(data.length == 0){
            throw new Error("Projectname tidak ditemukan");
        }
        return data
    }
    

    static async updateProject(id,project){
        console.log(id)
        const cekId = await prisma.Project.findUnique({
            where :{
                id:id,
            }
        })
        if(!cekId){
            deleteFile(`uploads/image_project/${project.foto}`)
            throw new Error("id tidak ditemukan");
        }

        const user = await prisma.user.findUnique({
            where :{
                id:project.user.data.id,
            }
        });
        if(!user){
            deleteFile(`uploads/image_project/${project.foto}`)
            throw new Error("anda harus login");
        }
        
        
        return await prisma.Project.update({
            where:{
                id:id
            },
            data:{
                nama_project:project.body.nama,
                deskripsi:project.body.deskripsi,
                foto:project.foto,
                user: { connect: { id: user.id }
            }}
        })
    }
    static async deleteProject(id){
        const data = await prisma.Project.findUnique({
            where:{
                id:id,
            }
        })
        if(!data){
            throw new Error('id tidak ditemukan')
        }
        deleteFile(`uploads/image_project/${data.foto}`)
        return await prisma.Project.delete({
            where:{
                id:id
            }
        })
    }
}

export default ProjectService;