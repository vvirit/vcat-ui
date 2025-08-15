import { useState } from 'react';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';

export default function TabPanel({ items }) {
  const [activeKey, setActiveKey] = useState(items.length > 0 ? items[0].key : null);
  return (
    <>
      <Tabs value={activeKey} onChange={(e, value) => {
        setActiveKey(value)
      }}>
        {items.map((item) => (
          <Tab key={item.key} value={item.key} label={item.label} />
        ))}
      </Tabs>
      {items.map((item) => (
        <Box
          key={item.key}
          role="tabpanel"
          id={`panel-${item.key}`}
          aria-labelledby={`tab-${item.key}`}
          hidden={activeKey !== item.key}
          sx={{ p: 2, paddingLeft: 0, paddingRight: 0, paddingBottom: 0 }}
        >
          {item.children}
        </Box>
      ))}
    </>
  );
}
