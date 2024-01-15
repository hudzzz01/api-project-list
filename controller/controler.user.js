import Token from "../middleware/auth/jwt.js";
import UserService from "../service/service.user.js";
import ViewResponse from "../view/view.response.js";
import CryptoJS from "crypto-js";
import bucket from "../firebase.js";
import { customAlphabet } from "nanoid";
const nanoid = customAlphabet('12345678',8);


let gagal = 200;

class UserController{
    static async login(req,res){
        try {
            const user = await UserService.readByUsername(req.body.username);
            const ciperPassword = CryptoJS.HmacSHA256(req.body.password,"kamu kenapa sini cerita").toString();
            console.log(ciperPassword)
            console.log(user[0].password)
            if(user[0].password != ciperPassword){
                throw Error("password salah");
            }

            const token = await Token.createToken({
                id : user[0].id,
                nama: user[0].nama,
                role : user[0].role
            });
            ViewResponse.success(res,"berhasil login",token,200);
        } catch (error) {
            ViewResponse.fail(res,"gagal login",error,gagal);
        }
    }
    static async createUser(req,res){
        try {

            const file = req.file
            if (!file) {
                ViewResponse.fail (res,'No image file uploaded.', 400);
            
            }
            
            const username = await UserService.inverseOutputReadByUsername(req.body.username);

            file.originalname = nanoid()+"-puser-"+file.originalname
            const blob = bucket.bucket.file(file.originalname.replace(/ /g, "_"));
            const blobWriter = blob.createWriteStream({
                metadata: {
                    contentType: file.mimetype,
                },
            });
    
            blobWriter.on('error', (err) => {
                return res.status(500).send(err.message);
            });

            blobWriter.on('finish', async () => {
                // Get the public URL of the file
                const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.bucket.name}/o/${encodeURIComponent(blob.name)}?alt=media`;
                
                const user = req.body;
                user.img = publicUrl;
                const createUser = await UserService.createUser(user);
                ViewResponse.success(res,"berhasil membuat user baru",createUser,200)
            });
    
            blobWriter.end(file.buffer)
            
            
            // const user = req.body;
            // user.img = req.file.filename;
            // const createUser = await UserService.createUser(user);
            //ViewResponse.success(res,"berhasil membuat user baru",createUser,200)
        } catch (error) {
            ViewResponse.fail(res,"gagal membuat user baru",error,gagal);
        }
        
    }
    static async readAllUser(req,res){
        try {
            const users = await UserService.readAllUser();
            ViewResponse.success(res,"berhasil mengambil data user",users,200);
        } catch (error) {
            ViewResponse.fail(res,"Gagal mengambil data user",error,gagal);
        }
    }

    static async readUserById(req,res){
        try {
            const user = await UserService.readById(req.params.id);
            ViewResponse.success(res,"berhasil mengambil data user",user,200);
        } catch (error) {
            ViewResponse.fail(res,"Gagal mengambil data user",error,gagal);
        }
    }

    static async updateUser(req,res){
        try {

            const file = req.file;
            if (!file) {
                ViewResponse.fail (res,'No image file uploaded.', 400);
            
            }

            let data
            try {
                data = await UserService.readById(req.params.id);
            } catch (error) {
                throw new Error("id tidak ditemukan")
            }

            let cekUsername
            try {
                cekUsername = await UserService.inverseOutputReadByUsername(req.body.username)
            } catch (error) {
                throw new Error("username telah digunakan")
            }

            //hapus media di firebase
            try {
                //ambil nama file dari URL
                let namaFIle = data.img.split(".com/o/")[1]
                namaFIle = namaFIle.split("?")[0]
                
                //hapus media di firebase
                const blob = bucket.bucket.file(namaFIle);
                await blob.delete();
                console.log("berhasil hapus file dari firebase")
            } catch (error) {
                console.log("gagal hapus file dari firebase "+ error)
                throw new Error("gagal hapus file dari firebase")
            }

            file.originalname = nanoid()+"-puser-"+file.originalname
            const blob = bucket.bucket.file(file.originalname.replace(/ /g, "_"));
            const blobWriter = blob.createWriteStream({
                metadata: {
                    contentType: file.mimetype,
                },
            });
    
            blobWriter.on('error', (err) => {
                return res.status(500).send(err.message);
            });
    
            blobWriter.on('finish', async () => {
                // Get the public URL of the file
                const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.bucket.name}/o/${encodeURIComponent(blob.name)}?alt=media`;
                
                const user = req.body;
                user.img = publicUrl;
                const newUser = await UserService.updateUser(req.params.id,user);
                ViewResponse.success(res,"berhasil mengubah data Project",newUser,200);

            });
    
            blobWriter.end(file.buffer)

            // const user = req.body;
            // user.img = req.file.filename;
            // const newUser = await UserService.updateUser(req.params.id,user);
            //ViewResponse.success(res,"berhasil mengubah data user",newUser,200);
        } catch (error) {
            ViewResponse.fail(res,"Gagal mengubah data user",error,gagal);
        }
    }
    static async deleteUser(req,res){
        try {
            const deleteUser = await UserService.deleteUser(req.params.id);

            //hapus media dari database

            try {
                //ambil nama file dari URL
                let namaFIle = deleteUser.img.split(".com/o/")[1]
                namaFIle = namaFIle.split("?")[0]
                
                //hapus media di firebase
                const blob = bucket.bucket.file(namaFIle);
                await blob.delete();
                console.log("berhasil hapus file dari firebase")
            } catch (error) {
                console.log("gagal hapus file dari firebase "+ error)
                throw new Error("gagal hapus file dari firebase")
            }


            ViewResponse.success(res,"berhasil menghapus data user",deleteUser,200);
        } catch (error) {
            ViewResponse.fail(res,"gagal memnghapus data user", error,gagal);
        }
    }
}

export default UserController;