import { Chip, Typography, Box } from '@mui/material';
import { ColumnDef } from '@tanstack/react-table';
import { TripData } from '../../types';
import { formatNumber } from '@/components/TravelDetails';

export const columns: ColumnDef<TripData>[] = [
  {
    header: 'Fecha de carga',
    accessorKey: 'createdAt',
    cell: (info) => {
      const dateValue = info.getValue() as string;
      if (!dateValue) return '-';

      const date = new Date(dateValue);
      return (
        <Typography variant='body2' color='text.primary'>
          {date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            timeZone: 'America/La_Paz',
          })}
        </Typography>
      );
    },
  },
  {
    header: 'Fecha de entrega',
    accessorKey: 'deliveryDate',
    cell: (info) => {
      const dateValue = info.getValue() as string;
      if (!dateValue) return '-';

      const date = new Date(dateValue);
      return (
        <Typography variant='body2' color='text.primary'>
          {date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            timeZone: 'America/La_Paz',
          })}
        </Typography>
      );
    },
  },
  {
    header: 'Origen',
    accessorKey: 'origin',
    cell: (info) => (
      <Typography variant='body2' color='text.primary'>
        {String(info.getValue() || '-')}
      </Typography>
    ),
  },
  {
    header: 'Destino',
    accessorKey: 'destination',
    cell: (info) => (
      <Typography variant='body2' color='text.primary'>
        {String(info.getValue() || '-')}
      </Typography>
    ),
  },
  {
    header: 'Tipo de carga',
    accessorKey: 'loadType',
    cell: (info) => (
      <Chip
        label={String(info.getValue() || '-')}
        size='small'
        sx={{
          fontSize: '0.75rem',
          fontWeight: 500,
          backgroundColor: '#ECEEF2',
          color: '#666',
          border: 'none',
          borderRadius: '4px',
          height: '24px',
          '& .MuiChip-label': {
            px: 1.5,
          },
        }}
      />
    ),
  },
  {
    header: 'Mejor oferta',
    accessorKey: 'bestOffer',
    cell: (info) => (
      <Typography
        variant='body2'
        sx={{
          color: '#2e7d32',
          fontWeight: 600,
          fontSize: '0.875rem',
        }}>
        {formatNumber(String(info.getValue() ?? '0'))} Bs
      </Typography>
    ),
  },
  {
    header: 'Cotizaciones recibidas',
    accessorKey: 'quotes',
    cell: (info) => (
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 28,
          height: 28,
          borderRadius: '4px',
          backgroundColor: '#ECEEF2',
          color: '#666',
          fontSize: '0.75rem',
          fontWeight: 500,
          border: 'none',
        }}>
        {String(info.getValue() ?? '0')}
      </Box>
    ),
  },
];
