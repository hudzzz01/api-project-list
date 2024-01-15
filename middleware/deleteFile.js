import { unlink } from 'fs/promises';
import path from 'path';
import bucket from "../firebase.js";

async function deleteFile(filePath) {
  try {
    // Create a reference to the file in Firebase Storage
    const blob = bucket.file(filePath);
    // Delete the file
    await blob.delete();
    
    console.log('File deleted successfully from Firebase Storage.');
  } catch (error) {
    console.error('Error deleting file from Firebase Storage:', error);
  }
}

export default deleteFile;