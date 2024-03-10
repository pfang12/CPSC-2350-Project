import pdfHandler from "./pdfHandler";
export const extractText = async (file) => {
  const signed_token = await pdfHandler.authPDF_API();

  const server_data = await pdfHandler.startServer("extract", signed_token);

  const { task, server } = server_data;

  const server_file_data = await pdfHandler.uploadToServer(
    file,
    task,
    server,
    signed_token
  );

  const server_filename = server_file_data.server_filename;

  await pdfHandler.processFile(
    file.name,
    server_filename,
    task,
    server,
    "extract",
    signed_token
  );

  const extracted_text = await pdfHandler.downloadFiles(
    task,
    server,
    signed_token
  );

  return extracted_text;
};
