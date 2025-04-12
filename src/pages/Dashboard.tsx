
import React, { useState } from 'react';
import { 
  CalendarDays, 
  LineChart, 
  Smile, 
  Frown, 
  Meh, 
  BarChart, 
  Clock, 
  Calendar, 
  Lightbulb,
  MessageCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Dashboard = () => {
  const [moodData] = useState({
    positive: 65,
    neutral: 20,
    negative: 15,
    streak: 7,
    sessionsThisWeek: 12,
    totalInteractions: 54
  });

  const getMoodColor = (mood: string) => {
    switch(mood) {
      case 'positive': return 'text-mind-green';
      case 'negative': return 'text-mind-pink';
      case 'neutral': return 'text-mind-yellow';
      default: return 'text-mind-blue';
    }
  };

  const getMoodIcon = (mood: string) => {
    switch(mood) {
      case 'positive': return <Smile className="h-5 w-5 text-mind-green" />;
      case 'negative': return <Frown className="h-5 w-5 text-mind-pink" />;
      case 'neutral': return <Meh className="h-5 w-5 text-mind-yellow" />;
      default: return null;
    }
  };

  const recentActivities = [
    { type: 'chat', time: '10:30 AM', title: 'Morning check-in' },
    { type: 'image', time: 'Yesterday', title: 'Mood doodle analysis' },
    { type: 'voice', time: '2 days ago', title: 'Voice journaling session' }
  ];

  const getActivityIcon = (type: string) => {
    switch(type) {
      case 'chat': return <MessageCircle className="h-4 w-4 text-mind-blue" />;
      case 'image': return <ImageIcon className="h-4 w-4 text-mind-purple" />;
      case 'voice': return <MoodActivity className="h-4 w-4 text-mind-green" />;
      default: return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-calm text-transparent bg-clip-text">Your Wellness Dashboard</h1>
        <p className="text-slate-600">Track your emotional journey and mindfulness progress</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="glass-card hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-2">
            <CardDescription>Current Streak</CardDescription>
            <CardTitle className="text-3xl flex items-center gap-2">
              {moodData.streak} days
              <CalendarDays className="h-5 w-5 text-mind-purple" />
            </CardTitle>
          </CardHeader>
        </Card>
        
        <Card className="glass-card hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-2">
            <CardDescription>Sessions This Week</CardDescription>
            <CardTitle className="text-3xl flex items-center gap-2">
              {moodData.sessionsThisWeek}
              <Clock className="h-5 w-5 text-mind-green" />
            </CardTitle>
          </CardHeader>
        </Card>
        
        <Card className="glass-card hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-2">
            <CardDescription>Total Interactions</CardDescription>
            <CardTitle className="text-3xl flex items-center gap-2">
              {moodData.totalInteractions}
              <MessageCircle className="h-5 w-5 text-mind-blue" />
            </CardTitle>
          </CardHeader>
        </Card>
        
        <Card className="glass-card hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-2">
            <CardDescription>Mood Insights</CardDescription>
            <CardTitle className="text-xl flex items-center gap-2">
              <LineChart className="h-5 w-5 text-mind-pink" />
              <span>Improving</span>
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="glass-card hover:shadow-lg transition-all duration-300 lg:col-span-2">
          <CardHeader>
            <CardTitle>Mood Distribution</CardTitle>
            <CardDescription>Your emotional balance this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['positive', 'neutral', 'negative'].map((mood) => (
                <div key={mood} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getMoodIcon(mood)}
                      <span className="capitalize font-medium">{mood}</span>
                    </div>
                    <span className={`font-bold ${getMoodColor(mood)}`}>
                      {moodData[mood as keyof typeof moodData]}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className={`rounded-full h-2 bg-gradient-calm`}
                      style={{width: `${moodData[mood as keyof typeof moodData]}%`}}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Your mindfulness journey</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-0 border-slate-200">
                  <div className="p-2 rounded-full bg-slate-100">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div>
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-sm text-slate-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-card hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-mind-blue" />
              Upcoming Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-slate-500">No upcoming scheduled sessions</p>
              <button className="mt-4 px-4 py-2 bg-mind-blue text-white rounded-md hover:bg-mind-blue/80 transition-colors">
                Schedule a Check-in
              </button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-mind-yellow" />
              Mindfulness Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="p-3 bg-mind-yellow/10 rounded-md border border-mind-yellow/20 text-slate-700">
                "Remember to take three deep breaths whenever you feel overwhelmed. This activates your parasympathetic nervous system."
              </p>
              <p className="text-right">
                <button className="text-mind-blue hover:underline">Get another tip</button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
