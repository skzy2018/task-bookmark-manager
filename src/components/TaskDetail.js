import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { 
  Delete as DeleteIcon,
  Add as AddIcon,
  Link as LinkIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';

const TaskDetail = ({ task, updateTask, deleteTask, onCancel }) => {
  const [formData, setFormData] = useState(task);
  const [urlInput, setUrlInput] = useState('');
  const [urlTitleInput, setUrlTitleInput] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  useEffect(() => {
    setFormData(task);
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    
    updateTask(formData);
  };

  // Function to fetch page title from URL
  const fetchPageTitle = async (url) => {
    return new Promise((resolve) => {
      // Create a new tab to fetch the title
      chrome.tabs.create({ url, active: false }, (tab) => {
        // We'll listen for the tab to complete loading
        const listener = (tabId, changeInfo) => {
          // Once the tab is complete and it's our tab
          if (tabId === tab.id && changeInfo.status === 'complete') {
            // Get the tab's title
            chrome.tabs.get(tab.id, (tabInfo) => {
              // Remove the listener and close the tab
              chrome.tabs.onUpdated.removeListener(listener);
              chrome.tabs.remove(tab.id);
              // Return the title
              resolve(tabInfo.title || url);
            });
          }
        };
        
        // Add the listener
        chrome.tabs.onUpdated.addListener(listener);
      });
    });
  };

  const handleAddUrl = async () => {
    if (!urlInput.trim()) return;
    
    // Basic URL validation
    let url = urlInput;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    let title = urlTitleInput.trim();
    
    // If no title is provided, try to fetch it from the page
    if (!title) {
      try {
        title = await fetchPageTitle(url);
      } catch (error) {
        console.error("Error fetching page title:", error);
        title = url; // Fallback to URL if error
      }
    }
    
    const newUrl = {
      url,
      title: title
    };
    
    setFormData({
      ...formData,
      urls: [...(formData.urls || []), newUrl]
    });
    
    setUrlInput('');
    setUrlTitleInput('');
  };

  const handleRemoveUrl = (index) => {
    const newUrls = [...(formData.urls || [])];
    newUrls.splice(index, 1);
    setFormData({
      ...formData,
      urls: newUrls
    });
  };

  const handleDeleteConfirmOpen = () => {
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirmClose = () => {
    setDeleteConfirmOpen(false);
  };

  const handleDeleteTask = () => {
    deleteTask(task.id);
    setDeleteConfirmOpen(false);
  };

  return (
    <div>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton 
          onClick={onCancel}
          color="primary"
          sx={{ mr: 1 }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" component="h2">
          Edit Task
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={handleDeleteConfirmOpen}
        >
          Delete
        </Button>
      </Box>
      
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Task Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              variant="outlined"
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              multiline
              rows={3}
              variant="outlined"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Deadline"
              name="deadline"
              type="date"
              value={formData.deadline || ''}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                name="status"
                value={formData.status || 'not_started'}
                onChange={handleChange}
                label="Status"
              >
                <MenuItem value="not_started">Not Started</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Related URLs
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={5}>
                <TextField
                  fullWidth
                  label="URL"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  variant="outlined"
                  placeholder="https://example.com"
                />
              </Grid>
              
              <Grid item xs={12} sm={5}>
                <TextField
                  fullWidth
                  label="URL Title (optional)"
                  value={urlTitleInput}
                  onChange={(e) => setUrlTitleInput(e.target.value)}
                  variant="outlined"
                  placeholder="Example Website"
                />
              </Grid>
              
              <Grid item xs={12} sm={2}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={handleAddUrl}
                  startIcon={<AddIcon />}
                  sx={{ height: '100%' }}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </Grid>
          
          {formData.urls && formData.urls.length > 0 && (
            <Grid item xs={12}>
              <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {formData.urls.map((url, index) => (
                  <React.Fragment key={index}>
                    {index > 0 && <Divider component="li" />}
                    <ListItem>
                      <ListItemText
                        primary={url.title}
                        secondary={
                          <a href={url.url} target="_blank" rel="noopener noreferrer">
                            {url.url}
                          </a>
                        }
                        secondaryTypographyProps={{
                          sx: { wordBreak: 'break-all' }
                        }}
                      />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveUrl(index)}>
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>
            </Grid>
          )}
          
          <Grid item xs={12}>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              fullWidth
              disabled={!formData.title.trim()}
              sx={{ mt: 2 }}
            >
              Save Changes
            </Button>
          </Grid>
        </Grid>
      </form>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleDeleteConfirmClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete this task?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete "{task.title}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteConfirmClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteTask} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TaskDetail;
