import React, { useState } from 'react';
import { 
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  List, 
  ListItem, 
  ListItemText, 
  Typography, 
  Chip,
  Box,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  AccessTime as AccessTimeIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  DoNotDisturb as DoNotDisturbIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

const TaskList = ({ tasks, onSelectTask, onUpdateTask, onDeleteTask }) => {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  if (tasks.length === 0) {
    return (
      <Typography variant="body1" align="center" sx={{ py: 4 }}>
        No tasks added yet. Add a task to get started!
      </Typography>
    );
  }

  // Get next status in the cycle: not_started -> in_progress -> completed -> not_started
  const getNextStatus = (currentStatus) => {
    switch(currentStatus) {
      case 'not_started':
        return 'in_progress';
      case 'in_progress':
        return 'completed';
      case 'completed':
        return 'not_started';
      default:
        return 'not_started';
    }
  };

  // Handle status change
  const handleStatusChange = (e, task) => {
    e.stopPropagation(); // Prevent task selection
    const nextStatus = getNextStatus(task.status);
    if (onUpdateTask) {
      onUpdateTask({
        ...task,
        status: nextStatus
      });
    }
  };
  
  // Open delete confirmation dialog
  const handleDeleteConfirmOpen = (e, task) => {
    e.stopPropagation(); // Prevent task selection
    setTaskToDelete(task);
    setDeleteConfirmOpen(true);
  };

  // Close delete confirmation dialog
  const handleDeleteConfirmClose = () => {
    setDeleteConfirmOpen(false);
    setTaskToDelete(null);
  };

  // Handle task deletion
  const handleDeleteTask = () => {
    if (taskToDelete && onDeleteTask) {
      onDeleteTask(taskToDelete.id);
      setDeleteConfirmOpen(false);
      setTaskToDelete(null);
    }
  };

  // Get status display info
  const getStatusInfo = (status) => {
    switch(status) {
      case 'completed':
        return { 
          label: 'Completed', 
          color: 'success',
          icon: <CheckCircleIcon fontSize="small" />
        };
      case 'in_progress':
        return { 
          label: 'In Progress', 
          color: 'primary',
          icon: <AccessTimeIcon fontSize="small" />
        };
      case 'not_started':
      default:
        return { 
          label: 'Not Started', 
          color: 'default',
          icon: <DoNotDisturbIcon fontSize="small" />
        };
    }
  };

  // Check if deadline is upcoming (within 3 days), past, or far
  const getDeadlineStatus = (deadline) => {
    if (!deadline) return null;
    
    const deadlineDate = new Date(deadline);
    const currentDate = new Date();
    const diffTime = deadlineDate - currentDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return {
        class: 'deadline-past',
        icon: <ScheduleIcon fontSize="small" color="error" />,
        label: 'Overdue'
      };
    } else if (diffDays <= 3) {
      return {
        class: 'deadline-upcoming',
        icon: <ScheduleIcon fontSize="small" color="warning" />,
        label: 'Due soon'
      };
    } else {
      return {
        class: 'deadline-far',
        icon: <ScheduleIcon fontSize="small" color="success" />,
        label: `Due in ${diffDays} days`
      };
    }
  };

  return (
    <div className="task-list">
      <Typography variant="h6" component="h2" gutterBottom>
        Your Tasks
      </Typography>
      
      <List sx={{ width: '100%' }}>
        {tasks.map((task, index) => {
          const statusInfo = getStatusInfo(task.status);
          const deadlineInfo = task.deadline ? getDeadlineStatus(task.deadline) : null;
          
          return (
            <React.Fragment key={task.id}>
              {index > 0 && <Divider component="li" />}
              <ListItem 
                alignItems="flex-start"
                button 
                onClick={() => onSelectTask(task)}
                className={`task-item ${task.status === 'completed' ? 'completed-task' : ''}`}
                sx={{ 
                  borderRadius: 1,
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="subtitle1" component="span">
                        {task.title}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Chip 
                          size="small"
                          label={statusInfo.label}
                          color={statusInfo.color}
                          icon={statusInfo.icon}
                          className="status-badge"
                          onClick={(e) => handleStatusChange(e, task)}
                          clickable
                          sx={{ cursor: 'pointer', mr: 1 }}
                        />
                        <Tooltip title="Delete task">
                          <IconButton 
                            edge="end" 
                            aria-label="delete" 
                            size="small"
                            color="error"
                            onClick={(e) => handleDeleteConfirmOpen(e, task)}
                            sx={{ ml: 0.5 }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  }
                  secondary={
                    <React.Fragment>
                      {task.description && (
                        <Typography
                          variant="body2"
                          color="text.primary"
                          sx={{ 
                            display: '-webkit-box',
                            overflow: 'hidden',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 1,
                            mt: 0.5,
                            mb: 1
                          }}
                        >
                          {task.description}
                        </Typography>
                      )}
                      
                      {deadlineInfo && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          {deadlineInfo.icon}
                          <Typography 
                            variant="caption" 
                            color="text.secondary"
                            sx={{ ml: 0.5 }}
                          >
                            {task.deadline} - {deadlineInfo.label}
                          </Typography>
                        </Box>
                      )}
                      
                      {task.urls && task.urls.length > 0 && (
                        <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                          {task.urls.length} URL{task.urls.length !== 1 ? 's' : ''} attached
                        </Typography>
                      )}
                    </React.Fragment>
                  }
                />
              </ListItem>
            </React.Fragment>
          );
        })}
      </List>
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
            Are you sure you want to delete "{taskToDelete?.title}"? This action cannot be undone.
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

export default TaskList;
