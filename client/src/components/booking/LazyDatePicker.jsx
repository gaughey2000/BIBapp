import { Suspense, lazy } from 'react';
import { LoadingState } from '../ui/LoadingSpinner';

// Lazy load the heavy DayPicker component
const DayPicker = lazy(() => import("react-day-picker").then(module => ({ default: module.DayPicker })));

export default function LazyDatePicker(props) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <LoadingState message="Loading calendar..." size="md" />
      </div>
    }>
      <DayPicker {...props} />
    </Suspense>
  );
}