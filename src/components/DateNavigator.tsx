import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface DateNavigatorProps {
  selectedDate: Date;
  onPreviousDay: () => void;
  onNextDay: () => void;
  onToday: () => void;
}

export function DateNavigator({
  selectedDate,
  onPreviousDay,
  onNextDay,
  onToday
}: DateNavigatorProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200">
      <div className="flex items-center gap-2">
        <button
          onClick={onPreviousDay}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          ←
        </button>
        <button
          onClick={onNextDay}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          →
        </button>
        <button
          onClick={onToday}
          className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-100 transition-colors"
        >
          Today
        </button>
      </div>
      <h2 className="text-lg font-semibold">
        {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
      </h2>
    </div>
  );
}