"use client";

import React from 'react';
import { Container, Typography, Box, Divider } from '@mui/material';
import { TripChangesMonitor } from '../../components/TripChangesMonitor';
import { TripForm } from '../../components/TripForm';

export default function MonitorPage() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          MongoDB Change Stream Monitor
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
          Watch real-time changes in your MongoDB trips collection
        </Typography>
        
        <TripChangesMonitor />
        
        <Divider sx={{ my: 4 }} />
        
        <TripForm />
      </Box>
    </Container>
  );
} 