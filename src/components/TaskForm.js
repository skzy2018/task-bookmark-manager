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
  Box
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

const TaskForm = ({ addTask }) => {
  const initialState = {
    title: '',
    description: '',
    deadline: '',
    status: 'not_started',
    urls: []
  };

  const [formData, setFormData] = useState(initialState);
  const [urlInput, setUrlInput] = useState('');
  const [urlTitleInput, setUrlTitleInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Check if form should be expanded whenever title changes
  useEffect(() => {
    if (formData.title.trim() !== '') {
      setIsExpanded(true);
    }
  }, [formData.title]);

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
    
    addTask(formData);
    setFormData(initialState);
    setIsExpanded(false);
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
      urls: [...formData.urls, newUrl]
    });
    
    setUrlInput('');
    setUrlTitleInput('');
  };

  const handleRemoveUrl = (index) => {
    const newUrls = [...formData.urls];
    newUrls.splice(index, 1);
    setFormData({
      ...formData,
      urls: newUrls
    });
  };

  return (
    <div className="task-form">
      <Typography variant="h6" component="h2" gutterBottom>
        Add New Task
      </Typography>
      
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
              placeholder="Enter task title"
            />
          </Grid>
          
          {isExpanded && (
            <>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
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
                  value={formData.deadline}
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
                    value={formData.status}
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
              
              {formData.urls.length > 0 && (
                <Grid item xs={12}>
                  <Box sx={{ mt: 1 }}>
                    {formData.urls.map((url, index) => (
                      <Box key={index} sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        mb: 1,
                        p: 1,
                        borderRadius: 1,
                        bgcolor: 'rgba(0, 0, 0, 0.05)'
                      }}>
                        <Typography variant="body2" sx={{ flex: 1, overflowWrap: 'break-word' }}>
                          {url.title} - {url.url}
                        </Typography>
                        <Button 
                          size="small" 
                          color="error" 
                          onClick={() => handleRemoveUrl(index)}
                        >
                          Remove
                        </Button>
                      </Box>
                    ))}
                  </Box>
                </Grid>
              )}
            </>
          )}
          
          <Grid item xs={12}>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              fullWidth
              disabled={!formData.title.trim()}
            >
              Add Task
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default TaskForm;
