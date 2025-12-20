import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Sparkles, Calendar, Clock, BookOpen, Target, Loader2, Check, X } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { mockUser } from '@/data/mockData';

const steps = [
  { id: 1, title: 'Basic Info', icon: BookOpen },
  { id: 2, title: 'Coverage', icon: Target },
  { id: 3, title: 'Preferences', icon: Clock },
  { id: 4, title: 'Review', icon: Sparkles },
];

const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'History', 'Literature', 'Computer Science', 'Economics'];
const techniques = ['Pomodoro Technique', 'Spaced Repetition', 'Active Recall', 'Practice Problems'];
const durations = [
  { value: 25, label: '25 min', name: 'Pomodoro' },
  { value: 45, label: '45 min', name: 'Standard' },
  { value: 90, label: '90 min', name: 'Deep Work' },
];

export default function CreatePlan() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    subjects: [] as string[],
    goal: '',
    deadline: '',
    knowledgeLevel: 'intermediate',
    topics: [] as string[],
    newTopic: '',
    weeklyHours: mockUser.weeklyHours || 15,
    techniques: [] as string[],
    sessionLength: mockUser.preferredDuration || 45,
    includeBreaks: true,
  });

  const handleSubjectToggle = (subject: string) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject],
    }));
  };

  const handleTechniqueToggle = (technique: string) => {
    setFormData(prev => ({
      ...prev,
      techniques: prev.techniques.includes(technique)
        ? prev.techniques.filter(t => t !== technique)
        : [...prev.techniques, technique],
    }));
  };

  const handleAddTopic = () => {
    if (formData.newTopic.trim()) {
      setFormData(prev => ({
        ...prev,
        topics: [...prev.topics, prev.newTopic.trim()],
        newTopic: '',
      }));
    }
  };

  const handleRemoveTopic = (topic: string) => {
    setFormData(prev => ({
      ...prev,
      topics: prev.topics.filter(t => t !== topic),
    }));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsGenerating(false);
    navigate('/plans');
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.title.trim() && formData.subjects.length > 0;
      case 2:
        return formData.topics.length > 0;
      case 3:
        return formData.techniques.length > 0;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Plan Title</Label>
              <Input
                id="title"
                placeholder="e.g., Final Exam Preparation"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div className="space-y-3">
              <Label>Subjects</Label>
              <div className="flex flex-wrap gap-2">
                {subjects.map((subject) => (
                  <Badge
                    key={subject}
                    variant={formData.subjects.includes(subject) ? 'default' : 'outline'}
                    className={cn(
                      'cursor-pointer transition-all hover:scale-105',
                      formData.subjects.includes(subject) && 'shadow-soft'
                    )}
                    onClick={() => handleSubjectToggle(subject)}
                  >
                    {subject}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="goal">Goal / Purpose</Label>
              <Textarea
                id="goal"
                placeholder="What do you want to achieve with this study plan?"
                value={formData.goal}
                onChange={(e) => setFormData(prev => ({ ...prev, goal: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">Exam / Deadline Date (Optional)</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label>Current Knowledge Level</Label>
              <RadioGroup
                value={formData.knowledgeLevel}
                onValueChange={(value) => setFormData(prev => ({ ...prev, knowledgeLevel: value }))}
                className="grid grid-cols-3 gap-3"
              >
                {['beginner', 'intermediate', 'advanced'].map((level) => (
                  <Label
                    key={level}
                    htmlFor={level}
                    className={cn(
                      'flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all',
                      formData.knowledgeLevel === level
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <RadioGroupItem value={level} id={level} className="sr-only" />
                    <span className="capitalize font-medium">{level}</span>
                  </Label>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label>Topics to Cover</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a topic..."
                  value={formData.newTopic}
                  onChange={(e) => setFormData(prev => ({ ...prev, newTopic: e.target.value }))}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTopic())}
                />
                <Button type="button" onClick={handleAddTopic}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2 min-h-[40px]">
                {formData.topics.map((topic) => (
                  <Badge key={topic} variant="secondary" className="gap-1 pr-1">
                    {topic}
                    <button
                      onClick={() => handleRemoveTopic(topic)}
                      className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Available Hours per Week</Label>
                <span className="text-sm font-medium">{formData.weeklyHours} hours</span>
              </div>
              <input
                type="range"
                min="5"
                max="40"
                value={formData.weeklyHours}
                onChange={(e) => setFormData(prev => ({ ...prev, weeklyHours: parseInt(e.target.value) }))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>5 hours</span>
                <span>40 hours</span>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label>Study Techniques</Label>
              <div className="grid grid-cols-2 gap-3">
                {techniques.map((technique) => (
                  <Label
                    key={technique}
                    className={cn(
                      'flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all',
                      formData.techniques.includes(technique)
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <Checkbox
                      checked={formData.techniques.includes(technique)}
                      onCheckedChange={() => handleTechniqueToggle(technique)}
                    />
                    <span className="font-medium">{technique}</span>
                  </Label>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label>Preferred Session Length</Label>
              <RadioGroup
                value={formData.sessionLength.toString()}
                onValueChange={(value) => setFormData(prev => ({ ...prev, sessionLength: parseInt(value) }))}
                className="grid grid-cols-3 gap-3"
              >
                {durations.map((duration) => (
                  <Label
                    key={duration.value}
                    htmlFor={`duration-${duration.value}`}
                    className={cn(
                      'flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all',
                      formData.sessionLength === duration.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <RadioGroupItem value={duration.value.toString()} id={`duration-${duration.value}`} className="sr-only" />
                    <span className="font-medium">{duration.label}</span>
                    <span className="text-xs text-muted-foreground">{duration.name}</span>
                  </Label>
                ))}
              </RadioGroup>
            </div>

            <Label className="flex items-center gap-3 p-4 rounded-lg border cursor-pointer">
              <Checkbox
                checked={formData.includeBreaks}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, includeBreaks: !!checked }))}
              />
              <div>
                <span className="font-medium">Include Breaks</span>
                <p className="text-sm text-muted-foreground">Add 5-minute breaks between sessions</p>
              </div>
            </Label>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="grid gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Plan Title</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold">{formData.title}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Subjects</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {formData.subjects.map((subject) => (
                      <Badge key={subject}>{subject}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Topics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {formData.topics.map((topic) => (
                      <Badge key={topic} variant="secondary">{topic}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Weekly Hours</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-semibold">{formData.weeklyHours} hours</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Session Length</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-semibold">{formData.sessionLength} minutes</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Techniques</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {formData.techniques.map((technique) => (
                      <Badge key={technique} variant="outline">{technique}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (isGenerating) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
          <div className="relative">
            <div className="h-24 w-24 rounded-full gradient-primary animate-pulse" />
            <Sparkles className="absolute inset-0 m-auto h-10 w-10 text-primary-foreground animate-bounce" />
          </div>
          <h2 className="mt-8 text-2xl font-bold">Creating Your Study Plan</h2>
          <p className="mt-2 text-muted-foreground text-center max-w-md">
            Our AI is analyzing your preferences and creating a personalized study schedule...
          </p>
          <div className="mt-6 w-64">
            <Progress value={66} className="h-2" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto animate-fade-in">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" className="mb-4 -ml-2" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Create Study Plan</h1>
          <p className="text-muted-foreground mt-1">
            Let AI help you create a personalized study schedule
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={cn(
                    'flex items-center justify-center h-10 w-10 rounded-full border-2 transition-all',
                    currentStep >= step.id
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-muted text-muted-foreground'
                  )}
                >
                  {currentStep > step.id ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <step.icon className="h-5 w-5" />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      'h-0.5 w-12 sm:w-20 mx-2',
                      currentStep > step.id ? 'bg-primary' : 'bg-muted'
                    )}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm">
            {steps.map((step) => (
              <span
                key={step.id}
                className={cn(
                  'hidden sm:block',
                  currentStep >= step.id ? 'text-foreground font-medium' : 'text-muted-foreground'
                )}
              >
                {step.title}
              </span>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{steps[currentStep - 1].title}</CardTitle>
            <CardDescription>
              Step {currentStep} of {steps.length}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(prev => prev - 1)}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          
          {currentStep < steps.length ? (
            <Button
              onClick={() => setCurrentStep(prev => prev + 1)}
              disabled={!canProceed()}
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleGenerate}
              className="gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Generate My Study Plan
            </Button>
          )}
        </div>
      </div>
    </Layout>
  );
}
