"use client";
import { SetStateAction, useState } from 'react';
import { Container, Grid } from '@mui/material';
import OllamaChat from './component/OllamaChat';
import ResponseChart from './component/ResponseChart';

export default function Page() {
  const [responseData, setResponseData] = useState(null);

  const handleResponse = (response: SetStateAction<null>) => {
    setResponseData(response);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <OllamaChat onResponseReceived={handleResponse} />
        </Grid>
        <Grid item xs={12} md={6}>
          <ResponseChart data={responseData} />
        </Grid>
      </Grid>
    </Container>
  );
}