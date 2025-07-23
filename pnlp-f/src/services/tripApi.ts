import { Trip } from '../hooks/useTripChanges';

const API_BASE_URL = 'http://localhost:3001';

export class TripApiService {
  static async getTrips(status?: string, destination?: string): Promise<Trip[]> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (destination) params.append('destination', destination);
    
    const response = await fetch(`${API_BASE_URL}/trips?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch trips: ${response.statusText}`);
    }
    return response.json();
  }

  static async getTripDetail(id: string): Promise<Trip> {
    const response = await fetch(`${API_BASE_URL}/trips/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch trip: ${response.statusText}`);
    }
    return response.json();
  }

  static async createTrip(tripData: Partial<Trip>): Promise<Trip> {
    const response = await fetch(`${API_BASE_URL}/trips`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tripData),
    });
    if (!response.ok) {
      throw new Error(`Failed to create trip: ${response.statusText}`);
    }
    return response.json();
  }

  static async updateTrip(id: string, tripData: Partial<Trip>): Promise<Trip> {
    const response = await fetch(`${API_BASE_URL}/trips/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tripData),
    });
    if (!response.ok) {
      throw new Error(`Failed to update trip: ${response.statusText}`);
    }
    return response.json();
  }

  static async deleteTrip(id: string): Promise<Trip> {
    const response = await fetch(`${API_BASE_URL}/trips/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete trip: ${response.statusText}`);
    }
    return response.json();
  }
} 