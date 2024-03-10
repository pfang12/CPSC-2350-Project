import axios from "axios";

const authPDF_API = async () => {
    const PDF_PUBLIC_KEY = import.meta.env.VITE_PDF_PUBLIC_KEY;

    try{
        console.log("sending pdf api auth request...")
        const response = await axios.post('https://api.ilovepdf.com/v1/auth', {
            public_key: PDF_PUBLIC_KEY
        });

        return response.data.token;
    } catch(error) {
        console.error('Error: ', error)
    }
}

const startServer = async (tool, token) => {
    try {
        console.log("starting ilovePDF server...")
        const response = await axios.get(`https://api.ilovepdf.com/v1/start/${tool}`, {headers: {
            'Authorization': `Bearer ${token}`
        }})

        return response.data
    } catch(error){
        console.error('Error: ', error);
    }
}

const uploadToServer = async (file, task, server, token) => {
    
    const formData = new FormData();
    formData.append('task', task);
    formData.append('file', file);

    try{
        console.log("uploading file to task server...")
        const response = await axios.post(`https://${server}/v1/upload`, formData, {headers: {
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'multipart/form-data'
        }})

        return response.data 
    } catch(error){
        console.error('Error: ', error);
    }
}

const processFile = async (filename, server_filename, task, server, tool, token) => {

    const requestBody = {
        task: task,
        tool: tool,
        files: [{
            server_filename: server_filename,
            filename: filename
        }]
    };
    
    try{
        console.log("processing file...")
        const response = await axios.post(`https://${server}/v1/process`, requestBody, {headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }})

        return response.data 
    }catch(error){
        console.error('Error: ', error);
    }
}

const downloadFiles = async (task, server, token) => {

    try{
        console.log("downloading...")
        const response = await axios.get(`https://${server}/v1/download/${task}`, {headers: {
            'Authorization': `Bearer ${token}`
        }})

        return response.data 
    } catch(error){
        console.error('Error: ', error)
    }
}

const deleteFileFromServer = async (task, server, server_filename, token) => {
    
    try{
        console.log("deleting file from server...")
        const response = await axios.delete(`https://${server}/v1/upload/${task}/${server_filename}`, {headers: {
            'Authorization': `Bearer ${token}`
        }})

        if(response.ok){
            console.log("File deleted from server!")
        }
    } catch(error){
        console.error('Error: ', error)
    }
}

export default {
    authPDF_API,
    startServer,
    uploadToServer,
    processFile,
    downloadFiles,
    deleteFileFromServer
}