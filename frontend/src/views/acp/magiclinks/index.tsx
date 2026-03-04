import { useEffect } from 'react';
import {
  Alert, Box, Button, IconButton, LinearProgress, Paper, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Typography,
} from '@mui/material';
import { Delete as DeleteIcon, VpnKey as VpnKeyIcon } from '@mui/icons-material';
import { useMagicLinks } from '../../../hooks/modules/useMagicLinks';

export default function MagicLinksPage() {
  const { magicLinks, isLoading, error, fetchMagicLinks, generateMagicLink, removeMagicLink } = useMagicLinks();

  useEffect(() => {
    fetchMagicLinks();
  }, []);

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h5" fontWeight={600}>
          Magic Links
        </Typography>
        <Button
          variant="contained"
          startIcon={<VpnKeyIcon />}
          onClick={() => generateMagicLink()}
        >
          Generate Magic Link
        </Button>
      </Box>

      {isLoading && <LinearProgress sx={{ mb: 2 }} />}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Token</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!isLoading && magicLinks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  <Typography variant="body2" color="text.secondary">
                    No magic links yet. Generate one above.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              magicLinks.map((link) => (
                <TableRow key={link.id}>
                  <TableCell>
                    <Typography variant="body2" fontFamily="monospace">
                      {link.reportingToken}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {new Date(link.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="error"
                      onClick={() => removeMagicLink(link.id)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
