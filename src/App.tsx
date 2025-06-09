import React, { useState, useEffect } from 'react';
import { 
  Container, 
  TextField, 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  Grid,
  CircularProgress,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Snackbar,
  Chip,
  Paper,
  CardMedia,
  CardActions
} from '@mui/material';
import axios from 'axios';
import LinkIcon from '@mui/icons-material/Link';
import logo from './assets/logo.png';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import GitHubIcon from '@mui/icons-material/GitHub';
import FacebookIcon from '@mui/icons-material/Facebook';
import LanguageIcon from '@mui/icons-material/Language';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/.netlify/functions' 
  : 'http://localhost:5000/api';

interface NewsItem {
  title: string;
  author: string;
  date: string;
  source: string;
  url: string;
  imageUrl: string | null;
}

interface ApiError {
  response?: {
    data?: {
      error?: string;
    };
  };
  request?: any;
  message: string;
}

// Define the theme colors
const theme = {
  background: '#1a1a1a',
  surface: '#242424',
  surfaceHover: '#2a2a2a',
  primary: '#90caf9',
  text: {
    primary: '#ffffff',
    secondary: '#b0b0b0',
    disabled: '#707070'
  },
  divider: '#333333',
  scrollbar: {
    track: 'transparent',
    thumb: '#404040',
    thumbHover: '#505050'
  }
};

function App() {
  const [url, setUrl] = useState('');
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterKeyword, setFilterKeyword] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date');
  const [error, setError] = useState<string>('');
  const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  const newsUrls = [
    {
      name: 'ABS-CBN News',
      url: 'https://news.abs-cbn.com/',
      description: 'Philippine news and current events'
    },
    {
      name: 'GMA News',
      url: 'https://www.gmanetwork.com/news/',
      description: 'Latest Philippine news'
    },
    {
      name: 'Rappler',
      url: 'https://www.rappler.com/',
      description: 'Philippine news and analysis'
    },
    {
      name: 'Inquirer',
      url: 'https://newsinfo.inquirer.net/',
      description: 'Philippine daily news'
    },
    {
      name: 'Manila Bulletin',
      url: 'https://mb.com.ph/',
      description: 'Philippine news and information'
    },
    {
      name: 'CNN Philippines',
      url: 'https://www.cnnphilippines.com/',
      description: 'Latest news and updates'
    }
  ];

  useEffect(() => {
    // Check if server is running
    const checkServer = async () => {
      try {
        console.log('Checking server status...');
        const response = await axios.get(`${API_BASE_URL}/test`);
        console.log('Server response:', response.data);
        setServerStatus('online');
      } catch (error) {
        console.error('Server check failed:', error);
        setServerStatus('offline');
        setError('Server is offline. Please make sure the server is running on port 5000.');
      }
    };

    checkServer();
  }, []);

  const scrapeNews = async () => {
    if (!url) {
      setError('Please enter a website URL');
      return;
    }

    setLoading(true);
    setError('');
    setNews([]);

    try {
      console.log('Sending request to:', `${API_BASE_URL}/scrape`);
      const response = await axios.post(`${API_BASE_URL}/scrape`, { url });
      console.log('Received response:', response.data);
      
      if (response.data.news && response.data.news.length > 0) {
        setNews(response.data.news);
      } else {
        setError('No news articles found. The website might use a different structure or dynamic loading.');
      }
    } catch (error) {
      console.error('Error scraping news:', error);
      const apiError = error as ApiError;
      
      if (apiError.response) {
        console.error('Error response:', apiError.response.data);
        setError(apiError.response.data?.error || 'Failed to scrape news. Please try a different URL.');
      } else if (apiError.request) {
        setError('No response from server. Please make sure the server is running.');
      } else {
        setError('Error: ' + apiError.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedNews = news
    .filter(item => 
      filterKeyword === '' || 
      item.title.toLowerCase().includes(filterKeyword.toLowerCase()) ||
      item.author.toLowerCase().includes(filterKeyword.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return a.title.localeCompare(b.title);
    });

  return (
    <Box sx={{ 
      bgcolor: theme.background,
      minHeight: '100vh',
      color: theme.text.primary
    }}>
      <Container 
        maxWidth={false} 
        sx={{ 
          py: 4,
          px: { xs: 2, sm: 3 },
          maxWidth: '100% !important',
          height: '100vh',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ 
          mb: 4, 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between'
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            flexDirection: { xs: 'column', sm: 'row' }
          }}>
            <img 
              src={logo} 
              alt="News Scraper Logo" 
              style={{ 
                height: '40px',
                width: 'auto'
              }} 
            />
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                fontWeight: 500,
                fontSize: { xs: '1.2rem', sm: '1.5rem' },
                color: theme.text.secondary,
                letterSpacing: '0.5px',
                textAlign: { xs: 'center', sm: 'left' }
              }}
            >
              News Scraper
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {serverStatus === 'online' && (
              <Chip 
                label="Server Online" 
                color="success" 
                size="small"
                sx={{ 
                  height: '24px',
                  bgcolor: 'rgba(76, 175, 80, 0.1)',
                  color: '#4caf50',
                  border: '1px solid rgba(76, 175, 80, 0.3)',
                  '& .MuiChip-label': {
                    px: 1
                  }
                }}
              />
            )}
            {/* Social Icons */}
            <Tooltip title="GitHub">
              <IconButton
                component="a"
                href="https://github.com/ChanCrits"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: theme.text.secondary }}
              >
                <GitHubIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Facebook">
              <IconButton
                component="a"
                href="https://www.facebook.com/chistyan.kan"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: theme.text.secondary }}
              >
                <FacebookIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Portfolio">
              <IconButton
                component="a"
                href="https://christianearlsiong.netlify.app/?fbclid=IwY2xjawKyRXFleHRuA2FlbQIxMABicmlkETFsWjc4WXlGSzNsdTFRRHNwAR6RhHBFCgyD0U95wIGUiqFpOk_e7nE2QkH3W_JgclTkZbNvEJKJTS32wTQHKg_aem_l9rgYTRvYNy4wGT1zSzLCw"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: theme.text.secondary }}
              >
                <LanguageIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {serverStatus === 'checking' && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress sx={{ color: theme.primary }} />
          </Box>
        )}

        {serverStatus === 'offline' && (
          <Alert severity="error" sx={{ mb: 4 }}>
            Server is offline. Please make sure the server is running on port 5000.
          </Alert>
        )}

        <Box sx={{ 
          display: 'flex', 
          gap: { xs: 2, sm: 3, md: 4 },
          flexDirection: { xs: 'column', md: 'row' },
          height: 'calc(100vh - 100px)',
          overflow: 'hidden'
        }}>
          {/* Left Column - Input Fields */}
          <Box sx={{ 
            width: { xs: '100%', md: '300px' }, 
            flexShrink: 0,
            height: '100%',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <Paper sx={{ 
              p: { xs: 2, sm: 3 },
              height: '100%',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              bgcolor: theme.surface,
              '& .MuiInputBase-root': {
                bgcolor: theme.background,
                '&:hover': {
                  bgcolor: theme.surfaceHover,
                },
                '& .MuiInputBase-input': {
                  color: theme.text.primary,
                }
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.divider,
              },
              '& .MuiInputLabel-root': {
                color: theme.text.secondary,
              },
              '& .MuiSelect-icon': {
                color: theme.text.secondary,
              },
              '& .MuiSelect-select': {
                color: theme.text.primary,
              },
              '& .MuiMenuItem-root': {
                color: theme.text.primary,
                '&:hover': {
                  bgcolor: theme.surfaceHover,
                }
              }
            }}>
              <Box sx={{ flexShrink: 0 }}>
                <Typography variant="h6" gutterBottom sx={{ color: theme.text.primary }}>
                  Scrape Settings
                </Typography>
                <TextField
                  fullWidth
                  label="Enter Website URL"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="e.g., https://news.abs-cbn.com/"
                  disabled={loading}
                  sx={{ mb: 2 }}
                />
                <Button
                  variant="contained"
                  onClick={scrapeNews}
                  disabled={loading || !url}
                  fullWidth
                  sx={{ 
                    mb: 2,
                    bgcolor: theme.primary,
                    color: theme.background,
                    '&:hover': {
                      bgcolor: theme.primary,
                      opacity: 0.9
                    }
                  }}
                >
                  {loading ? <CircularProgress size={24} sx={{ color: theme.background }} /> : 'Scrape News'}
                </Button>
                <TextField
                  fullWidth
                  label="Filter by keyword"
                  value={filterKeyword}
                  onChange={(e) => setFilterKeyword(e.target.value)}
                  placeholder="e.g., technology, politics"
                  disabled={news.length === 0}
                  sx={{ mb: 2 }}
                />
                <FormControl fullWidth disabled={news.length === 0}>
                  <InputLabel>Sort by</InputLabel>
                  <Select
                    value={sortBy}
                    label="Sort by"
                    onChange={(e) => setSortBy(e.target.value as 'date' | 'title')}
                  >
                    <MenuItem value="date">Date</MenuItem>
                    <MenuItem value="title">Title</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* Current URL Display - Always Visible */}
              <Box sx={{ 
                mt: 3, 
                pt: 2, 
                borderTop: '1px solid',
                borderColor: theme.divider,
                flexShrink: 0
              }}>
                <Typography 
                  variant="subtitle2" 
                  color="text.secondary" 
                  gutterBottom
                  sx={{ color: theme.text.secondary }}
                >
                  Current URL:
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    wordBreak: 'break-all',
                    bgcolor: theme.background,
                    p: 1,
                    borderRadius: 1,
                    fontSize: '0.875rem',
                    minHeight: '24px',
                    color: url ? theme.text.primary : theme.text.disabled
                  }}
                >
                  {url || 'No URL entered'}
                </Typography>
              </Box>

              {/* Other Available URLs */}
              <Box sx={{ 
                mt: 3, 
                pt: 2, 
                borderTop: '1px solid',
                borderColor: theme.divider,
                flexGrow: 1,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <Typography 
                  variant="subtitle2" 
                  color="text.secondary" 
                  gutterBottom
                  sx={{ color: theme.text.secondary }}
                >
                  Other Available URLs:
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: 1.5,
                  overflowY: 'auto',
                  pr: 1,
                  '&::-webkit-scrollbar': {
                    width: '8px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: theme.scrollbar.track,
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: theme.scrollbar.thumb,
                    borderRadius: '4px',
                    '&:hover': {
                      background: theme.scrollbar.thumbHover,
                    },
                  },
                }}>
                  {newsUrls.map((item, index) => (
                    <Box 
                      key={index}
                      sx={{ 
                        bgcolor: theme.background,
                        p: 1.5,
                        borderRadius: 1,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        '&:hover': {
                          bgcolor: theme.surfaceHover,
                          transform: 'translateX(4px)'
                        }
                      }}
                      onClick={() => setUrl(item.url)}
                    >
                      <Typography 
                        variant="subtitle2" 
                        sx={{ 
                          color: theme.primary,
                          mb: 0.5
                        }}
                      >
                        {item.name}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: theme.text.secondary,
                          fontSize: '0.75rem',
                          mb: 0.5
                        }}
                      >
                        {item.description}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: theme.text.disabled,
                          wordBreak: 'break-all'
                        }}
                      >
                        {item.url}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Paper>
          </Box>

          {/* Right Column - Results */}
          <Box sx={{ 
            flexGrow: 1,
            minWidth: 0,
            height: '100%',
            overflow: 'auto',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: theme.scrollbar.track,
            },
            '&::-webkit-scrollbar-thumb': {
              background: theme.scrollbar.thumb,
              borderRadius: '4px',
              '&:hover': {
                background: theme.scrollbar.thumbHover,
              },
            },
          }}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress sx={{ color: theme.primary }} />
              </Box>
            )}

            {!loading && news.length > 0 && (
              <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ maxWidth: '1200px', mx: 'auto' }}>
                {filteredAndSortedNews.map((item, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      transition: 'transform 0.2s',
                      bgcolor: theme.surface,
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 3,
                        bgcolor: theme.surfaceHover
                      }
                    }}>
                      {item.imageUrl && (
                        <CardMedia
                          component="img"
                          height="140"
                          image={item.imageUrl}
                          alt={item.title}
                          sx={{ 
                            objectFit: 'cover',
                            height: { xs: '120px', sm: '140px' }
                          }}
                        />
                      )}
                      <CardContent sx={{ 
                        flexGrow: 1,
                        p: { xs: 2, sm: 3 }
                      }}>
                        <Typography 
                          gutterBottom 
                          variant="h6" 
                          component="h2"
                          sx={{
                            fontSize: { xs: '1rem', sm: '1.1rem' },
                            lineHeight: 1.3,
                            color: theme.text.primary
                          }}
                        >
                          {item.title}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: theme.text.secondary,
                            mb: 1 
                          }}
                        >
                          By {item.author}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: theme.text.secondary,
                            fontSize: { xs: '0.875rem', sm: '0.9rem' } 
                          }}
                        >
                          {item.date}
                        </Typography>
                      </CardContent>
                      <CardActions sx={{ p: { xs: 1.5, sm: 2 } }}>
                        <Button 
                          size="small" 
                          startIcon={<LinkIcon />}
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ 
                            color: theme.primary,
                            '&:hover': {
                              bgcolor: 'transparent',
                              opacity: 0.8
                            }
                          }}
                        >
                          Read More
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Box>

        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError('')}
        >
          <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}

export default App;
