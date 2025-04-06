'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/auth-context';
import { Loader2, CheckCircle } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function ProfileCompletePage() {
  const { user, updateUserProfile, refreshUserProfile } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    client_type: 'individual',
    company_name: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  
  // Load initial client data once when component mounts
  useEffect(() => {
    const loadInitialData = async () => {
      if (!initialDataLoaded) {
        try {
          // Refresh user data to make sure we have the latest
          await refreshUserProfile();
          
          if (user) {
            console.log("Setting form data from user:", user);
            setFormData({
              name: user.name || '',
              phone: user.phone || '',
              address: user.address || '',
              client_type: user.client_type || 'individual',
              company_name: user.company_name || '',
            });
          }
          setInitialDataLoaded(true);
        } catch (error) {
          console.error("Error loading user profile data:", error);
          setInitialDataLoaded(true);
        }
      }
    };
    
    loadInitialData();
  }, [user, refreshUserProfile, initialDataLoaded]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleRadioChange = (value: string) => {
    setFormData(prev => ({ ...prev, client_type: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Make sure we have all required fields
      if (!formData.name || !formData.phone || !formData.address || !formData.client_type) {
        toast({
          title: 'Missing Information',
          description: 'Please complete all required fields',
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }
      
      // Check if company name is required
      if (formData.client_type === 'company' && !formData.company_name) {
        toast({
          title: 'Missing Company Name',
          description: 'Please provide your company name',
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }

      console.log('Submitting client data:', formData);
      
      const { success, error } = await updateUserProfile(formData);
      
      if (success) {
        toast({
          title: 'Profile Updated',
          description: 'Your profile has been successfully completed.',
        });
        // Short delay to allow the toast to display
        setTimeout(() => {
          router.push('/clients/dashboard');
        }, 1500);
      } else {
        toast({
          title: 'Update Failed',
          description: error || 'Failed to update profile',
          variant: 'destructive',
        });
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast({
        title: 'Update Failed',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
      setIsSubmitting(false);
    }
  };
  
  const nextStep = () => {
    setCompletedSteps(prev => [...prev, currentStep]);
    setCurrentStep(prev => prev + 1);
  };
  
  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };
  
  const isStepCompleted = (step: number) => completedSteps.includes(step);
  
  // Show loading state while user data is being fetched
  if (!initialDataLoaded || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Loading Profile</CardTitle>
            <CardDescription>
              Please wait while we load your profile information...
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Complete Your Profile</CardTitle>
          <CardDescription>
            Please provide the following information to complete your profile
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <div className={`flex items-center ${currentStep === 1 || isStepCompleted(1) ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-current">
                  {isStepCompleted(1) ? <CheckCircle className="w-5 h-5" /> : 1}
                </div>
                <span className="ml-2 font-medium">Client Type</span>
              </div>
              <div className="border-t-2 border-gray-200 flex-grow mx-4 mt-4"></div>
              <div className={`flex items-center ${currentStep === 2 || isStepCompleted(2) ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-current">
                  {isStepCompleted(2) ? <CheckCircle className="w-5 h-5" /> : 2}
                </div>
                <span className="ml-2 font-medium">Basic Info</span>
              </div>
              <div className="border-t-2 border-gray-200 flex-grow mx-4 mt-4"></div>
              <div className={`flex items-center ${currentStep === 3 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-current">
                  3
                </div>
                <span className="ml-2 font-medium">Confirmation</span>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <Label>Are you an individual or a company?</Label>
                  <RadioGroup 
                    value={formData.client_type} 
                    onValueChange={handleRadioChange}
                    className="mt-2 space-y-2"
                  >
                    <div className="flex items-center space-x-2 rounded-md border p-3">
                      <RadioGroupItem value="individual" id="individual" />
                      <Label htmlFor="individual" className="cursor-pointer">Individual</Label>
                    </div>
                    <div className="flex items-center space-x-2 rounded-md border p-3">
                      <RadioGroupItem value="company" id="company" />
                      <Label htmlFor="company" className="cursor-pointer">Company</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                {formData.client_type === 'company' && (
                  <div>
                    <Label htmlFor="company_name">Company Name</Label>
                    <Input
                      id="company_name"
                      name="company_name"
                      value={formData.company_name}
                      onChange={handleChange}
                      placeholder="Enter your company name"
                      className="mt-1"
                    />
                  </div>
                )}
                
                <div className="flex justify-end">
                  <Button 
                    type="button" 
                    onClick={nextStep}
                    disabled={!formData.client_type || (formData.client_type === 'company' && !formData.company_name)}
                  >
                    Next Step
                  </Button>
                </div>
              </div>
            )}
            
            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">
                    {formData.client_type === 'individual' ? 'Full Name' : 'Contact Person Name'}
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="Enter your phone number"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    placeholder="Enter your address"
                    className="mt-1"
                  />
                </div>
                
                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={prevStep}>
                    Previous Step
                  </Button>
                  <Button 
                    type="button" 
                    onClick={nextStep}
                    disabled={!formData.name || !formData.phone || !formData.address}
                  >
                    Next Step
                  </Button>
                </div>
              </div>
            )}
            
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Profile Information</h3>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Client Type:</span>
                      <span className="font-medium capitalize">{formData.client_type}</span>
                    </div>
                    
                    {formData.client_type === 'company' && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Company Name:</span>
                        <span className="font-medium">{formData.company_name}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <span className="text-gray-500">
                        {formData.client_type === 'individual' ? 'Name' : 'Contact Person'}:
                      </span>
                      <span className="font-medium">{formData.name}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-500">Phone:</span>
                      <span className="font-medium">{formData.phone}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-500">Address:</span>
                      <span className="font-medium">{formData.address}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={prevStep}>
                    Previous Step
                  </Button>
                  <Button 
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Complete Profile
                  </Button>
                </div>
              </div>
            )}
          </form>
        </CardContent>
        
        <CardFooter className="flex justify-center border-t pt-6">
          <p className="text-sm text-gray-500">
            Your profile information helps us provide better services
          </p>
        </CardFooter>
      </Card>
    </div>
  );
} 