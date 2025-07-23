'use client';
import React, { useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  getPaginationRowModel,
} from '@tanstack/react-table';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  Button,
  Box,
  Typography,
  Chip,
  IconButton,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  Person as PersonIcon,
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon,
  Refresh as RefreshIcon,
  Pause as PauseIcon,
  PlayArrow as PlayArrowIcon,
  Wifi as WifiIcon,
} from '@mui/icons-material';
import { useRealTimeData } from '../../hooks/useRealTimeData';
import { useTravelDetails } from '../../hooks/useTravelDetails';
import { TravelDetailsComponent } from '../../components/TravelDetails';
import { columns } from './columns';
import { TripData } from '../../types';

const queryClient = new QueryClient();

function TableContent({
  data,
  isLoading,
  selectedRowId,
  onRowSelect,
  isFetching,
  refresh,
  pausePolling,
  resumePolling,
  getConnectionStatus,
  updateMode,
  switchToPolling,
  switchToWebSocket,
  switchToHybrid,
}: {
  data: TripData[];
  isLoading: boolean;
  selectedRowId: string | null;
  onRowSelect: (rowData: TripData) => void;
  isFetching?: boolean;
  refresh?: () => void;
  pausePolling?: () => void;
  resumePolling?: () => void;
  getConnectionStatus?: () => { status: string; mode: string; message: string };
  updateMode?: string;
  switchToPolling?: () => void;
  switchToWebSocket?: () => void;
  switchToHybrid?: () => void;
}) {
  const [pageIndex, setPageIndex] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(8);

  const table = useReactTable({
    data: data || [],
    columns: columns,
    state: {
      pagination: { pageIndex, pageSize },
    },
    pageCount: data ? Math.ceil(data.length / pageSize) : 0,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        const next = updater({ pageIndex, pageSize });
        setPageIndex(next.pageIndex);
        setPageSize(next.pageSize);
      } else {
        setPageIndex(updater.pageIndex);
        setPageSize(updater.pageSize);
      }
    },
    manualPagination: false,
  });

  const handleRowClick = (rowData: TripData) => {
    onRowSelect(rowData);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 256 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        width: '100%',
        height: '100%',
        borderRadius: 3,
        // p: 4,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <TextField
            placeholder='Buscar'
            variant='outlined'
            size='small'
            disabled
            sx={{ width: 320 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <SearchIcon color='action' />
                </InputAdornment>
              ),
            }}
          />
          
          {/* Real-time status indicator */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {getConnectionStatus && (
              <Chip
                icon={<WifiIcon />}
                label={getConnectionStatus().message}
                color={getConnectionStatus().status === 'connected' ? 'success' : 
                       getConnectionStatus().status === 'updating' ? 'warning' : 'error'}
                size="small"
                variant="outlined"
              />
            )}
            {isFetching && <CircularProgress size={16} />}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Real-time controls */}
          <IconButton 
            onClick={refresh}
            size="small"
            sx={{ bgcolor: 'primary.50', '&:hover': { bgcolor: 'primary.100' } }}
            title="Actualizar manualmente"
          >
            <RefreshIcon />
          </IconButton>
          
          <IconButton 
            onClick={pausePolling}
            size="small"
            sx={{ bgcolor: 'warning.50', '&:hover': { bgcolor: 'warning.100' } }}
            title="Pausar actualizaciones automáticas"
          >
            <PauseIcon />
          </IconButton>
          
          <IconButton 
            onClick={resumePolling}
            size="small"
            sx={{ bgcolor: 'success.50', '&:hover': { bgcolor: 'success.100' } }}
            title="Reanudar actualizaciones automáticas"
          >
            <PlayArrowIcon />
          </IconButton>

          <IconButton sx={{ bgcolor: 'grey.100', border: '1px solid', borderColor: 'grey.300' }}>
            <PersonIcon />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <Table>
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} sx={{ bgcolor: 'grey.50' }}>
                {headerGroup.headers.map((header) => (
                  <TableCell
                    key={header.id}
                    sx={{
                      fontWeight: 'semibold',
                      color: 'text.secondary',
                      borderBottom: '1px solid',
                      borderColor: 'grey.200',
                      py: 2,
                    }}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                onClick={() => handleRowClick(row.original)}
                sx={{
                  cursor: 'pointer',
                  minHeight: 60,
                  mb: 1,
                  '&:hover': {
                    bgcolor: 'grey.50',
                  },
                  ...(selectedRowId === row.id && {
                    bgcolor: 'primary.50',
                    borderLeft: '4px solid',
                    borderColor: 'primary.main',
                  }),
                }}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    sx={{
                      py: 2,
                      borderBottom: '1px solid',
                      borderColor: 'grey.100',
                    }}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: 3,
          pt: 2,
          borderTop: '1px solid',
          borderColor: 'grey.200',
        }}>
        <Button
          variant='outlined'
          startIcon={<NavigateBeforeIcon />}
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}>
          Atrás
        </Button>

        <Typography variant='body2' color='text.secondary'>
          Página{' '}
          <Typography component='span' variant='body2' fontWeight='semibold' color='text.primary'>
            {table.getState().pagination.pageIndex + 1}
          </Typography>{' '}
          de{' '}
          <Typography component='span' variant='body2' fontWeight='semibold' color='text.primary'>
            {table.getPageCount()}
          </Typography>
        </Typography>

        <Button
          variant='outlined'
          endIcon={<NavigateNextIcon />}
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}>
          Siguiente
        </Button>
      </Box>
    </Paper>
  );
}

function TablePageContent() {
  const { 
    data, 
    isLoading, 
    refresh, 
    pausePolling, 
    resumePolling,
    isFetching,
    getConnectionStatus,
    updateMode,
    switchToPolling,
    switchToWebSocket,
    switchToHybrid
  } = useRealTimeData({
    mode: 'polling',
    pollingInterval: 3000, // Update every 3 seconds
  });
  const [selectedRowData, setSelectedRowData] = React.useState<TripData | null>(null);
  
  // Use the enhanced useTravelDetails hook with real-time capabilities
  const { 
    getTravelDetails, 
    refreshDetails,
    clearDetails,
    isLoading: detailsLoading, 
    travelDetails,
    selectedTripId,
    lastUpdate,
    isConnected: detailsConnected,
    relevantChangesCount,
  } = useTravelDetails({
    enableRealTime: true,
    pollingInterval: 5000, // Update travel details every 5 seconds
  });

  // Call endpoint when selectedRowData is not null
  useEffect(() => {
    console.log(selectedRowData?._id);

    if (selectedRowData?._id) {
      const fetchDetails = async () => {
        try {
          const details = await getTravelDetails(selectedRowData._id);
          console.log('Travel details fetched:', details);
        } catch (error) {
          console.error('Error fetching travel details:', error);
        }
      };
      fetchDetails();
    } else {
      // Clear details when no trip is selected
      clearDetails();
    }
  }, [selectedRowData?._id, getTravelDetails, clearDetails]);

  const handleRowSelect = (rowData: TripData) => {
    setSelectedRowData(rowData);
  };

  const handleCloseDetails = () => {
    setSelectedRowData(null);
    clearDetails();
  };

  return (
    <>
      <TableContent
        data={data || []}
        isLoading={isLoading}
        selectedRowId={selectedRowData?._id || null}
        onRowSelect={handleRowSelect}
        isFetching={isFetching}
        refresh={refresh}
        pausePolling={pausePolling}
        resumePolling={resumePolling}
        getConnectionStatus={getConnectionStatus}
        updateMode={updateMode}
        switchToPolling={switchToPolling}
        switchToWebSocket={switchToWebSocket}
        switchToHybrid={switchToHybrid}
      />

      {/* Modal rendered outside the table layout */}
      <TravelDetailsComponent
        data={travelDetails}
        rowData={selectedRowData || undefined}
        onClose={handleCloseDetails}
        open={!!selectedRowData?._id}
        isConnected={detailsConnected}
        lastUpdate={lastUpdate}
        onRefresh={refreshDetails}
        isLoading={detailsLoading}
        relevantChangesCount={relevantChangesCount}
      />
    </>
  );
}

export default function TablePage() {
  return (
    <QueryClientProvider client={queryClient}>
      <TablePageContent />
    </QueryClientProvider>
  );
}
