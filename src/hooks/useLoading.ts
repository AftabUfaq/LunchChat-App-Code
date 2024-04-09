import { useDispatch } from 'react-redux';
import { showError, startLoading, stopLoading } from '../store/actions';

const useLoading = (): {
  asyncLoading: <T>(callback: () => Promise<T>) => Promise<T | undefined>;
} => {
  const dispatch = useDispatch();

  const asyncLoading = async <T>(
    callback: () => Promise<T>
  ): Promise<T | undefined> => {
    try {
      dispatch(startLoading());
      const result = await callback();
      dispatch(stopLoading());
      return result;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'An unknown error occurred';
      dispatch(showError(message));
      dispatch(stopLoading());
    }
  };

  return { asyncLoading };
};

export default useLoading;
