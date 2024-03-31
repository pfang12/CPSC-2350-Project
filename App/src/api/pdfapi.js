import axios from "axios";
import qs from "qs";
import jsZip from "jszip";

const clientID = import.meta.env.VITE_PDF_CLIENT_ID;
const clientSecret = import.meta.env.VITE_PDF_CLIENT_SECRET;

// Adobe PDF Services API access token generation
const generateAccessToken = async () => {
    console.log("generating access token...");

    const apiURL = "https://pdf-services-ue1.adobe.io/token";

    const data = {
        "client_id": clientID,
        "client_secret": clientSecret
    }

    try{
        const response = await axios.post(apiURL, qs.stringify(data), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });
             
        return response.data.access_token;
    }catch(error){
        console.error("Error: ", error);
    }
};

// generate presignedURI to upload files and assetID to locate files 
const generatePresignedURI = async (token, type) => {
    console.log("generating presigned URI...");

    const mediaType = type === "pdf" ? "application/pdf" : 
"application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    
    const apiURL = "https://pdf-services-ue1.adobe.io/assets";

    const data = {
        "mediaType": mediaType
    }

    try{
        const response = await axios.post(apiURL, data, {
            headers: {
                "Authorization": token,
                "x-api-key": clientID,
                "Content-Type": "application/json"
            }
        });

        return response.data;
    } catch(error){
        console.log("Error: ", error);
    }
}

// upload file to presignedURI
const uploadFile = async (file, uploadURI, type) => {
    console.log("uploading to presigned URI...");

    const contentType = type === "pdf" ? "application/pdf" : 
"application/vnd.openxmlformats-officedocument.wordprocessingml.document"    
    try{
        const response = await axios.put(uploadURI, file, {
            headers: {
                "Content-Type": contentType
            }
        });

        return response.status;
    } catch(error){
        console.log("Error: ", error);
    }
}

// extracts text and generates compressed JSON file 
const startExtractJob = async(token, assetID) => {
    console.log("Attempting text extraction...");

    const apiURL = "https://pdf-services-ue1.adobe.io/operation/extractpdf";

    const data = {
        assetID: assetID,
        elementsToExtract: ["text"],
    };

    try {
        // starts the extraction job on Adobe's servers
        const response = await axios.post(apiURL, data, {
            headers: {
                Authorization: token,
                "x-api-key": clientID,
                "Content-Type": "application/json",
            },
        });

        console.log("polling for job completion...");
        let jobStatus;
        let result;
        do {
            // checks for poll completion status
            result = await axios.get(response.headers.location, {
                headers: {
                    Authorization: token,
                    "x-api-key": clientID,
                },
            });

            jobStatus = result.data.status;
            console.log("Current job status: ", jobStatus);

            await new Promise((resolve) => setTimeout(resolve, 1000));
        } while (jobStatus !== "done" && jobStatus !== "failed");

        if (jobStatus === "done") {
            return result.data.resource.downloadUri;
        } else if (jobStatus === "failed") {
            console.log("Text extraction failed :(");
            console.log("Code: ", result.data.error.code);
            console.log("Message: ", result.data.error.message);
            return 500;
        }
    } catch (error) {
        console.log("Error: ", error);
    }
}

// decompress and return data
const downloadData = async(downloadURI) => {
    console.log("downloading...")

    try{
        const response = await axios.get(downloadURI, {
            responseType: "arraybuffer"
        });

        const zip = await jsZip.loadAsync(response.data);

        const fileName = Object.keys(zip.files)[0];
        const file = zip.files[fileName];

        const fileContent = await file.async("text");

        const jsonData = JSON.parse(fileContent);

        const elements = jsonData.elements;

        let extractedText = "";

        elements.forEach(element => {
            extractedText += element.Text;
        })

        return extractedText;

    }catch(error){
        console.log("Error: ", error);
    }
}

// text extraction function
export const extractText = async (file) => {
    const token = await generateAccessToken();

    const {uploadUri, assetID} = await generatePresignedURI(token, "pdf");

    const uploadSuccessful = await uploadFile(file, uploadUri, "pdf");

    if(uploadSuccessful === 200){
        const downloadUri = await startExtractJob(token, assetID);

        const text = await downloadData(downloadUri);
        return text;
        
    } else {
        console.log("Something went wrong uploading the file.");
    }
};

const quizDataBuilder = (quiz) => {
    
    const convertOptionsToObject = (options) =>{
        const optionsObject = {}

        options.forEach((option, index) => {
            optionsObject[String.fromCharCode(97 + index)] = option;
        });

        return optionsObject;
    }
    
    const quizData = {
        "questions": quiz.map(question => ({
            ...question,
            "options": convertOptionsToObject(question.options)
        }))
    }

    return quizData; 
}

// retrieve docx template from public folder
const retrieveDocxTemplate = async (template) => {
    console.log("Retrieving doc template...")
    try {
        const file = await fetch(template);

        const arrayBuffer = await file.arrayBuffer();
        
        const docxTemplate = new Blob([new Uint8Array(arrayBuffer)], {type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"})
                
        return docxTemplate;
    } catch(error){
        console.log("Error: ", error);
    }
}

// extracts text and generates compressed JSON file 
const startDocGeneration = async(token, assetID, jsonData) => {
    console.log("Merging data with quiz template...");

    const apiURL = "https://pdf-services-ue1.adobe.io/operation/documentgeneration";

    const data = {
        assetID: assetID,
        outputFormat: "pdf",
        jsonDataForMerge: jsonData
    };

    try {
        // starts the extraction job on Adobe's servers
        const response = await axios.post(apiURL, data, {
            headers: {
                Authorization: token,
                "x-api-key": clientID,
                "Content-Type": "application/json",
            },
        });

        console.log("polling for job completion...");
        let jobStatus;
        let result;
        do {
            // checks for poll completion status
            result = await axios.get(response.headers.location, {
                headers: {
                    Authorization: token,
                    "x-api-key": clientID,
                },
            });

            jobStatus = result.data.status;
            console.log("Current job status: ", jobStatus);

            await new Promise((resolve) => setTimeout(resolve, 1000));
        } while (jobStatus !== "done" && jobStatus !== "failed");

        if (jobStatus === "done") {
            return result.data.asset.downloadUri;
        } else if (jobStatus === "failed") {
            console.log("Document generation failed :(");
            console.log("Code: ", result.data.error.code);
            console.log("Message: ", result.data.error.message);
        }
    } catch (error) {
        console.log("Error: ", error);
    }
}

const downloadPDF = async (downloadURI) => {
    try{
        const response = await axios.get(downloadURI, {
            responseType: "blob"
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "quiz.pdf");

        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
    } catch(error){
        console.log("Error: ", error);
    }
}

const encryptPDF = async (token, downloadURI, pwd) => {

    const apiURL = "https://pdf-services-ue1.adobe.io/operation/protectpdf"
    
    try{
        const response = await axios.get(downloadURI, {
            responseType: "blob"
        });

        const pdfFile = new Blob([response.data]);

        const {uploadUri, assetID} = await generatePresignedURI(token, "pdf");

        const uploadSuccessful = await uploadFile(pdfFile, uploadUri, "pdf");

        if(uploadSuccessful === 200){
            const data = {
                assetID: assetID,
                passwordProtection: {
                    userPassword: pwd
                },
                encryptionAlgorithm: "AES_256"
            }

            const response = await axios.post(apiURL, data, {
                headers: {
                    Authorization: token,
                    "x-api-key": clientID,
                    "Content-Type": "application/json"
                }
            });

            console.log("polling for job completion...");
            let jobStatus;
            let result;
            do {
                result = await axios.get(response.headers.location, {
                    headers: {
                        Authorization: token,
                        "x-api-key": clientID
                    }
                });

                jobStatus = result.data.status;
                console.log("Current job status: ", jobStatus);

                await new Promise((resolve) => setTimeout(resolve, 1000));
            } while (jobStatus != "done" && jobStatus !== "failed");

            if(jobStatus === "done") {
                return result.data.asset.downloadUri;
            } else if(jobStatus === "failed") {
                console.log("Document encryption failed :(");
                console.log("Code: ", result.data.error.code);
                console.log("Message: ", result.data.error.message);
            }
        }
        
    } catch(error){
        console.log("Error: ", error);
    }
}

// quiz download function
export const downloadQuiz = async (quiz, template, pwd = null, report = false) => {

    let data;
    if(!report){
        data = quizDataBuilder(quiz); 
    } else {
        data = quiz; 
    }
    
    const templateDoc = await retrieveDocxTemplate(template);
    
    const token = await generateAccessToken();

    const {uploadUri, assetID} = await generatePresignedURI(token, "docx");

    const uploadSuccessful = await uploadFile(templateDoc, uploadUri, "docx");

    if(uploadSuccessful === 200){
        const downloadUri = await startDocGeneration(token, assetID, data);

        if(pwd){
            console.log("Encrypting file...");
            const encryptedPDFUri = await encryptPDF(token, downloadUri, pwd);
            await downloadPDF(encryptedPDFUri);            
        } else {
            await downloadPDF(downloadUri);
        }
    }

    return "done";
}
