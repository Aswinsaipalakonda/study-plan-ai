import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Clock, Flame, CheckCircle, TrendingUp, ChevronRight, Timer } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { SessionCard } from '@/components/dashboard/SessionCard';
import { WeeklyChart } from '@/components/dashboard/WeeklyChart';
import { ProgressRing } from '@/components/dashboard/ProgressRing';
import { StudyTimer } from '@/components/timer/StudyTimer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockSessions, mockStats, mockUser } from '@/data/mockData';

export default function Dashboard() {
  const [showTimer, setShowTimer] = useState(false);
  const [activeSession, setActiveSession] = useState<typeof mockSessions[0] | null>(null);

  const todaySessions = mockSessions.filter(
    (s) => s.date === new Date().toISOString().split('T')[0]
  );

  const upcomingSessions = mockSessions
    .filter((s) => s.status === 'upcoming')
    .slice(0, 5);

  const handleStartSession = (session: typeof mockSessions[0]) => {
    setActiveSession(session);
    setShowTimer(true);
  };

  const handleQuickSession = () => {
    setActiveSession(null);
    setShowTimer(true);
  };

  return (
    <Layout>
      <div className="space-y-8 animate-fade-in">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome back, {mockUser.name.split(' ')[0]}! 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              You have {todaySessions.length} study sessions scheduled for today.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleQuickSession} className="gap-2">
              <Timer className="h-4 w-4" />
              Quick Session
            </Button>
            <Button asChild className="gap-2">
              <Link to="/create-plan">
                <Plus className="h-4 w-4" />
                Create Plan
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Study Hours This Week"
            value={`${mockStats.totalHoursThisWeek}h`}
            icon={<Clock className="h-6 w-6" />}
            subtitle="+2.5h from last week"
            iconClassName="bg-primary/10 text-primary"
          />
          <StatsCard
            title="Current Streak"
            value={`${mockStats.currentStreak} days`}
            icon={<Flame className="h-6 w-6" />}
            subtitle="Keep it up! 🔥"
            iconClassName="bg-warning/10 text-warning"
          />
          <StatsCard
            title="Sessions Today"
            value={mockStats.sessionsCompletedToday}
            icon={<CheckCircle className="h-6 w-6" />}
            subtitle={`${todaySessions.length - mockStats.sessionsCompletedToday} remaining`}
            iconClassName="bg-success/10 text-success"
          />
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                  <p className="text-3xl font-bold">{mockStats.completionRate}%</p>
                  <p className="text-xs text-muted-foreground">Great progress!</p>
                </div>
                <div className="relative">
                  <ProgressRing progress={mockStats.completionRate} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Today's Sessions */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Today's Sessions</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/calendar" className="gap-1">
                    View Calendar
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {todaySessions.length > 0 ? (
                  todaySessions.map((session) => (
                    <SessionCard
                      key={session.id}
                      session={session}
                      onStart={() => handleStartSession(session)}
                    />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      No sessions scheduled for today.
                    </p>
                    <Button asChild>
                      <Link to="/create-plan">Create a Study Plan</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Weekly Progress Chart */}
            <WeeklyChart data={mockStats.weeklyData} />
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Upcoming This Week */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Upcoming</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/plans" className="gap-1">
                    View All
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-2">
                {upcomingSessions.map((session) => (
                  <SessionCard key={session.id} session={session} compact />
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="gradient-primary text-primary-foreground">
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">Ready to study?</h3>
                  <p className="text-sm opacity-90">
                    Start a quick focus session or create a new study plan.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="secondary" 
                    className="flex-1 bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground border-0"
                    onClick={handleQuickSession}
                  >
                    Start Timer
                  </Button>
                  <Button 
                    asChild 
                    className="flex-1 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                  >
                    <Link to="/create-plan">New Plan</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Timer Modal */}
      {showTimer && (
        <StudyTimer
          subject={activeSession?.subject}
          topic={activeSession?.topic}
          initialDuration={activeSession?.duration ? activeSession.duration * 60 : undefined}
          onComplete={() => setShowTimer(false)}
          onSkip={() => setShowTimer(false)}
          onClose={() => setShowTimer(false)}
        />
      )}
    </Layout>
  );
}
