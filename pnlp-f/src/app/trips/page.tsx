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
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <TextField
            placeholder='Buscar'
            variant='outlined'
            size='small'
            disabled
            sx={{
              width: 320,
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                backgroundColor: '#fff',
                '& fieldset': {
                  borderColor: '#e0e0e0',
                },
                '&:hover fieldset': {
                  borderColor: '#bdbdbd',
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <SearchIcon sx={{ color: '#9e9e9e' }} />
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
                color={
                  getConnectionStatus().status === 'connected'
                    ? 'success'
                    : getConnectionStatus().status === 'updating'
                    ? 'warning'
                    : 'error'
                }
                size='small'
                variant='outlined'
                sx={{
                  borderRadius: '16px',
                  fontWeight: 500,
                }}
              />
            )}
            {isFetching && <CircularProgress size={16} />}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {/* Real-time controls */}
          <IconButton
            onClick={refresh}
            size='small'
            sx={{
              bgcolor: '#f5f5f5',
              '&:hover': { bgcolor: '#e0e0e0' },
              width: 36,
              height: 36,
            }}
            title='Actualizar manualmente'>
            <RefreshIcon sx={{ fontSize: 18 }} />
          </IconButton>

          <IconButton
            onClick={pausePolling}
            size='small'
            sx={{
              bgcolor: '#fff3e0',
              '&:hover': { bgcolor: '#ffe0b2' },
              width: 36,
              height: 36,
            }}
            title='Pausar actualizaciones automáticas'>
            <PauseIcon sx={{ fontSize: 18 }} />
          </IconButton>

          <IconButton
            onClick={resumePolling}
            size='small'
            sx={{
              bgcolor: '#e8f5e8',
              '&:hover': { bgcolor: '#c8e6c9' },
              width: 36,
              height: 36,
            }}
            title='Reanudar actualizaciones automáticas'>
            <PlayArrowIcon sx={{ fontSize: 18 }} />
          </IconButton>

          <IconButton
            sx={{
              bgcolor: '#f5f5f5',
              border: '1px solid #e0e0e0',
              width: 36,
              height: 36,
              '&:hover': {
                bgcolor: '#e0e0e0',
              },
            }}>
            <PersonIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <Table sx={{ borderCollapse: 'separate', borderSpacing: 0 }}>
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} sx={{ bgcolor: '#fafafa' }}>
                {headerGroup.headers.map((header) => (
                  <TableCell
                    key={header.id}
                    sx={{
                      fontWeight: 600,
                      color: '#666',
                      borderBottom: '1px solid #e0e0e0',
                      // py: 2.5,
                      px: 3,
                      fontSize: '0.875rem',
                      letterSpacing: '0.5px',
                    }}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.map((row, index) => (
              <>
                <TableRow
                  key={row.id}
                  onClick={() => handleRowClick(row.original)}
                  sx={{
                    cursor: 'pointer',
                    minHeight: 72,
                    '&:hover': {
                      bgcolor: '#f8f9fa',
                    },
                    ...(selectedRowId === row.original._id && {
                      bgcolor: '#e3f2fd',
                    }),
                    '&:not(:last-child)': {
                      borderBottom: '1px solid #f0f0f0',
                    },
                  }}>
                  {row.getVisibleCells().map((cell, cellIndex) => (
                    <TableCell
                      key={cell.id}
                      sx={{
                        py: 3,
                        px: 3,
                        verticalAlign: 'middle',
                        borderBottom: '1px solid grey.100',
                        ...(selectedRowId === row.original._id && cellIndex === 0 && {
                          borderLeft: '4px solid #1976d2',
                        }),
                      }}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              </>
            ))}
          </TableBody>
        </Table>
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: 4,
          pt: 3,
          borderTop: '1px solid #e0e0e0',
        }}>
        <Button
          variant='outlined'
          startIcon={<NavigateBeforeIcon />}
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          sx={{
            borderRadius: '6px',
            textTransform: 'none',
            fontWeight: 500,
            borderColor: '#e0e0e0',
            color: '#666',
            '&:hover': {
              borderColor: '#bdbdbd',
              backgroundColor: '#f5f5f5',
            },
            '&.Mui-disabled': {
              borderColor: '#f0f0f0',
              color: '#ccc',
            },
          }}>
          Atrás
        </Button>

        <Typography variant='body2' sx={{ color: '#666', fontWeight: 500 }}>
          Página{' '}
          <Typography component='span' variant='body2' sx={{ fontWeight: 600, color: '#333' }}>
            {table.getState().pagination.pageIndex + 1}
          </Typography>{' '}
          de{' '}
          <Typography component='span' variant='body2' sx={{ fontWeight: 600, color: '#333' }}>
            {table.getPageCount()}
          </Typography>
        </Typography>

        <Button
          variant='outlined'
          endIcon={<NavigateNextIcon />}
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          sx={{
            borderRadius: '6px',
            textTransform: 'none',
            fontWeight: 500,
            borderColor: '#e0e0e0',
            color: '#666',
            '&:hover': {
              borderColor: '#bdbdbd',
              backgroundColor: '#f5f5f5',
            },
            '&.Mui-disabled': {
              borderColor: '#f0f0f0',
              color: '#ccc',
            },
          }}>
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
    switchToHybrid,
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
    if (selectedRowData?._id) {
      const fetchDetails = async () => {
        try {
          const details = await getTravelDetails(selectedRowData._id);
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
