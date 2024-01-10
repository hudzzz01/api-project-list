import prisma from "../prisma/client/client.js";
import CryptoJS from "crypto-js";
import { customAlphabet } from "nanoid";
import deleteFile from "../middleware/deleteFile.js";

const nanoid = customAlphabet('12345678',8);


class UserService{
    static async createUser(user){
        const ciperPassword = CryptoJS.HmacSHA256(user.password,"kamu kenapa sini cerita").toString();
        //console.log(ciperPassword)
        const username = prisma.user.findMany({
            where:{
                username:user.username,
            }
        })
        if((await username).length != 0){
            deleteFile(`uploads/${user.img}`)
            throw new Error("username telah digunakan");
        }

        return await prisma.user.create({
            data : {
                id:nanoid(),
                nama:user.nama,
                username:user.username,
                role:user.role,
                password:ciperPassword,
                img:user.img
            }
        })
    }
    static async readAllUser(){
        return await prisma.user.findMany();
    }
    static async readById(id){
        const data = await prisma.user.findUnique({
            where:{
                id:id
            }
        })
        if(!data){
            throw new Error("Data tidak di temukan");
        }
        return data
    }

    static async readByUsername(username){
        
        let data = await prisma.user.findMany({
            where:{
                username:username
            }
        })

        if(data.length == 0){
            throw new Error("username tidak ditemukan");
        }
        return data
    }
    

    static async updateUser(id,user){
        //console.log(id)
        const ciperPassword = CryptoJS.HmacSHA256(user.password,"kamu kenapa sini cerita").toString();
        const dataUser = await prisma.user.findUnique({
            where :{
                id:id,
            }
        });
        if(!dataUser){
            deleteFile(`uploads/${user.img}`)
            throw new Error("id tidak ditemukan");
        }
        const username = prisma.user.findUnique({
            where:{
                username:user.username,
            }
        })
        if(username){
            deleteFile(`uploads/${user.img}`)
            throw new Error("username telah digunakan");
        }
        return await prisma.user.update({
            where:{
                id:id
            },
            data:{
                nama:user.nama,
                username:user.username,
                role:user.role,
                password:ciperPassword,
                img:user.img
            }
        })
    }
    static async deleteUser(id){
        const data = await prisma.user.findUnique({
            where:{
                id:id,
            }
        })
        if(!data){
            throw new Error('id tidak ditemukan')
        }
        deleteFile(`uploads/${data.img}`)
        return await prisma.user.delete({
            where:{
                id:id
            }
        })
    }
}

export default UserService;