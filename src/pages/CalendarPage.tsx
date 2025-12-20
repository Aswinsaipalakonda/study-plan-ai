import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { mockSessions } from '@/data/mockData';
import { subjectColors } from '@/data/mockData';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startingDay = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const getSessionsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return mockSessions.filter(s => s.date === dateStr);
  };

  const days = [];
  for (let i = 0; i < startingDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i));
  }

  const selectedDateSessions = selectedDate ? getSessionsForDate(selectedDate) : [];

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Study Calendar</h1>
            <p className="text-muted-foreground mt-1">
              View and manage your study schedule
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <CalendarIcon className="h-4 w-4" />
              Sync to Google
            </Button>
            <Button asChild className="gap-2">
              <Link to="/create-plan">
                <Plus className="h-4 w-4" />
                Add Session
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </CardTitle>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={prevMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={nextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Days of Week */}
              <div className="grid grid-cols-7 mb-2">
                {daysOfWeek.map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {days.map((date, index) => {
                  if (!date) {
                    return <div key={`empty-${index}`} className="aspect-square" />;
                  }

                  const sessions = getSessionsForDate(date);
                  const isToday = date.toDateString() === new Date().toDateString();
                  const isSelected = selectedDate?.toDateString() === date.toDateString();

                  return (
                    <button
                      key={date.toISOString()}
                      onClick={() => setSelectedDate(date)}
                      className={cn(
                        'aspect-square p-1 rounded-lg text-sm transition-all hover:bg-muted relative',
                        isToday && 'bg-primary/10 font-bold',
                        isSelected && 'ring-2 ring-primary bg-primary/5'
                      )}
                    >
                      <span className={cn(
                        'absolute top-1 left-2',
                        isToday && 'text-primary'
                      )}>
                        {date.getDate()}
                      </span>
                      {sessions.length > 0 && (
                        <div className="absolute bottom-1 left-1 right-1 flex gap-0.5 justify-center">
                          {sessions.slice(0, 3).map((session, i) => (
                            <div
                              key={i}
                              className={cn(
                                'h-1.5 w-1.5 rounded-full',
                                session.status === 'completed' ? 'bg-success' :
                                session.status === 'in-progress' ? 'bg-warning' :
                                'bg-primary'
                              )}
                            />
                          ))}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Selected Day Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {selectedDate
                  ? selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
                  : 'Select a Date'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDate ? (
                selectedDateSessions.length > 0 ? (
                  <div className="space-y-3">
                    {selectedDateSessions.map((session) => (
                      <div
                        key={session.id}
                        className="p-3 rounded-lg bg-muted/50 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{session.startTime}</span>
                          <Badge className={subjectColors[session.subject] || 'bg-muted'}>
                            {session.subject}
                          </Badge>
                        </div>
                        <p className="font-semibold">{session.title}</p>
                        <p className="text-sm text-muted-foreground">{session.topic}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{session.duration} min</span>
                          {session.technique && (
                            <>
                              <span>•</span>
                              <span>{session.technique}</span>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No sessions scheduled</p>
                    <Button asChild size="sm">
                      <Link to="/create-plan">Add Session</Link>
                    </Button>
                  </div>
                )
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Click on a date to view sessions
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
