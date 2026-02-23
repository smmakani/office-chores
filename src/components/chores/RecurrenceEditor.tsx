import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { RecurrenceRule } from '@/types';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface RecurrenceEditorProps {
  value: RecurrenceRule;
  onChange: (rule: RecurrenceRule) => void;
}

export function RecurrenceEditor({ value, onChange }: RecurrenceEditorProps) {
  const toggleDay = (day: number) => {
    const days = value.daysOfWeek ?? [];
    const next = days.includes(day) ? days.filter((d) => d !== day) : [...days, day].sort();
    onChange({ ...value, daysOfWeek: next });
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1">Recurrence</label>
        <Select
          value={value.frequency}
          onValueChange={(v) =>
            onChange({ frequency: v as RecurrenceRule['frequency'], daysOfWeek: [], dayOfMonth: 1 })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">One-time (no recurrence)</SelectItem>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {value.frequency === 'weekly' && (
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">Repeat on</label>
          <div className="flex gap-1">
            {DAYS.map((day, i) => (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(i)}
                className={cn(
                  'h-8 w-10 rounded text-xs font-medium transition-colors border',
                  (value.daysOfWeek ?? []).includes(i)
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                )}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      )}

      {value.frequency === 'monthly' && (
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Day of month</label>
          <Select
            value={String(value.dayOfMonth ?? 1)}
            onValueChange={(v) => onChange({ ...value, dayOfMonth: Number(v) })}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                <SelectItem key={d} value={String(d)}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {value.frequency !== 'none' && (
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">
            End date <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="date"
            value={value.endDate ?? ''}
            onChange={(e) => onChange({ ...value, endDate: e.target.value || null })}
            className="flex h-9 rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          />
        </div>
      )}
    </div>
  );
}
