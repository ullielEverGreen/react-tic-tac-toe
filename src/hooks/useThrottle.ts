import _ from 'lodash'
import { useRef, useEffect } from 'react';

function useThrottle(callback: () => void, delay = 200) {
  const throttledCallback = useRef(_.throttle(callback, delay)).current;

  useEffect(() => {
    return () => {
      throttledCallback.cancel();
    };
  }, [throttledCallback]);

  return throttledCallback;
}

export default useThrottle;