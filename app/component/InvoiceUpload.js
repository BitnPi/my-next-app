import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

export function InvoiceUpload({ onInvoiceData }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/vision', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
      } else if (data.content) {
        onInvoiceData(data.content);
      }
    } catch (error) {
      setError('Error processing invoice');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
      <Typography variant="h5" gutterBottom>
        Invoice Analysis
      </Typography>
      
      <Box sx={{ my: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="invoice-upload"
          type="file"
          onChange={handleFileUpload}
        />
        <label htmlFor="invoice-upload">
          <Button
            component="span"
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Upload Invoice'}
          </Button>
        </label>
        
        {loading && <CircularProgress size={24} sx={{ mt: 2 }} />}
        {fileName && !loading && (
          <Typography variant="body2" color="textSecondary">
            Selected file: {fileName}
          </Typography>
        )}
      </Box>

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
    </Paper>
  );
}