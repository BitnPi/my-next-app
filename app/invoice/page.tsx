"use client";
import { SetStateAction, useState } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { InvoiceUpload } from '../component/InvoiceUpload';
import { InvoiceTable } from '../component/InvoiceTable';
import { InvoiceChart } from '../component/InvoiceChart';

export default function InvoicePage() {
  const [invoiceData, setInvoiceData] = useState(null);

  const handleInvoiceData = (data: SetStateAction<null>) => {
    setInvoiceData(data);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <InvoiceUpload onInvoiceData={handleInvoiceData} />
        </Grid>
        <Grid item xs={12} md={6}>
          <InvoiceTable data={invoiceData} />
        </Grid>
        <Grid item xs={12} md={6}>
          <InvoiceChart data={invoiceData} />
        </Grid>
      </Grid>
    </Container>
  );
}