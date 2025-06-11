import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  CircularProgress,
  IconButton,
  Paper,
  Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface ArticleViewProps {
  open: boolean;
  onClose: () => void;
  article: {
    title: string;
    author: string;
    date: string;
    content: string;
    imageUrl: string | null;
    source: string;
  } | null;
  loading: boolean;
  error: string | null;
}

const ArticleView: React.FC<ArticleViewProps> = ({
  open,
  onClose,
  article,
  loading,
  error
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: '#1a1a1a',
          color: '#ffffff',
          minHeight: '80vh'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid #333'
      }}>
        <Typography variant="h6" component="div">
          {article?.title || 'Article'}
        </Typography>
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ mt: 2 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : article ? (
          <Box>
            {article.imageUrl && (
              <Box sx={{ mb: 3, textAlign: 'center' }}>
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '400px',
                    objectFit: 'contain'
                  }}
                />
              </Box>
            )}
            
            <Paper sx={{ p: 3, mb: 3, bgcolor: '#242424' }}>
              <Typography variant="h5" gutterBottom>
                {article.title}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, mb: 2, color: '#b0b0b0' }}>
                <Typography variant="body2">
                  By {article.author}
                </Typography>
                <Typography variant="body2">
                  • {article.date}
                </Typography>
                <Typography variant="body2">
                  • {article.source}
                </Typography>
              </Box>
              
              <Divider sx={{ my: 2, borderColor: '#333' }} />
              
              <Typography
                variant="body1"
                sx={{
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.8,
                  color: '#e0e0e0'
                }}
              >
                {article.content}
              </Typography>
            </Paper>
          </Box>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default ArticleView; 