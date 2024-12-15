import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../app/store';

// Exporta un hook personalizado que use AppDispatch
export const useAppDispatch: () => AppDispatch = useDispatch;
