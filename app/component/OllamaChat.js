"use client";
import React, { useState } from 'react';
import { 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TextField,
  Button,
  Typography,
  Box
} from '@mui/material';

function OllamaChat({ onResponseReceived }) {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = { role: 'user', content: inputValue.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      });
      const data = await response.json();
      if (data.content) {
        const assistantMessage = { role: 'assistant', content: data.content };
        setMessages((prev) => [...prev, assistantMessage]);
        if (onResponseReceived) {
          onResponseReceived(data.content);
        }
      }
    } catch (error) {
      console.error('Error fetching from /api/chat:', error);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Chat with Ollama
      </Typography>
      
      <TableContainer component={Paper} elevation={1} sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Role</strong></TableCell>
              <TableCell><strong>Message</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {messages.map((msg, index) => (
              <TableRow key={index} sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' } }}>
                <TableCell component="th" scope="row">
                  {msg.role === 'user' ? 'You' : 'Ollama'}
                </TableCell>
                <TableCell>{msg.content}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          placeholder="Ask something..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          size="small"
        />
        <Button type="submit" variant="contained" color="primary">
          Send
        </Button>
      </Box>
    </Paper>
  );
}

export default OllamaChat;