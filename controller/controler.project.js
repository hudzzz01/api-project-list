import Token from "../middleware/auth/jwt.js";
import ProjectService from "../service/service.project.js";
import ViewResponse from "../view/view.response.js";
import CryptoJS from "crypto-js";
import bucket from "../firebase.js";

let gagal = 200;

class ProjectController{
    
    static async createProject(req,res){
        try {
            const { nama_project, deskripsi } = req.body;
            const file = req.file;
            if (!file) {
                ViewResponse.fail (res,'No image file uploaded.', 400);
            
            }

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

            const { nama_project, deskripsi } = req.body;
            const file = req.file;
            if (!file) {
                ViewResponse.fail (res,'No image file uploaded.', 400);
            
            }

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
            // Call the service layer to handle project deletion
            const deleteResult = await ProjectService.deleteProject(req.params.id);
            
            // Send success response
            ViewResponse.success(res, "berhasil menghapus data Project", deleteResult, 200);
        } catch (error) {
            // Send error response
            ViewResponse.fail(res, "gagal menghapus data Project", error.message, 500);
        }
    }
}

export default ProjectController;