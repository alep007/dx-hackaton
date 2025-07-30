import { WhatsApp } from '@mui/icons-material';
import { Box, Stack, Typography } from '@mui/material';
import Link from '@mui/material/Link';
import { green } from '@mui/material/colors';

const BASE_WSPP_URL = 'https://wa.me/';

export const WhatsAppLink = ({
  countryCode,
  phone,
  onlyIcon,
  emptyMessage = '-',
  align = 'start',
}) => {
  if (!phone || !countryCode) return <>{emptyMessage}</>;

  const whatsappUrl = `${BASE_WSPP_URL}${phone}`;

  return (
    <Link target='_blank' href={whatsappUrl} underline='none'>
      <Stack direction='row' gap={0.5} color={green[600]}>
        <WhatsApp fontSize='small' />
        {!onlyIcon && (
          <Typography fontWeight={500} fontSize={14} variant='caption'>{`+ ${phone}`}</Typography>
        )}
      </Stack>
    </Link>
  );
};
