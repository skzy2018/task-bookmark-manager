import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, IconButton, Tooltip } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import TaskDetail from './TaskDetail';

const App = () => {
  // State
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  // Load tasks from storage on component mount
  useEffect(() => {
    chrome.storage.local.get(['tasks'], (result) => {
      if (result.tasks) {
        setTasks(result.tasks);
      }
    });
  }, []);

  // Save tasks to storage whenever tasks change
  useEffect(() => {
    chrome.storage.local.set({ tasks });
  }, [tasks]);

  // Add a new task
  const addTask = (task) => {
    const newTasks = [...tasks, { ...task, id: Date.now().toString() }];
    setTasks(newTasks);
  };

  // Update a task
  const updateTask = (updatedTask) => {
    const newTasks = tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    );
    setTasks(newTasks);
    
    // Create bookmarks if task is completed
    if (updatedTask.status === 'completed' && updatedTask.urls && updatedTask.urls.length > 0) {
      createBookmarks(updatedTask);
    }
  };

  // Delete a task
  const deleteTask = (taskId) => {
    const newTasks = tasks.filter(task => task.id !== taskId);
    setTasks(newTasks);
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask(null);
    }
  };

  // Handle task selection
  const handleTaskSelect = (task) => {
    setSelectedTask(task);
  };

  // Clear selected task
  const handleClearSelection = () => {
    setSelectedTask(null);
  };

  // Create bookmarks for completed task
  const createBookmarks = (task) => {
    // Create a folder with task title and date
    const folderName = `${task.title} - ${new Date().toLocaleDateString()}`;
    
    chrome.bookmarks.create({ title: folderName }, (folder) => {
      // Add each URL to the folder
      task.urls.forEach(url => {
        chrome.bookmarks.create({
          parentId: folder.id,
          title: url.title || url.url,
          url: url.url
        });
      });
    });
  };

  // Handle navigation to Google search page
  const navigateToGoogle = () => {
    window.open('https://www.google.com/', '_blank');
  };

  return (
    <Container className="container">
      <Box sx={{ position: 'relative', my: 4 }}>
        <Tooltip title="Go to Google search page">
          <IconButton 
            color="primary" 
            sx={{ position: 'absolute', top: 0, left: 0 }}
            onClick={navigateToGoogle}
          >
            <HomeIcon />
          </IconButton>
        </Tooltip>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Task & Bookmark Manager
        </Typography>
        
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <TaskForm addTask={addTask} />
        </Paper>
        
        {selectedTask ? (
          <Paper elevation={3} sx={{ p: 3 }}>
            <TaskDetail 
              task={selectedTask} 
              updateTask={updateTask} 
              deleteTask={deleteTask}
              onCancel={handleClearSelection}
            />
          </Paper>
        ) : (
          <Paper elevation={3} sx={{ p: 3 }}>
            <TaskList 
              tasks={tasks} 
              onSelectTask={handleTaskSelect}
              onUpdateTask={updateTask}
            />
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default App;
