# Getting Started

Welcome to the MIME Sniffing Demo project! This guide will help you set up and run the project on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v14 or later)
- **npm** or **yarn**

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Praveen-webdev/web-security.git
   cd web-security
   ```

2. Install dependencies for both the server and client:
   ```bash
   npm run install
   ```

## Running the Application

1. Start both the server and client:
   ```bash
   npm run start
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

# MIME Sniffing Demo

This project demonstrates MIME type handling and content sniffing using a web-based interface. It allows users to upload files, set custom headers, and preview the results in real-time.

## Features

- **File Upload**: Upload files with custom filenames and extensions.
- **Custom Headers**: Configure `Content-Type` and `X-Content-Type-Options` headers.
- **Payload Editor**: Enter and save arbitrary payloads (HTML, JavaScript, etc.).
- **Preview**: View the uploaded content in an iframe.
- **Saved Files**: Access previously uploaded files.

## Technologies Used

- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, Express
- **File Handling**: Multer

## Project Structure

```
web-security/
├── client/       # Frontend React application
├── server/       # Backend Express server
└── uploads/      # Directory for uploaded files
```

## API Endpoints

### Server

- `POST /save-payload`: Save a payload with custom headers.
- `GET /serve/:filename`: Serve a file with custom headers.
- `GET /files-list`: List all uploaded files.

## License

This project is licensed under the MIT License.
