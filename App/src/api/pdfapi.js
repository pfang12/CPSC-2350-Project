import axios from "axios";
import qs from "qs";

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

// generate presignedURI to upload files
export const generatePresignedURI = async (token) => {
    const apiURL = "https://pdf-services-ue1.adobe.io/assets";

    const data = {
        "mediaType": "application/pdf"
    }

    try{
        const response = await axios.post(apiURL, data, {
            headers: {
                "Authorization": token,
                "x-api-key": clientID,
                "Content-Type": "application/json"
            }
        });

        console.log(response);
    } catch(error){
        console.log("Error: ", error);
    }
}

// text extraction function
export const extractText = async () => {
    const token = await generateAccessToken();
    //console.log(token);
    generatePresignedURI(token);
};
