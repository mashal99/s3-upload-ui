import React, { useState } from 'react';
import AWS from 'aws-sdk';
import './App.css';

function App() {
  const [inputText, setInputText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  // AWS Configuration
  const S3_BUCKET = 'your-s3-bucket-name';
  const REGION = 'your-region';
  const ACCESS_KEY = 'your-access-key';
  const SECRET_ACCESS_KEY = 'your-secret-access-key';

  AWS.config.update({
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_ACCESS_KEY,
    region: REGION,
  });

  const s3 = new AWS.S3();

  const handleTextChange = (event) => {
    setInputText(event.target.value);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      alert('Please select a file to upload');
      return;
    }

    const fileParams = {
      Bucket: S3_BUCKET,
      Key: selectedFile.name,
      Body: selectedFile,
    };

    const textParams = {
      Bucket: S3_BUCKET,
      Key: `${selectedFile.name}.txt`,
      Body: inputText,
    };

    try {
      await s3.upload(fileParams).promise();
      await s3.upload(textParams).promise();
      alert('File and text uploaded successfully!');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <form onSubmit={handleSubmit}>
          <div>
            <label>Text input:</label>
            <input
              type="text"
              value={inputText}
              onChange={handleTextChange}
              required
            />
          </div>
          <div>
            <label>File input:</label>
            <input type="file" onChange={handleFileChange} required />
          </div>
          <button type="submit">Submit</button>
        </form>
      </header>
    </div>
  );
}

export default App;
