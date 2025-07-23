"use client";

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar
} from '@mui/material';
import { TripApiService } from '../services/tripApi';
import { Trip } from '../hooks/useTripChanges';
import { FormFieldValue } from '../types';

interface TripFormProps {
  onTripCreated?: (trip: Trip) => void;
}

export const TripForm: React.FC<TripFormProps> = ({ onTripCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    destination: '',
    startDate: '',
    endDate: '',
    status: 'pending' as const,
    price: 0,
    participants: 1,
    tags: [] as string[]
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);



  const handleInputChange = (field: string, value: FormFieldValue) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const trip = await TripApiService.createTrip({
        ...formData,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        price: Number(formData.price),
        participants: Number(formData.participants)
      });

      setMessage({ type: 'success', text: 'Trip created successfully!' });
      setFormData({
        title: '',
        description: '',
        destination: '',
        startDate: '',
        endDate: '',
        status: 'pending',
        price: 0,
        participants: 1,
        tags: []
      });

      if (onTripCreated) {
        onTripCreated(trip);
      }
    } catch (error) {
      setMessage({ type: 'error', text: `Error creating trip: ${error}` });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setMessage(null);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            Create New Trip
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Fill out the form below to create a new trip. This will trigger a real-time change event.
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              required
            />

            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              multiline
              rows={3}
            />

            <TextField
              fullWidth
              label="Destination"
              value={formData.destination}
              onChange={(e) => handleInputChange('destination', e.target.value)}
              required
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
              />

              <TextField
                fullWidth
                label="End Date"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  label="Status"
                  onChange={(e) => handleInputChange('status', e.target.value)}
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="confirmed">Confirmed</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Price"
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                InputProps={{ startAdornment: '$' }}
              />
            </Box>

            <TextField
              fullWidth
              label="Participants"
              type="number"
              value={formData.participants}
              onChange={(e) => handleInputChange('participants', e.target.value)}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? 'Creating...' : 'Create Trip'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Snackbar
        open={!!message}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={message?.type}
          sx={{ width: '100%' }}
        >
          {message?.text}
        </Alert>
      </Snackbar>
    </Box>
  );
}; 