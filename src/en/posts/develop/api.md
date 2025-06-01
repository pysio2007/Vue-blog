---
title: Complete Blog API Documentation
date: 2025-01-01
icon: fa-solid fa-webhook
category: develop
tag:
  - Services
  - API
---

## General Information

> [!NOTE]
> All APIs have been deployed to production environment, please use the following base URL for access.

### Base URL
```
https://blogapi.pysio.online
```

### API Collection

You can also download the JSON file directly: [Download API Collection](https://www.pysio.online/json/blog-api-collection.json) and import it into Postman for use

> [!IMPORTANT]
> When making API calls, please note the following:
> - All requests must use HTTPS protocol
> - APIs may have rate limiting
> - Please keep your authentication tokens secure
> - Image storage uses Minio object storage with CDN acceleration

### Common Response Format
All JSON responses follow this format:
```json
{
  "status": "success/error",
  "data/error": "response data/error message"
}
```

> [!TIP]
> For API debugging, we recommend using the following tools:
> - [Postman](https://www.postman.com/)
> - [Insomnia](https://insomnia.rest/)
> - [curl](https://curl.se/)

### Authentication Header Format
```
Authorization: Bearer {TOKEN}
```

> [!WARNING]
> Do not store admin tokens directly in client-side code.
> Ensure secure token storage methods in production environments.

## System Status Endpoints

> [!NOTE]
> System status endpoints can be used to monitor service health.

### 1. System Status Check
- **Request Path**: `/`
- **Request Method**: GET
- **Response Format**: text/plain
- **Response Example**: `What are you doing here? Meow?`
- **Debug Example**:
  ```bash
  curl https://blogapi.pysio.online/
  ```

> [!TIP]
> Recommended to use this endpoint for basic connectivity testing.

### 2. FastFetch System Information
- **Request Path**: `/fastfetch`
- **Request Method**: GET
- **Response Format**: application/json
- **Response Example**:
  ```json
  {
    "status": "success",
    "output": "System information in HTML format"
  }
  ```
- **Debug Example**:
  ```bash
  curl https://blogapi.pysio.online/fastfetch
  ```

### 3. Heartbeat Detection
- **Request Path**: `/heartbeat`
- **Request Method**: POST
- **Request Headers**:
  ```
  Authorization: Bearer {TOKEN}
  ```
- **Request Parameters**:
  - `application`: Application name
  - `introduce`: Application description
  - `rgba`: Color value
  - `applicationOnline`: Application status
- **Response Format**: application/json
- **Response Example**:
  ```json
  {
    "message": "Heartbeat received",
    "application": "MyApp",
    "introduce": "My Application Description",
    "rgba": "233,30,99,0.17",
    "applicationOnline": true
  }
  ```
- **Debug Example**:
  ```bash
  curl -X POST -H "Authorization: Bearer your_token" https://blogapi.pysio.online/heartbeat
  ```

### 4. Status Check
- **Request Path**: `/check`
- **Request Method**: GET
- **Response Format**: application/json
- **Response Example**:
  ```json
  {
    "alive": true,
    "last_heartbeat": 1234567890,
    "application": "MyApp",
    "introduce": "My Application Description",
    "rgba": "233,30,99,0.17",
    "applicationOnline": true
  }
  ```
- **Debug Example**:
  ```bash
  curl https://blogapi.pysio.online/check
  ```

## Image Management Endpoints

> [!IMPORTANT]
> All images are stored in Minio object storage with CDN acceleration.
> Uploaded images are automatically converted to WebP format for optimized storage and transmission.

### 1. Get Random Image
- **Request Path**: `/random_image`
- **Request Method**: GET
- **Response**: 302 redirect to Minio stored image
- **Redirect Format**: `https://minioapi.pysio.online/randomimg/{hash}.webp`
- **Error Response**:
  ```json
  {
    "error": "No images available"
  }
  ```
- **Debug Example**:
  ```bash
  # Use -L parameter to follow redirects
  curl -L https://blogapi.pysio.online/random_image -o random.webp
  ```

### 2. Get Specific Image
- **Request Path**: `/images/:hash`
- **Request Method**: GET
- **Parameters**:
  - `hash`: Image hash value
- **Response**: 302 redirect to Minio stored image
- **Redirect Format**: `https://minioapi.pysio.online/randomimg/{hash}.webp`
- **Error Response**:
  ```json
  {
    "error": "Image not found"
  }
  ```

### 3. Get Image (Optimized)
- **Request Path**: `/i/:hash`
- **Request Method**: GET
- **Parameters**:
  - `hash`: Image hash value
- **Response**: 302 redirect to Minio stored image
- **Redirect Format**: `https://minioapi.pysio.online/randomimg/{hash}.webp`
- **Error Response**:
  ```json
  {
    "error": "Image not found"
  }
  ```

### 4. Upload Image
- **Request Path**: `/images/add`
- **Request Method**: POST
- **Request Headers**:
  ```
  Authorization: Bearer {ADMIN_TOKEN}
  Content-Type: multipart/form-data
  ```
- **Request Parameters**:
  - `image`: Image file (form-data)
- **Response Format**: application/json
- **Success Response**:
  ```json
  {
    "hash": "image hash value",
    "size": image_size_in_bytes
  }
  ```
- **Error Response**:
  ```json
  {
    "error": "Image file is required"
  }
  ```
  or
  ```json
  {
    "error": "Image already exists",
    "hash": "existing image hash"
  }
  ```
- **Debug Example**:
  ```bash
  curl -X POST \
    -H "Authorization: Bearer your_admin_token" \
    -F "image=@/path/to/your/image.jpg" \
    https://blogapi.pysio.online/images/add
  ```

### 5. Get Image List
- **Request Path**: `/images/list`
- **Request Method**: GET
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
- **Response Format**: application/json
- **Response Example**:
  ```json
  {
    "images": [
      {
        "hash": "image hash",
        "contentType": "image/webp",
        "createdAt": "creation time"
      }
    ],
    "pagination": {
      "current": 1,
      "size": 10,
      "total": 100
    }
  }
  ```
- **Debug Example**:
  ```bash
  curl "https://blogapi.pysio.online/images/list?page=1&limit=10"
  ```

### 6. Get Image Count
- **Request Path**: `/images/count`
- **Request Method**: GET
- **Response Format**: application/json
- **Response Example**:
  ```json
  {
    "count": 100
  }
  ```
- **Debug Example**:
  ```bash
  curl https://blogapi.pysio.online/images/count
  ```

### 7. Delete Image
- **Request Path**: `/images/:hash`
- **Request Method**: DELETE
- **Request Headers**:
  ```
  Authorization: Bearer {ADMIN_TOKEN}
  ```
- **Parameters**:
  - `hash`: Hash of image to delete
- **Response Format**: application/json
- **Success Response**:
  ```json
  {
    "message": "Image deleted successfully"
  }
  ```
- **Error Response**:
  ```json
  {
    "error": "Image not found"
  }
  ```
- **Debug Example**:
  ```bash
  curl -X DELETE \
    -H "Authorization: Bearer your_admin_token" \
    https://blogapi.pysio.online/images/your_image_hash
  ```

### 8. Batch Upload Tools
Two batch upload tools are provided:

1. Go command line tool:
```bash
# Compile tool
go build -o uploader cmd/upload/main.go

# Use tool
./uploader -folder /path/to/images \
  -api https://blogapi.pysio.online \
  -token your_admin_token \
  -concurrent 5
```

2. PowerShell script:
```powershell
# Run script
.\upload.ps1 -folder "C:\Images" `
  -token "your_token" `
  -retries 5 `
  -timeout 60 `
  -api "https://blogapi.pysio.online"
```

## Steam Status Endpoints

### 1. Steam Game Status
- **Request Path**: `/steam_status`
- **Request Method**: GET
- **Response Format**: application/json
- **Response Example (In Game)**:
  ```json
  {
    "status": "In Game",
    "game": "Game Name",
    "game_id": "Game ID",
    "description": "Game Description",
    "price": "Game Price",
    "playtime": "Playtime",
    "achievement_percentage": "Achievement Completion"
  }
  ```
- **Response Example (Not In Game)**:
  ```json
  {
    "status": "Online"
  }
  ```
- **Debug Example**:
  ```bash
  curl https://blogapi.pysio.online/steam_status
  ```

## IP Query Endpoints

### 1. IP Information Query
- **Request Path**: `/ipcheck`
- **Request Method**: GET
- **Query Parameters**:
  - `ip`: IP address
- **Response Format**: application/json
- **Response Example**:
  ```json
  {
    "ip": "IP Address",
    "hostname": "Hostname",
    "city": "City",
    "region": "Region",
    "country": "Country",
    "loc": "Location Coordinates",
    "org": "Organization",
    "postal": "Postal Code",
    "timezone": "Timezone"
  }
  ```
- **Debug Example**:
  ```bash
  curl "https://blogapi.pysio.online/ipcheck?ip=8.8.8.8"
  ```

## API Statistics Endpoints

### 1. Get All API Call Statistics
- **Request Path**: `/api_stats`
- **Request Method**: GET
- **Response Format**: application/json
- **Response Example**:
  ```json
  [
    {
      "key": "API Path",
      "count": call_count,
      "lastUpdated": "last call time"
    }
  ]
  ```
- **Debug Example**:
  ```bash
  curl https://blogapi.pysio.online/api_stats
  ```

### 2. Get Specific API Call Statistics
- **Request Path**: `/api_stats/:key`
- **Request Method**: GET
- **Parameters**:
  - `key`: API path
- **Response Format**: application/json
- **Response Example**:
  ```json
  {
    "key": "API Path",
    "count": call_count,
    "lastUpdated": "last call time"
  }
  ```
  or
  ```json
  {
    "key": "API Path",
    "count": 0,
    "lastUpdated": null
  }
  ```
- **Debug Example**:
  ```bash
  curl https://blogapi.pysio.online/api_stats/random_image
  ```

## Error Handling

> [!WARNING]
> Please ensure your application properly handles the following error responses:

### Common Error Codes
| Error Code | Description | Handling Suggestion |
|------------|-------------|-------------------|
| 401 | Unauthorized | Check authentication token |
| 403 | Forbidden | Confirm permission level |
| 404 | Not Found | Verify request path |
| 429 | Too Many Requests | Implement rate limiting handling |
| 500 | Server Error | Contact administrator |

### 401 Unauthorized
```json
{
  "error": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Server Error
```json
{
  "error": "Internal server error"
}
```

## Best Practices

> [!TIP]
> 1. Implement request retry mechanisms
> 2. Use appropriate caching strategies
> 3. Monitor API call frequency
> 4. Implement error handling
> 5. Regularly check for API updates
> 6. Use batch upload tools for large image uploads
> 7. Follow redirect mechanisms for image access

## Performance Optimization

> [!NOTE]
> - Images are served through Minio object storage with CDN acceleration
> - All images are automatically converted to WebP format
> - Supports concurrent uploads and resumable transfers
> - Image access uses redirect mechanism to reduce server load
> - Supports global accelerated access

## Issue Feedback

> [!TIP]
> If you encounter API-related issues, please provide feedback through:
> 1. Submit GitHub Issues
> 2. Send email to administrator
> 3. Leave comments in blog comment section 