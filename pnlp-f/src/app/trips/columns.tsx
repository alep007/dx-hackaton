import { Chip, Typography } from "@mui/material";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<any>[] = [
  {
    header: 'Fecha de carga',
    accessorKey: 'createdAt',
    cell: (info) => {
      const dateValue = info.getValue() as string;
      if (!dateValue) return '-';

      const date = new Date(dateValue);
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'America/La_Paz',
      });
    },
  },
  {
    header: 'Fecha de entrega',
    accessorKey: 'deliveryDate',
    cell: (info) => {
      const dateValue = info.getValue() as string;
      if (!dateValue) return '-';

      const date = new Date(dateValue);
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'America/La_Paz',
      });
    },
  },
  {
    header: 'Origen',
    accessorKey: 'origin',
  },
  {
    header: 'Destino',
    accessorKey: 'destination',
  },
  {
    header: 'Tipo de carga',
    accessorKey: 'loadType',
    cell: (info) => (
      <Chip
        label={String(info.getValue())}
        size='small'
        variant='outlined'
        sx={{ fontSize: '0.75rem' }}
      />
    ),
  },
  {
    header: 'Mejor oferta',
    accessorKey: 'bestOffer',
    cell: (info) => (
      <Typography variant='body2' color='success.main' fontWeight='semibold'>
        {String(info.getValue() ?? '0')} Bs
      </Typography>
    ),
  },
  {
    header: 'Cotizaciones recibidas',
    accessorKey: 'quotes',
    cell: (info) => (
      <Chip
        label={String(info.getValue() ?? '0')}
        size='small'
        variant='outlined'
        sx={{ fontSize: '0.75rem' }}
      />
    ),
  },
];
