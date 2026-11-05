import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ChevronDown } from 'lucide-react';
import { categories, weekdays } from '../content';
import {
  addDays,
  calendarDays,
  dateKey,
  formatDate,
  monthLabel,
  parseDate,
} from '../utils/dates';
import { CategoryDot, RoutineHeading } from './routineUi';
import classes from '../routineClasses';

export default function CalendarView({
  month,
  onMonthChange,
  occurrences,
  onSelectDay,
  onChooseMonth,
  onBack,
  onAgenda,
  connected,
}) {
  const today = dateKey();
  const [focusedDate, setFocusedDate] = useState(today);
  const cells = useRef(new Map());
  const days = calendarDays(month);
  const weekCount = days.length / 7;
  const byDay = Map.groupBy(occurrences, task => task.occurrenceDate);
  const focusDay = days.includes(focusedDate)
    ? focusedDate
    : days.find(day => parseDate(day).getMonth() === month.getMonth());

  function moveMonth(amount) {
    onMonthChange(
      new Date(month.getFullYear(), month.getMonth() + amount, 1, 12)
    );
  }

  function navigateDay(event, day) {
    const index = days.indexOf(day);
    const offsets = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -7,
      ArrowDown: 7,
      Home: -(index % 7),
      End: 6 - (index % 7),
    };
    if (!(event.key in offsets)) return;
    event.preventDefault();
    const target = addDays(day, offsets[event.key]);
    setFocusedDate(target);
    if (!days.includes(target)) onMonthChange(parseDate(target));
    requestAnimationFrame(() => cells.current.get(target)?.focus());
  }

  return (
    <div className={classes.calendarView}>
      <RoutineHeading
        compact
        title='Calendário'
        description='Visualize suas tarefas por dia.'
        onBack={onBack}
      />
      <div className={classes.calendarToolbar}>
        <button
          type='button'
          className={classes.calendarControl}
          onClick={() => {
            onMonthChange(new Date());
            setFocusedDate(today);
          }}
        >
          Hoje
        </button>
        <button
          type='button'
          className={classes.calendarControl}
          aria-label='Mês anterior'
          onClick={() => moveMonth(-1)}
        >
          <ArrowLeft size={18} />
        </button>
        <button
          type='button'
          className={classes.calendarControl}
          aria-label='Próximo mês'
          onClick={() => moveMonth(1)}
        >
          <ArrowRight size={18} />
        </button>
        <button
          type='button'
          className={`${classes.calendarControl} ${classes.monthControl}`}
          onClick={onChooseMonth}
          aria-haspopup='dialog'
        >
          <span aria-live='polite'>{monthLabel(month)}</span>
          <ChevronDown size={16} aria-hidden='true' />
        </button>
      </div>
      <div
        className={classes.monthGrid}
        role='grid'
        aria-label={monthLabel(month)}
        style={{ '--calendar-weeks': weekCount }}
      >
        <div className={classes.weekdayRow} role='row'>
          {weekdays.map(day => (
            <span key={day.id} role='columnheader' aria-label={day.label}>
              {day.short}
            </span>
          ))}
        </div>
        {Array.from({ length: weekCount }, (_, week) => (
          <div className={classes.calendarWeek} key={week} role='row'>
            {days.slice(week * 7, week * 7 + 7).map(day => {
              const tasks = byDay.get(day) ?? [];
              const taskCategories = categories.filter(category =>
                tasks.some(task => task.category === category.id)
              );
              const outside = parseDate(day).getMonth() !== month.getMonth();
              return (
                <button
                  ref={element => {
                    if (element) cells.current.set(day, element);
                    else cells.current.delete(day);
                  }}
                  type='button'
                  role='gridcell'
                  key={day}
                  tabIndex={focusDay === day ? 0 : -1}
                  aria-current={day === today ? 'date' : undefined}
                  aria-label={`${formatDate(day, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}, ${tasks.length} ${tasks.length === 1 ? 'tarefa' : 'tarefas'}`}
                  className={`${classes.calendarDay} ${outside ? classes.outsideDay : ''} ${day === today ? classes.today : ''}`}
                  onClick={() => {
                    setFocusedDate(day);
                    onSelectDay(day);
                  }}
                  onFocus={() => setFocusedDate(day)}
                  onKeyDown={event => navigateDay(event, day)}
                >
                  <span className={classes.dayNumber}>
                    {parseDate(day).getDate()}
                  </span>
                  <span className={classes.dayMarkers}>
                    {taskCategories.map(category => (
                      <CategoryDot key={category.id} category={category.id} />
                    ))}
                  </span>
                </button>
              );
            })}
          </div>
        ))}
      </div>
      <div className={classes.calendarFooter}>
        <div
          className={classes.calendarLegend}
          aria-label='Categorias das tarefas'
        >
          {categories.map(category => (
            <span key={category.id}>
              <CategoryDot category={category.id} />
              {category.label}
            </span>
          ))}
        </div>
        <button type='button' className={classes.textAction} onClick={onAgenda}>
          {connected ? 'Gerenciar agenda' : 'Conectar agenda'}
        </button>
      </div>
    </div>
  );
}
