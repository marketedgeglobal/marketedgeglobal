# Publications Review Assistant - Attachment Reading Fix

## Problem
The Publications Review assistant was not reading attachments in chat. The issue was that attachments were being embedded as plain text in system messages (truncated to 20,000 characters) rather than being properly uploaded to OpenAI's Files API.

## Root Cause
Previously, the server was:
1. Reading uploaded files from disk
2. Converting them to UTF-8 text
3. Truncating at 20,000 characters
4. Adding them as system messages to the thread

This approach had several limitations:
- Binary files (PDFs, images) could not be properly handled
- Large documents were truncated
- The assistant had to parse text content rather than using OpenAI's file_search tool
- The Publications Review assistant expected proper file attachments

## Solution
Implemented proper OpenAI Files API integration:

### Key Changes in `server/index.js`

1. **File Upload to OpenAI**
   - Files are now properly uploaded to OpenAI's Files API using `POST /v1/files`
   - Files are sent as FormData blobs with correct MIME types
   - OpenAI returns file IDs that can be referenced by the assistant

2. **Proper File Attachments in Messages**
   - File IDs are added as attachments to the last user message
   - Each attachment includes `file_id` and `tools: [{ type: 'file_search' }]`
   - This allows the assistant to use the file_search tool for document analysis

3. **File Search Tool Configuration**
   - When creating a run, if files are uploaded, the run config includes `tool_resources`
   - This ensures the assistant has access to the file_search tool

4. **Automatic Cleanup**
   - After processing, files are automatically deleted from OpenAI's Files API
   - Cleanup also happens if an error occurs
   - This prevents clutter in OpenAI's file storage

### Code Changes

**Before (lines 136-155):**
```javascript
// Old approach: embed file content as system messages
const attachments = request.body?.attachments || [];
for (const a of attachments) {
  const filePath = path.join(uploadsDir, a.id);
  const buf = fs.readFileSync(filePath);
  const text = buf.toString('utf8').slice(0, 20000); // Truncation!
  // Add as system message with embedded content
  await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
    body: JSON.stringify({ role: 'system', content: `Attachment: ${a.name}\n\n${text}` }),
  });
}
```

**After (lines 136-184):**
```javascript
// New approach: upload to OpenAI Files API
const attachments = request.body?.attachments || [];
const uploadedFileIds = [];

for (const a of attachments) {
  const fileBuffer = fs.readFileSync(filePath);
  const formData = new FormData();
  const blob = new Blob([fileBuffer], { type: a.mime });
  formData.append('file', blob, fileName);
  formData.append('purpose', 'assistants');
  
  // Upload to OpenAI
  const uploadRes = await fetch('https://api.openai.com/v1/files', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: formData,
  });
  uploadedFileIds.push(fileData.id);
}

// Add file IDs to the last user message with file_search tool
messageBody.attachments = uploadedFileIds.map((fileId) => ({
  file_id: fileId,
  tools: [{ type: 'file_search' }],
}));
```

## Benefits

1. **Full Document Support**: No truncation - complete documents are available
2. **Binary File Support**: PDFs, images, and other binary formats are properly handled
3. **File Search Tool**: Assistants can now use OpenAI's file_search tool for intelligent document analysis
4. **Better Performance**: The assistant can search through documents more efficiently
5. **Proper Cleanup**: Automatic deletion of uploaded files prevents API clutter

## Testing

To test the fix:

1. Open the chat and select the **Publication Review** assistant
2. Upload a PDF or document file
3. Ask the assistant to review or search the document
4. The assistant should now be able to read and analyze the entire document

## Technical Details

- **OpenAI Files API**: Uses `/v1/files` endpoint with FormData for file uploads
- **File Attachments**: Added to messages using the `attachments` field with `file_search` tool
- **Tool Resources**: The assistant run includes `tool_resources` configuration for file_search
- **Cleanup**: Files are deleted after processing using `DELETE /v1/files/{file_id}`

## Compatibility

- Works with all OpenAI Assistants v2 API assistants
- Supports PDFs, Word documents, Excel files, images, and text files
- Backward compatible with existing chat functionality
