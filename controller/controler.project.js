import Token from "../middleware/auth/jwt.js";
import ProjectService from "../service/service.project.js";
import ViewResponse from "../view/view.response.js";
import CryptoJS from "crypto-js";
import bucket from "../firebase.js";
import { customAlphabet } from "nanoid";
const nanoid = customAlphabet('12345678',8);

let gagal = 200;

class ProjectController{
    
    static async createProject(req,res){
        try {
            const { nama_project, deskripsi } = req.body;
            const file = req.file;
            if (!file) {
                ViewResponse.fail (res,'No image file uploaded.', 400);
            
            }

            
            file.originalname = nanoid()+"-project-"+file.originalname
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
                
                const project = req;
                project.foto = publicUrl;
                const createProject = await ProjectService.createProject(project);
                ViewResponse.success(res,"berhasil membuat Project baru",createProject,200)

            });
    
            blobWriter.end(file.buffer)

            // const project = req;
            // project.foto = req.file.filename;
            // const createProject = await ProjectService.createProject(project);
            // ViewResponse.success(res,"berhasil membuat Project baru",createProject,200)
        } catch (error) {
            ViewResponse.fail(res,"gagal membuat Project baru",error,gagal);
        }
        
    }
    static async readAllProject(req,res){
        try {
            const Projects = await ProjectService.readAllProject();
            ViewResponse.success(res,"berhasil mengambil data Project",Projects,200);
        } catch (error) {
            ViewResponse.fail(res,"Gagal mengambil data Project",error,gagal);
        }
    }

    static async readProjectById(req,res){
        try {
            const Project = await ProjectService.readById(req.params.id);
            ViewResponse.success(res,"berhasil mengambil data Project",Project,200);
        } catch (error) {
            ViewResponse.fail(res,"Gagal mengambil data Project",error,gagal);
        }
    }

    static async updateProject(req,res){
        try {
            
            
            const file = req.file;
            if (!file) {
                ViewResponse.fail (res,'No image file uploaded.', 400);
                
            }
            
            let data
            try {
                data = await ProjectService.readById(req.params.id);
            } catch (error) {
                throw new Error("id tidak ditemukan")
            }
             //hapus media di firebase
             try {
                //ambil nama file dari URL
                let namaFIle = data.foto.split(".com/o/")[1]
                namaFIle = namaFIle.split("?")[0]
                
                //hapus media di firebase
                const blob = bucket.bucket.file(namaFIle);
                await blob.delete();
                console.log("berhasil hapus file dari firebase")
            } catch (error) {
                console.log("gagal hapus file dari firebase "+ error)
                throw new Error("gagal hapus file dari firebase")
            }

            file.originalname = nanoid()+"-project-"+file.originalname
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
                
                const project = req;
                project.foto = publicUrl;
                const newProject = await ProjectService.updateProject(req.params.id,project);
                ViewResponse.success(res,"berhasil mengubah data Project",newProject,200);

            });
    
            blobWriter.end(file.buffer)

            // const project = req;
            // project.foto = req.file.filename;
            // const newProject = await ProjectService.updateProject(req.params.id,project);
            // ViewResponse.success(res,"berhasil mengubah data Project",newProject,200);
        } catch (error) {
            ViewResponse.fail(res,"Gagal mengubah data Project",error,gagal);
        }
    }
    // static async deleteProject(req,res){
    //     try {
    //         const deleteProject = await ProjectService.deleteProject(req.params.id);
    //         ViewResponse.success(res,"berhasil menghapus data Project",deleteProject,200);
    //     } catch (error) {
    //         ViewResponse.fail(res,"gagal memnghapus data Project", error,gagal);
    //     }
    // }
    static async deleteProject(req, res) {
        try {
            

            //hapus file dari database
            const deleteProject = await ProjectService.deleteProject(req.params.id);
            
            //hapus media di firebase
            try {
                //ambil nama file dari URL
                let namaFIle = deleteProject.foto.split(".com/o/")[1]
                namaFIle = namaFIle.split("?")[0]
                
                //hapus media di firebase
                const blob = bucket.bucket.file(namaFIle);
                await blob.delete();
                console.log("berhasil hapus file dari firebase")
            } catch (error) {
                console.log("gagal hapus file dari firebase "+ error)
                throw new Error("gagal hapus file dari firebase")
            }

            ViewResponse.success(res,"berhasil menghapus data Project",deleteProject,200);
        } catch (error) {
            // Send error response
            ViewResponse.fail(res, "gagal menghapus data Project", error.message, 500);
        }
    }
}

export default ProjectController;