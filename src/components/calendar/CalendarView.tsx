import { useCallback, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { EventDropArg } from '@fullcalendar/core';
import { format, parseISO } from 'date-fns';
import type { EventClickArg, EventContentArg, DatesSetArg } from '@fullcalendar/core';
import { useStore } from '@/store';
import { useResolvedOccurrences } from '@/hooks/useResolvedOccurrences';
import { Checkbox } from '@/components/ui/checkbox';
import { OccurrenceActionsMenu } from './OccurrenceActionsMenu';
import type { ResolvedOccurrence } from '@/types';
import { getInitials } from '@/lib/colors';

interface VisibleRange {
  start: Date;
  end: Date;
}

function ChoreEventContent({ eventInfo }: { eventInfo: EventContentArg }) {
  const occ = eventInfo.event.extendedProps.occurrence as ResolvedOccurrence;
  const toggleCompletion = useStore((s) => s.toggleCompletion);
  const addAuditEntry = useStore((s) => s.addAuditEntry);
  const actingMemberId = useStore((s) => s.actingMemberId);
  const teamMembers = useStore((s) => s.teamMembers);
  const actor = teamMembers.find((m) => m.id === actingMemberId);

  const handleCheck = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleCompletion(occ.key, occ.template.id, occ.originalDate, actingMemberId);
    addAuditEntry({
      action: occ.completed ? 'uncompleted' : 'completed',
      choreTemplateId: occ.template.id,
      choreName: occ.template.name,
      occurrenceKey: occ.key,
      occurrenceDate: occ.originalDate,
      actorMemberId: actingMemberId,
      actorName: actor?.name ?? null,
    });
  };

  return (
    <div
      className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-xs w-full cursor-pointer select-none ${
        occ.completed ? 'opacity-60' : ''
      }`}
      style={{ backgroundColor: occ.assignee?.color ?? '#6366f1', color: 'white' }}
    >
      <span
        role="checkbox"
        aria-checked={occ.completed}
        onClick={handleCheck}
        className={`shrink-0 h-3.5 w-3.5 rounded-sm border-2 border-white flex items-center justify-center cursor-pointer ${
          occ.completed ? 'bg-white' : 'bg-transparent'
        }`}
      >
        {occ.completed && <span className="text-[8px] font-bold" style={{ color: occ.assignee?.color ?? '#6366f1' }}>✓</span>}
      </span>
      <span className={`truncate flex-1 ${occ.completed ? 'line-through' : ''}`}>
        {occ.template.name}
      </span>
      {occ.assignee && (
        <span
          className="shrink-0 h-4 w-4 rounded-full bg-white/30 flex items-center justify-center text-[9px] font-bold"
          title={occ.assignee.name}
        >
          {getInitials(occ.assignee.name)}
        </span>
      )}
    </div>
  );
}

export function CalendarView() {
  const calendarRef = useRef<FullCalendar>(null);
  const rescheduleOccurrence = useStore((s) => s.rescheduleOccurrence);
  const addAuditEntry = useStore((s) => s.addAuditEntry);

  const today = new Date();
  const [visibleRange, setVisibleRange] = useState<VisibleRange>({
    start: new Date(today.getFullYear(), today.getMonth(), 1),
    end: new Date(today.getFullYear(), today.getMonth() + 1, 0),
  });

  const [activeOccurrence, setActiveOccurrence] = useState<{
    occ: ResolvedOccurrence;
    anchorEl: HTMLElement;
  } | null>(null);

  const occurrences = useResolvedOccurrences(visibleRange.start, visibleRange.end);

  const calendarEvents = occurrences.map((occ) => ({
    id: occ.key,
    title: occ.template.name,
    date: occ.displayDate,
    extendedProps: { occurrence: occ },
    editable: true,
  }));

  const handleDatesSet = useCallback((info: DatesSetArg) => {
    setVisibleRange({ start: info.start, end: info.end });
  }, []);

  const handleEventDrop = useCallback(
    (info: EventDropArg) => {
      const occ = info.event.extendedProps.occurrence as ResolvedOccurrence;
      const newDate = format(info.event.start!, 'yyyy-MM-dd');
      rescheduleOccurrence(occ.key, occ.template.id, occ.originalDate, newDate === occ.originalDate ? null : newDate);
      addAuditEntry({
        action: 'rescheduled',
        choreTemplateId: occ.template.id,
        choreName: occ.template.name,
        occurrenceKey: occ.key,
        occurrenceDate: occ.originalDate,
        metadata: { from: occ.displayDate, to: newDate },
      });
    },
    [rescheduleOccurrence, addAuditEntry]
  );

  const handleEventClick = useCallback((info: EventClickArg) => {
    info.jsEvent.preventDefault();
    const occ = info.event.extendedProps.occurrence as ResolvedOccurrence;
    setActiveOccurrence({ occ, anchorEl: info.el });
  }, []);

  return (
    <div className="h-full p-4 flex flex-col">
      <div className="fc-wrapper flex-1">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={calendarEvents}
          editable={true}
          eventDrop={handleEventDrop}
          eventClick={handleEventClick}
          eventContent={(info) => <ChoreEventContent eventInfo={info} />}
          datesSet={handleDatesSet}
          height="100%"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: '',
          }}
          buttonText={{ today: 'Today' }}
          firstDay={1}
        />
      </div>

      {activeOccurrence && (
        <OccurrenceActionsMenu
          occurrence={activeOccurrence.occ}
          anchorEl={activeOccurrence.anchorEl}
          onClose={() => setActiveOccurrence(null)}
        />
      )}
    </div>
  );
}
