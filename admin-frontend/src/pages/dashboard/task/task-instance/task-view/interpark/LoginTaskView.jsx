import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';

import VDataTable from 'src/components/vcat/VDataTable.jsx';

const workersColumns = [
  {
    key: 'id',
    dataIndex: 'id',
    label: 'ID',
    width: 100,
  },
  {
    key: 'email',
    dataIndex: 'email',
    label: 'Email',
    width: 220,
  },
  {
    key: 'status',
    dataIndex: 'status',
    label: 'Status',
    width: 100,
  },
  {
    key: 'errorMessage',
    dataIndex: 'errorMessage',
    label: 'Error Message',
  },
];

const resultsColumns = [
  {
    key: 'email',
    dataIndex: 'email',
    label: 'Email',
    width: 220,
  },
  {
    key: 'message',
    dataIndex: 'message',
    label: 'Message',
  },
];

const LoginTaskView = ({ taskInstance }) => {
  const state = JSON.parse(taskInstance.state);
  const resultItems = taskInstance.results.map((it) => JSON.parse(it.data));

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
        gap: 2,
        width: '100%',
      }}
    >
      <div>
        <Typography
          variant="overline"
          color="text.secondary"
          sx={{ letterSpacing: 1, fontWeight: 700, display: 'block', marginBottom: 1 }}
        >
          Workers
        </Typography>
        <VDataTable
          columns={workersColumns}
          fullData={state.workersInfo}
          data={{
            list: state.workersInfo,
          }}
          hideTopBar
          rowId="id"
          size="small"
        />
      </div>
      <div>
        <Typography
          variant="overline"
          color="text.secondary"
          sx={{ letterSpacing: 1, fontWeight: 700, display: 'block', marginBottom: 1 }}
        >
          Results
        </Typography>
        <VDataTable columns={resultsColumns} fullData={resultItems} hideTopBar size="small" />
      </div>
    </Box>
  );
};

export default LoginTaskView;
