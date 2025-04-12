
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Check, 
  Bell,
  CalendarDays
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';

const ScheduleCheckInPage = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string>('');
  const [upcomingCheckIns, setUpcomingCheckIns] = useState<Array<{date: Date, time: string}>>([]);
  
  const timeSlots = [
    '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
    '06:00 PM', '07:00 PM', '08:00 PM'
  ];
  
  const handleSchedule = () => {
    if (!date || !time) {
      toast.error("Please select both a date and time for your check-in");
      return;
    }
    
    setUpcomingCheckIns([...upcomingCheckIns, { date, time }]);
    setDate(undefined);
    setTime('');
    toast.success("Check-in scheduled successfully!");
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-calm text-transparent bg-clip-text">Schedule Check-in</h1>
        <p className="text-slate-600">Regular check-ins help you maintain mental wellness</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
        <Card className="glass-card hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-mind-blue" />
              Select Date & Time
            </CardTitle>
            <CardDescription>
              Choose when you'd like to have your next wellness check-in
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal mb-4 ${!date ? 'text-muted-foreground' : ''}`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <h3 className="mb-2 font-medium text-sm">Select Time</h3>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((slot) => (
                    <Button
                      key={slot}
                      variant={time === slot ? "default" : "outline"}
                      className={`${time === slot ? 'bg-mind-blue hover:bg-mind-blue/90' : ''}`}
                      onClick={() => setTime(slot)}
                    >
                      {slot}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full bg-mind-green hover:bg-mind-green/90" 
              disabled={!date || !time}
              onClick={handleSchedule}
            >
              <Check className="mr-2 h-4 w-4" />
              Schedule Check-in
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="glass-card hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-mind-purple" />
              Upcoming Check-ins
            </CardTitle>
            <CardDescription>
              Your scheduled wellness sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingCheckIns.length > 0 ? (
              <div className="space-y-4">
                {upcomingCheckIns.map((checkIn, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-white/50 rounded-lg border border-slate-200">
                    <div className="p-2 rounded-full bg-mind-purple/20">
                      <Bell className="h-5 w-5 text-mind-purple" />
                    </div>
                    <div>
                      <p className="font-medium">{format(checkIn.date, 'EEEE, MMMM d')}</p>
                      <div className="flex items-center text-slate-500 text-sm">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{checkIn.time}</span>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="ml-auto text-slate-500"
                      onClick={() => {
                        setUpcomingCheckIns(upcomingCheckIns.filter((_, i) => i !== index));
                        toast("Check-in canceled");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500">
                <CalendarDays className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                <p>No upcoming check-ins</p>
                <p className="text-sm mt-1">Schedule your first check-in to get started</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ScheduleCheckInPage;
