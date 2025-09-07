import { useState } from 'react';

import { Grid } from '@mui/material';
import Typography from '@mui/material/Typography';

import TabPanel from 'src/components/tab-panel/index.jsx';
import DataTable from 'src/components/vcat/VDataTable.jsx';

const queueWorkersColumns = [
  {
    key: 'id',
    dataIndex: 'workerId',
    label: 'ID',
    width: 100,
  },
  {
    key: 'processCount',
    dataIndex: 'processCount',
    label: 'Process Count',
    width: 128,
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
    key: 'queueNo',
    dataIndex: 'queueNo',
    label: 'Rank',
    width: 80,
  },
  {
    key: 'totalQueueNo',
    dataIndex: 'totalQueueNo',
    label: 'Total Rank',
    width: 130,
  },
  {
    key: 'message',
    dataIndex: 'message',
    label: 'Message',
    width: 260,
  },
  {
    key: 'errorMessage',
    dataIndex: 'errorMessage',
    label: 'Error Message',
  },
];

const bookingWorkersColumns = [
  {
    key: 'id',
    dataIndex: 'workerId',
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
    key: 'message',
    dataIndex: 'message',
    label: 'Message',
    width: 240,
  },
  {
    key: 'errorMessage',
    dataIndex: 'errorMessage',
    label: 'Error Message',
  },
];

const BookingTaskView = ({ taskInstance }) => {
  const state = JSON.parse(taskInstance.state);

  console.log(state);
  const resultItems = taskInstance.results.map((it) => JSON.parse(it.data));

  const [pagination, setPagination] = useState({
    pageNumber: 0,
    pageSize: 10,
  });

  const data = {
    perform: '2515621',
    threadCount: 10,
    accountCount: 100,
    processingCount: 10,
    finishedCount: 10,
    failedCount: 1,
    maxQueueNo: 3000,
    minQueueNo: 20,
    totalQueueNo: 5000,
    threads: [
      {
        id: 1,
        status: 'RUNNING',
        account: 'xxx@163.com',
        queueNo: 1513,
        queueId: 1095655,
        updateTime: '2023-05-01 12:00:00',
        message: '403',
      },
      {
        id: 2,
        status: 'WAITING',
        account: 'xxx@163.com',
        queueNo: 1513,
        queueId: 1095655,
        updateTime: '2023-05-01 12:00:00',
      },
      {
        id: 3,
        status: 'WAITING',
        account: 'xxx@163.com',
        queueNo: 1513,
        queueId: 1095655,
        updateTime: '2023-05-01 12:00:00',
      },
      {
        id: 4,
        status: 'WAITING',
        account: 'xxx@163.com',
        queueNo: 1513,
        queueId: 1095655,
        updateTime: '2023-05-01 12:00:00',
      },
      {
        id: 5,
        status: 'WAITING',
        account: 'xxx@163.com',
        queueNo: 1513,
        queueId: 1095655,
        updateTime: '2023-05-01 12:00:00',
      },
      {
        id: 6,
        status: 'WAITING',
        account: 'xxx@163.com',
        queueNo: 1513,
        queueId: 1095655,
        updateTime: '2023-05-01 12:00:00',
      },
      {
        id: 7,
        status: 'WAITING',
        account: 'xxx@163.com',
        queueNo: 1513,
        updateTime: '2023-05-01 12:00:00',
      },
      {
        id: 8,
        status: 'WAITING',
        account: 'xxx@163.com',
        queueNo: 1513,
        updateTime: '2023-05-01 12:00:00',
      },
      {
        id: 9,
        status: 'WAITING',
        account: 'xxx@163.com',
        queueNo: 1513,
        updateTime: '2023-05-01 12:00:00',
      },
      {
        id: 10,
        status: 'WAITING',
        account: 'xxx@163.com',
        queueNo: 1513,
        updateTime: '2023-05-01 12:00:00',
      },
      {
        id: 11,
        status: 'WAITING',
        account: 'xxx@163.com',
        queueNo: 1513,
        updateTime: '2023-05-01 12:00:00',
      },
      {
        id: 12,
        status: 'WAITING',
        account: 'xxx@163.com',
        queueNo: 1513,
        updateTime: '2023-05-01 12:00:00',
      },
      {
        id: 13,
        status: 'WAITING',
        account: 'xxx@163.com',
        queueNo: 1513,
        updateTime: '2023-05-01 12:00:00',
      },
      {
        id: 14,
        status: 'WAITING',
        account: 'xxx@163.com',
        queueNo: 1513,
        updateTime: '2023-05-01 12:00:00',
      },
      {
        id: 15,
        status: 'WAITING',
        account: 'xxx@163.com',
        queueNo: 1513,
        updateTime: '2023-05-01 12:00:00',
      },
      {
        id: 16,
        status: 'WAITING',
        account: 'xxx@163.com',
        queueNo: 1513,
        updateTime: '2023-05-01 12:00:00',
      },
      {
        id: 17,
        status: 'WAITING',
        account: 'xxx@163.com',
        queueNo: 1513,
        updateTime: '2023-05-01 12:00:00',
      },
    ],
  };

  const threadList = data.threads.slice(
    pagination.page * pagination.pageSize,
    pagination.page * pagination.pageSize + pagination.pageSize
  );

  return (
    <>
      <Grid container spacing={1}>
        <Grid size={4}>
          <Typography component="span" variant="body1" color="text.secondary" sx={{ mr: 1 }}>
            Perform:
          </Typography>
          <Typography component="span" variant="body1" color="text">
            {data.perform}
          </Typography>
        </Grid>
        <Grid size={4}>
          <Typography component="span" variant="body1" color="text.secondary" sx={{ mr: 1 }}>
            Thread count:
          </Typography>
          <Typography component="span" variant="body1" color="text">
            {data.threadCount}
          </Typography>
        </Grid>
        <Grid size={4}>
          <Typography component="span" variant="body1" color="text.secondary" sx={{ mr: 1 }}>
            Account count:
          </Typography>
          <Typography component="span" variant="body1" color="text">
            {data.accountCount}
          </Typography>
        </Grid>
        <Grid size={4}>
          <Typography component="span" variant="body1" color="text.secondary" sx={{ mr: 1 }}>
            Processing count:
          </Typography>
          <Typography component="span" variant="body1" color="text">
            {data.processingCount}
          </Typography>
        </Grid>
        <Grid size={4}>
          <Typography component="span" variant="body1" color="text.secondary" sx={{ mr: 1 }}>
            Finished count:
          </Typography>
          <Typography component="span" variant="body1" color="text">
            {data.finishedCount}
          </Typography>
        </Grid>
        <Grid size={4}>
          <Typography component="span" variant="body1" color="text.secondary" sx={{ mr: 1 }}>
            Failed count:
          </Typography>
          <Typography component="span" variant="body1" color="text">
            {data.failedCount}
          </Typography>
        </Grid>
        <Grid size={4}>
          <Typography component="span" variant="body1" color="text.secondary" sx={{ mr: 1 }}>
            Min queue number:
          </Typography>
          <Typography component="span" variant="body1" color="text">
            {data.minQueueNo}
          </Typography>
        </Grid>
        <Grid size={4}>
          <Typography component="span" variant="body1" color="text.secondary" sx={{ mr: 1 }}>
            Max queue number:
          </Typography>
          <Typography component="span" variant="body1" color="text">
            {data.maxQueueNo}
          </Typography>
        </Grid>
        <Grid size={4}>
          <Typography component="span" variant="body1" color="text.secondary" sx={{ mr: 1 }}>
            Total queue number:
          </Typography>
          <Typography component="span" variant="body1" color="text">
            {data.totalQueueNo}
          </Typography>
        </Grid>
      </Grid>
      <TabPanel
        items={[
          {
            key: 'queue-workers',
            label: 'Queue Workers',
            children: (
              <DataTable
                title="Interpark account groups"
                columns={queueWorkersColumns}
                fullData={state.queueWorkersInfo}
                onFetchData={async (p) => {
                  setPagination(p);
                }}
                rowId="id"
                hideTopBar
                size="small"
                maxHeight={420}
              />
            ),
          },
          {
            key: 'booking-workers',
            label: 'Booking Workers',
            children: (
              <DataTable
                title="Interpark account groups"
                columns={bookingWorkersColumns}
                fullData={state.bookingWorkersInfo}
                onFetchData={async (p) => {
                  setPagination(p);
                }}
                rowId="id"
                hideTopBar
                size="small"
                maxHeight={420}
              />
            ),
          },
        ]}
      />
    </>
  );
};

export default BookingTaskView;
