import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { OptionUnstyled } from "@mui/base";

type CSVFileImportProps = {
  url: string;
  title: string;
};

export default function CSVFileImport({ url, title }: CSVFileImportProps) {
  const [file, setFile] = React.useState<File>();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFile(file);
    }
  };

  const removeFile = () => {
    setFile(undefined);
  };

  const uploadFile = async () => {
    if (!file) return;

    console.log("uploadFile to", url);

    // Get the presigned URL
    const authorization_token = localStorage.getItem('authorization_token');
    let options: RequestInit = {};

    if (authorization_token) {
      options.headers = {
        Authorization: `Bearer ${authorization_token}`,
      };
    }
    const response = await fetch(`${url}?name=${encodeURIComponent(file.name)}`, options);
    
    if (response.status >= 200 && response.status < 300) {
      const data = await response?.text();
      console.log("File to upload: ", file.name);
      console.log("Uploading to: ", data);
      if (data) {
        const result = await fetch(data, {
          method: "PUT",
          body: file,
        });
        console.log("Result: ", result);
      }
    }
    
    setFile(undefined);
  };
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {!file ? (
        <input type="file" onChange={onFileChange} />
      ) : (
        <div>
          <button onClick={removeFile}>Remove file</button>
          <button onClick={uploadFile}>Upload file</button>
        </div>
      )}
    </Box>
  );
}
