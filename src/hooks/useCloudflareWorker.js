import { useCallback, useEffect, useState } from 'react';

const workerBaseUrl =
  import.meta.env.VITE_WORKER_BASE_URL?.replace(/\/$/, '') ?? '';

const buildEndpoint = (path) =>
  workerBaseUrl ? `${workerBaseUrl}${path}` : path;

const INITIAL_STATE = {
  status: 'idle',
  data: null,
  error: null,
};

const useCloudflareWorker = () => {
  const [state, setState] = useState(INITIAL_STATE);

  const fetchMessage = useCallback(
    async (signal) => {
      setState((prev) => ({
        ...prev,
        status: 'loading',
        error: null,
      }));

      try {
        const response = await fetch(buildEndpoint('/api/worker/message'), {
          signal,
          headers: {
            Accept: 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Worker responded with ${response.status}`);
        }

        const payload = await response.json();
        setState({
          status: 'success',
          data: payload,
          error: null,
        });
      } catch (error) {
        if (signal?.aborted) {
          return;
        }
        setState({
          status: 'error',
          data: null,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    },
    [],
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchMessage(controller.signal);
    return () => controller.abort();
  }, [fetchMessage]);

  const refresh = useCallback(() => {
    fetchMessage();
  }, [fetchMessage]);

  return {
    data: state.data,
    status: state.status,
    error: state.error,
    refresh,
  };
};

export default useCloudflareWorker;

