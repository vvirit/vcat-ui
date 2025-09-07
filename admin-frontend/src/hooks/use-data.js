import { useState, useEffect } from 'react';

export function useServerData(fetcher, initialData) {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    fetcher().then(setData);
  }, []);

  return data;
}

export function useOnceData({ key, query, initialData }) {

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(initialData);

  useEffect(() => {
    (async () => {
      try {
        const queryData = await query();
        setData(queryData);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return { data, isLoading };
}
