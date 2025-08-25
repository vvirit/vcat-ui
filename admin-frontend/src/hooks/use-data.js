import { useState, useEffect } from 'react';

export function useServerData(fetcher, initialData) {

  const [data, setData] = useState(initialData);

  useEffect(() => {
    fetcher().then(setData);
  }, [fetcher]);

  return data;
}
