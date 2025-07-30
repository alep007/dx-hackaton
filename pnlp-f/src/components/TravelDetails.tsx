import React, { forwardRef, useMemo, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Button,
  Chip,
  IconButton,
  Divider,
  Paper,
  Slide,
  Card,
  Alert,
  List,
  ListItem,
  ListItemButton,
  Stack,
} from '@mui/material';
import {
  Close as CloseIcon,
  LocationOn as LocationIcon,
  LocalShipping as ShippingIcon,
  CalendarToday as CalendarIcon,
  Phone as PhoneIcon,
  ExpandMore as ExpandMoreIcon,
  Refresh as RefreshIcon,
  Wifi as WifiIcon,
  WifiOff as WifiOffIcon,
  AccessTime as AccessTimeIcon,
  CheckCircle,
  ExpandLess,
} from '@mui/icons-material';
import { TravelDetails } from '../hooks/useTravelDetails';
import { WhatsAppLink } from '../utils/WhatsappLink';
import { RealTimeTestUtils } from '../utils/RealTimeTestUtils';
import { TripData } from '../types';

interface TravelDetailsProps {
  data?: TravelDetails[] | null;
  rowData?: TripData; // Add the whole row data
  onClose: () => void;
  open: boolean;
  // Real-time props
  isConnected?: boolean;
  lastUpdate?: Date | null;
  onRefresh?: () => void;
  isLoading?: boolean;
  relevantChangesCount?: number;
}

const Transition = forwardRef(function Transition(
  props: React.ComponentProps<typeof Slide>,
  ref: React.Ref<unknown>
) {
  return <Slide direction='left' ref={ref} {...props} />;
});

// Helper function to format numbers with comma separators and 2 decimal places
export const formatNumber = (value: number | string) => {
  const num = Number(value) || 0;
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
export function TravelDetailsComponent({
  data,
  rowData,
  onClose,
  open,
  isConnected = false,
  lastUpdate = null,
  onRefresh,
  isLoading = false,
  relevantChangesCount = 0,
}: TravelDetailsProps) {
  const [expandedMessageId, setExpandedMessageId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('Insumos');

  // Helper function to extract phone number from conversation ID
  const extractPhoneFromConversationId = (conversationId: string) => {
    if (!conversationId) return null;
    // Extract phone number from format like "59173496410@c.us"
    const match = conversationId.match(/^(\d+)@c\.us$/);
    return match ? match[1] : null;
  };

  const handleMessageClick = (ofertaId: string) => {
    setExpandedMessageId(expandedMessageId === ofertaId ? null : ofertaId);
  };

  // Helper function to safely access conversation data
  const getConversationId = (conversationData: unknown) => {
    if (conversationData && typeof conversationData === 'object' && 'id' in conversationData) {
      return (conversationData as { id: string }).id;
    }
    return null;
  };

  // Helper function to get message content
  const getMessageContent = (message: string) => {
    // Try to find message field in the conversation data
    return message || 'Mensaje no disponible';
  };

  // Format last update time
  const formatLastUpdate = (date: Date) => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getBestOffer = useMemo(() => {
    return data && data.length > 0 ? Math.min(...data.map((item) => Number(item.amount) || 0)) : 0;
  }, [data]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='md'
      fullWidth
      fullScreen
      TransitionComponent={Transition}
      sx={{
        '& .MuiDialog-paper': {
          margin: 0,
          borderRadius: 0,
          display: 'flex',
          flexDirection: 'row',
          height: '100vh',
          maxWidth: '50%',
          marginLeft: '60%',
        },
      }}>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box
          sx={{
            p: 2,
            borderBottom: '1px solid',
            borderColor: 'grey.300',
            bgcolor: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant='h5' fontWeight='bold' sx={{ fontSize: 18, fontWeight: 600 }}>
              Detalle de viaje
            </Typography>
            {/* Real-time status indicators */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {isConnected ? (
                <WifiIcon color='success' fontSize='small' />
              ) : (
                <WifiOffIcon color='error' fontSize='small' />
              )}
              <Chip
                label={isConnected ? 'En vivo' : 'Desconectado'}
                color={isConnected ? 'success' : 'error'}
                size='small'
                variant='filled'
                sx={{
                  bgcolor: isConnected ? 'success.main' : 'error.main',
                  color: 'white',
                  fontWeight: 'medium',
                }}
              />
              {/* Show relevant changes count */}
              {relevantChangesCount > 0 && (
                <Chip
                  label={`${relevantChangesCount} cambio${relevantChangesCount > 1 ? 's' : ''}`}
                  color='info'
                  size='small'
                  variant='filled'
                />
              )}
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Last update indicator */}
            {lastUpdate && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <AccessTimeIcon fontSize='small' color='action' />
                <Typography variant='body2' color='text.secondary'>
                  {formatLastUpdate(lastUpdate)}
                </Typography>
              </Box>
            )}
            {/* Refresh button */}
            {onRefresh && (
              <IconButton onClick={onRefresh} size='small' disabled={isLoading} color='primary'>
                <RefreshIcon />
              </IconButton>
            )}
            <IconButton onClick={onClose} size='small'>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, p: 3, overflow: 'auto', bgcolor: 'white' }}>
          {/* Loading indicator */}
          {isLoading && (
            <Alert severity='info' sx={{ mb: 2 }}>
              Actualizando datos...
            </Alert>
          )}

          {/* Trip Information */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {/* Load Date */}
              <Box sx={{ display: 'flex', alignItems: 'center', width: 'calc(50% - 8px)' }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: 'warning.50',
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2,
                  }}>
                  <CalendarIcon fontSize='small' color='action' />
                </Box>
                <Box>
                  <Typography
                    variant='body2'
                    sx={{
                      fontSize: 14,
                      fontWeight: 400,
                      color: '#6D665A',
                    }}>
                    Fecha de carga
                  </Typography>
                  <Typography
                    variant='body2'
                    sx={{
                      fontSize: 14,
                      fontWeight: 400,
                      color: '#121417',
                    }}>
                    {rowData?.createdAt
                      ? new Date(rowData.createdAt).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          timeZone: 'America/La_Paz',
                        })
                      : 'N/A'}
                  </Typography>
                </Box>
              </Box>

              {/* Delivery Date */}
              <Box sx={{ display: 'flex', alignItems: 'center', width: 'calc(50% - 8px)' }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: 'warning.50',
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2,
                  }}>
                  <CalendarIcon fontSize='small' color='action' />
                </Box>
                <Box>
                  <Typography
                    variant='body2'
                    sx={{
                      fontSize: 14,
                      fontWeight: 400,
                      color: '#6D665A',
                    }}>
                    Fecha de entrega
                  </Typography>
                  <Typography
                    variant='body2'
                    sx={{
                      fontSize: 14,
                      fontWeight: 400,
                      color: '#121417',
                    }}>
                    {rowData?.deliveryDate
                      ? new Date(rowData.deliveryDate).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          timeZone: 'America/La_Paz',
                        })
                      : 'N/A'}
                  </Typography>
                </Box>
              </Box>

              {/* Origin */}
              <Box sx={{ display: 'flex', alignItems: 'center', width: 'calc(50% - 8px)' }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: 'primary.50',
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2,
                  }}>
                  <LocationIcon fontSize='small' color='action' />
                </Box>
                <Box>
                  <Typography
                    variant='body2'
                    sx={{
                      fontSize: 14,
                      fontWeight: 400,
                      color: '#6D665A',
                    }}>
                    Origen
                  </Typography>
                  <Typography
                    variant='body2'
                    sx={{
                      fontSize: 14,
                      fontWeight: 400,
                      color: '#121417',
                    }}>
                    {rowData?.origin}
                  </Typography>
                </Box>
              </Box>

              {/* Destination */}
              <Box sx={{ display: 'flex', alignItems: 'center', width: 'calc(50% - 8px)' }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: 'success.50',
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2,
                  }}>
                  <LocationIcon fontSize='small' color='action' />
                </Box>
                <Box>
                  <Typography
                    variant='body2'
                    sx={{
                      fontSize: 14,
                      fontWeight: 400,
                      color: '#6D665A',
                    }}>
                    Destino
                  </Typography>
                  <Typography
                    variant='body2'
                    sx={{
                      fontSize: 14,
                      fontWeight: 400,
                      color: '#121417',
                    }}>
                    {rowData?.destination}
                  </Typography>
                </Box>
              </Box>

              {/* Load Type */}
              <Box sx={{ display: 'flex', alignItems: 'center', width: 'calc(50% - 8px)' }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: 'secondary.50',
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2,
                  }}>
                  <ShippingIcon fontSize='small' color='action' />
                </Box>
                <Box>
                  <Typography
                    variant='body2'
                    sx={{
                      fontSize: 14,
                      fontWeight: 400,
                      color: '#6D665A',
                    }}>
                    Tipo de carga
                  </Typography>
                  <Typography
                    variant='body2'
                    sx={{
                      fontSize: 14,
                      fontWeight: 400,
                      color: '#121417',
                    }}>
                    {rowData?.loadType}
                  </Typography>
                </Box>
              </Box>

              {/* Truck Type */}
              <Box sx={{ display: 'flex', alignItems: 'center', width: 'calc(50% - 8px)' }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: 'secondary.50',
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2,
                  }}>
                  <ShippingIcon fontSize='small' color='action' />
                </Box>
                <Box>
                  <Typography
                    variant='body2'
                    sx={{
                      fontSize: 14,
                      fontWeight: 400,
                      color: '#6D665A',
                    }}>
                    Tipo de camión
                  </Typography>
                  <Typography
                    variant='body2'
                    sx={{
                      fontSize: 14,
                      fontWeight: 400,
                      color: '#121417',
                    }}>
                    {rowData?.truckType}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Current Best Offer */}
          <Paper
            elevation={0}
            sx={{
              border: '1px solid',
              borderColor: 'success.main',
              borderRadius: '8px',
              backgroundColor: '#F0FDF4',
              px: 1,
              mb: 3,
            }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                py: 0.5,
              }}>
              <Typography
                variant='body1'
                sx={{
                  fontSize: 16,
                  fontWeight: 400,
                  color: 'success.main',
                }}>
                Mejor oferta actual:
              </Typography>
              <Typography
                variant='h6'
                color='success.main'
                sx={{
                  fontSize: 16,
                  fontWeight: 400,
                }}>
                {formatNumber(getBestOffer)} Bs
              </Typography>
            </Box>
          </Paper>

          {/* Offers Section */}
          <Box>
            <Typography variant='h6' fontWeight='bold'>
              Ofertas
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {data?.map((oferta) => (
                <Card
                  key={oferta._id}
                  elevation={0}
                  sx={{
                    p: 1,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: '#DDDCD9',
                    bgcolor: 'white',
                  }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      mb: 1,
                    }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                      }}>
                      <Typography
                        variant='body2'
                        color='#121417'
                        sx={{ mr: 1, fontSize: 16, fontWeight: 500 }}>
                        Oferta #{oferta._id.slice(-6)}
                      </Typography>
                      {Number(oferta?.amount) === getBestOffer && (
                        <Chip
                          label='Mejor oferta'
                          color='success'
                          size='small'
                          variant='filled'
                          sx={{ bgcolor: 'success.main', color: 'white', borderRadius: 1 }}
                          icon={<CheckCircle />}
                        />
                      )}
                    </Box>

                    <Stack direction='column' alignItems='flex-end' gap={0.5}>
                      <Typography
                        variant='h5'
                        fontWeight='bold'
                        color='text.primary'
                        sx={{
                          fontSize: 16,
                          fontWeight: 600,
                        }}>
                        {formatNumber(oferta?.amount)} Bs
                      </Typography>
                      {Number(oferta?.amount) > getBestOffer && (
                        <Typography
                          variant='body2'
                          color='error.main'
                          sx={{
                            fontSize: 12,
                            fontWeight: 400,
                          }}>
                          +{formatNumber(Number(oferta?.amount) - getBestOffer)} Bs vs Mejor oferta
                        </Typography>
                      )}
                    </Stack>
                  </Box>

                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <WhatsAppLink
                        countryCode='591'
                        //@ts-ignore
                        phone={extractPhoneFromConversationId(oferta?.conversationData?.id)}
                        onlyIcon={false}
                      />
                    </Box>
                    <Button
                      size='small'
                      color='primary'
                      endIcon={
                        expandedMessageId === oferta._id ? <ExpandLess /> : <ExpandMoreIcon />
                      }
                      onClick={() => handleMessageClick(oferta._id)}
                      sx={{
                        textTransform: 'none',
                        // add underline
                        textDecoration: 'underline',
                        color: 'primary.main',
                        '&:hover': {
                          bgcolor: 'primary.50',
                        },
                      }}>
                      {expandedMessageId === oferta._id ? 'Ocultar mensaje' : 'Ver mensaje'}
                    </Button>
                  </Box>

                  {/* Message Content - Show when expanded */}
                  {expandedMessageId === oferta._id && (
                    <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                      <Typography variant='body2' color='text.secondary'>
                        {getMessageContent(oferta.message)}
                      </Typography>
                    </Box>
                  )}
                </Card>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
}
