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

const processFile = (token) => {

}

const downloadFiles = (token) => {

}

export default {
    authPDF_API,
    startServer,
    uploadToServer,
    processFile,
    downloadFiles
}