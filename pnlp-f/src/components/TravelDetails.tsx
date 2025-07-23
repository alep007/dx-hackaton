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
  Grid,
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
} from '@mui/icons-material';
import { TravelDetails } from '../hooks/useTravelDetails';
import { WhatsAppLink } from '../utils/WhatsappLink';
import { RealTimeTestUtils } from '../utils/RealTimeTestUtils';

interface TravelDetailsProps {
  data?: TravelDetails[] | null;
  rowData?: any; // Add the whole row data
  onClose: () => void;
  open: boolean;
  // Real-time props
  isConnected?: boolean;
  lastUpdate?: Date | null;
  onRefresh?: () => void;
  isLoading?: boolean;
  relevantChangesCount?: number;
}

const Transition = forwardRef(function Transition(props: any, ref: React.Ref<unknown>) {
  return <Slide direction='left' ref={ref} {...props} />;
});

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
      return (conversationData as any).id;
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
    return data && data.length > 0
      ? Math.min(...data.map((item) => Number(item.amount) || 0))
      : 0;
  }, [data]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='md'
      fullWidth
      fullScreen
      TransitionComponent={Transition}
      sx={{ maxWidth: '50%', marginLeft: '60%' }}>
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 1,
        }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography fontWeight='bold'>Detalle de viaje</Typography>
          {/* Real-time status indicators */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {isConnected ? (
              <WifiIcon color='success' fontSize='small' />
            ) : (
              <WifiOffIcon color='error' fontSize='small' />
            )}
            <Chip
              label={isConnected ? 'En vivo' : 'Desconectado'}
              color={isConnected ? 'success' : 'error'}
              size='small'
              variant='outlined'
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Last update indicator */}
          {lastUpdate && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <AccessTimeIcon fontSize='small' color='action' />
              <Typography variant='caption' color='text.secondary'>
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
      </DialogTitle>

      <DialogContent sx={{ pt: 0 }}>
        {/* Loading indicator */}
        {isLoading && (
          <Alert severity='info' sx={{ mb: 2 }}>
            Actualizando datos...
          </Alert>
        )}

        {/* Development test utilities
        {process.env.NODE_ENV === 'development' && (
          <RealTimeTestUtils 
            tripId={rowData?._id} 
            onTestEvent={() => {
              console.log('Test event triggered');
            }}
          />
        )} */}

        {/* Trip Information */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {/* Creation Date */}
            <Box sx={{ display: 'flex', alignItems: 'center', width: 'calc(50% - 8px)' }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: 'warning.50',
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 1.5,
                }}>
                <CalendarIcon  fontSize='small' />
              </Box>
              <Box>
                <Typography variant='caption' color='text.secondary'>
                  Fecha de carga
                </Typography>
                <Typography variant='body1' fontWeight='medium'>
                  {new Date(rowData?.createdAt).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    timeZone: 'America/La_Paz',
                  })}
                </Typography>
              </Box>
            </Box>

            {/* Delivery Date */}
            <Box sx={{ display: 'flex', alignItems: 'center', width: 'calc(50% - 8px)' }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: 'warning.50',
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 1.5,
                }}>
                <CalendarIcon  fontSize='small' />
              </Box>
              <Box>
                <Typography variant='caption' color='text.secondary'>
                  Fecha de entrega
                </Typography>
                <Typography variant='body1' fontWeight='medium'>
                  {new Date(rowData?.deliveryDate).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    timeZone: 'America/La_Paz',
                  })}
                </Typography>
              </Box>
            </Box>

            {/* Origin */}
            <Box sx={{ display: 'flex', alignItems: 'center', width: 'calc(50% - 8px)' }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: 'primary.50',
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 1.5,
                }}>
                <LocationIcon  fontSize='small' />
              </Box>
              <Box>
                <Typography variant='caption' color='text.secondary'>
                  Origen
                </Typography>
                <Typography variant='body1' fontWeight='medium'>
                  {rowData?.origin}
                </Typography>
              </Box>
            </Box>

            {/* Destination */}
            <Box sx={{ display: 'flex', alignItems: 'center', width: 'calc(50% - 8px)' }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: 'success.50',
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 1.5,
                }}>
                <LocationIcon  fontSize='small' />
              </Box>
              <Box>
                <Typography variant='caption' color='text.secondary'>
                  Destino
                </Typography>
                <Typography variant='body1' fontWeight='medium'>
                  {rowData?.destination}
                </Typography>
              </Box>
            </Box>

            {/* Load Type */}
            <Box sx={{ display: 'flex', alignItems: 'center', width: 'calc(50% - 8px)' }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: 'secondary.50',
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 1.5,
                }}>
                <ShippingIcon  fontSize='small' />
              </Box>
              <Box>
                <Typography variant='caption' color='text.secondary'>
                  Tipo de carga
                </Typography>
                <Typography variant='body1' fontWeight='medium'>
                  {rowData?.loadType}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', width: 'calc(50% - 8px)' }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: 'secondary.50',
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 1.5,
                }}>
                <ShippingIcon  fontSize='small' />
              </Box>
              <Box>
                <Typography variant='caption' color='text.secondary'>
                  Tipo de camión
                </Typography>
                <Typography variant='body1' fontWeight='medium'>
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
            borderRadius: 1,
            p: 1,
            mb: 1,
          }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography fontSize={16} color='success.main'>
              Mejor oferta actual:
            </Typography>
            <Typography fontSize={16} color='success.main' fontWeight='bold'>
              {' '}
              {getBestOffer} Bs
            </Typography>
          </Box>
        </Paper>

        {/* Offers Section */}
        <Box>
          <Typography variant='h6' fontWeight='semibold' sx={{ mb: 2 }}>
            Ofertas
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {data?.map((oferta) => (
              <Card
                key={oferta._id}
                elevation={1}
                sx={{
                  p: 1,
                  borderRadius: ``,
                  '&:hover': {
                    elevation: 3,
                    transition: 'box-shadow 0.2s',
                  },
                }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 1,
                  }}>
                  <Typography variant='body1' fontWeight='medium'>
                    Oferta #{oferta._id.slice(-6)}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                  }}>
                  <Typography variant='h6' fontWeight='bold'>
                    {oferta?.amount} Bs
                  </Typography>
                  {Number(oferta?.amount) > getBestOffer && (
                    <Typography variant='body2' color='error.main' fontWeight='medium'>
                      {`+${Number(oferta?.amount) - getBestOffer} Bs vs mejor oferta`}
                    </Typography>
                  )}
                </Box>

                <Box
                  sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                    <WhatsAppLink
                      countryCode='591'
                      //@ts-ignore
                      phone={extractPhoneFromConversationId(oferta?.conversationData?.id as any)}
                      onlyIcon={false}
                    />
                  </Box>

                  <Button
                    size='small'
                    color='primary'
                    endIcon={<ExpandMoreIcon />}
                    onClick={() => handleMessageClick(oferta._id)}
                    sx={{ textTransform: 'none' }}>
                    {expandedMessageId === oferta._id ? 'Ocultar mensaje' : 'Ver mensaje'}
                  </Button>
                </Box>
                {/* Message Content - Show when expanded */}
                {expandedMessageId === oferta._id && (
                  <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant='body2' color='text.secondary'>
                      {getMessageContent(oferta.message)}
                    </Typography>
                  </Box>
                )}
              </Card>
            ))}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
