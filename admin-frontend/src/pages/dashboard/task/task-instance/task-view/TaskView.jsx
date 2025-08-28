import { useState, useEffect } from 'react';

import { Grid } from '@mui/material';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { getTaskInstanceById } from 'src/service/task-instance.js';

import DefaultTaskView from './common/DefaultTaskView.jsx';
import BookingTaskView from './interpark/BookingTaskView.jsx';

const getDetailView = (taskInstance) => {
  switch (taskInstance.taskName) {
    case 'common/hello': {
      return <BookingTaskView taskInstance={taskInstance} />;
    }
    default: {
      return <DefaultTaskView taskInstance={taskInstance} />;
    }
  }
};

const TaskView = ({ id }) => {
  const [taskInstance, setTaskInstance] = useState(null);

  useEffect(() => {
    (async () => {
      setTaskInstance(await getTaskInstanceById(id));
    })();
    const intervalId = setInterval(async () => {
      setTaskInstance(await getTaskInstanceById(id));
    }, 3000);
    return () => clearInterval(intervalId);
  }, [id]);

  if (!taskInstance) {
    return undefined;
  }

  return (
    <>
      <Grid container spacing={1}>
        <Grid size={4}>
          <Typography component="span" variant="body1" color="text.secondary" sx={{ mr: 1 }}>
            ID:
          </Typography>
          <Typography component="span" variant="body1" color="text">
            {taskInstance.id}
          </Typography>
        </Grid>
        <Grid size={4}>
          <Typography component="span" variant="body1" color="text.secondary" sx={{ mr: 1 }}>
            Node:
          </Typography>
          <Typography component="span" variant="body1" color="text">
            {taskInstance.nodeId}
          </Typography>
        </Grid>
        <Grid size={4}>
          <Typography component="span" variant="body1" color="text.secondary" sx={{ mr: 1 }}>
            Name:
          </Typography>
          <Typography component="span" variant="body1" color="text">
            {taskInstance.name}
          </Typography>
        </Grid>
        <Grid size={4}>
          <Typography component="span" variant="body1" color="text.secondary" sx={{ mr: 1 }}>
            Task name:
          </Typography>
          <Typography component="span" variant="body1" color="text">
            {taskInstance.taskName}
          </Typography>
        </Grid>
        <Grid size={4}>
          <Typography component="span" variant="body1" color="text.secondary" sx={{ mr: 1 }}>
            Status:
          </Typography>
          <Typography component="span" variant="body1" color="text">
            {taskInstance.status}
          </Typography>
        </Grid>
        <Grid size={4}>
          <Typography component="span" variant="body1" color="text.secondary" sx={{ mr: 1 }}>
            Remarks:
          </Typography>
          <Typography component="span" variant="body1" color="text">
            {taskInstance.remarks}
          </Typography>
        </Grid>
      </Grid>
      <Divider sx={{ my: 1 }} />
      {getDetailView(taskInstance)}
    </>
  );
};

export default TaskView;
