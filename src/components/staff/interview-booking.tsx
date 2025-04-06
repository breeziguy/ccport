"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { format } from "date-fns"
import { CalendarIcon, CheckIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase"
import { DialogClose } from "@/components/ui/dialog"

interface InterviewBookingProps {
  staffId: string
  staffName: string
  onSuccess?: () => void
}

export function InterviewBooking({ staffId, staffName, onSuccess }: InterviewBookingProps) {
  const [serviceType, setServiceType] = useState<string>("full-time")
  const [duration, setDuration] = useState<string>("1-month")
  const [date, setDate] = useState<Date>()
  const [additionalInfo, setAdditionalInfo] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession()
      setIsAuthenticated(!!data.session)
    }
    checkAuth()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!date) {
      setError("Please select an interview date")
      return
    }

    if (!isAuthenticated) {
      setError("You must be logged in to book an interview")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Get the current user
      const { data: userData } = await supabase.auth.getUser()
      
      if (!userData.user) {
        throw new Error("User not found")
      }

      // Create the interview booking
      const { error: interviewError } = await supabase
        .from("interviews")
        .insert({
          staff_id: staffId,
          user_id: userData.user.id,
          scheduled_time: date.toISOString(),
          service_type: serviceType,
          duration: duration,
          notes: additionalInfo,
          status: "scheduled"
        })

      if (interviewError) throw interviewError

      setSuccess(true)
      if (onSuccess) onSuccess()
    } catch (err: any) {
      console.error("Error booking interview:", err)
      setError(err.message || "Failed to book interview")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Authentication Check */}
      {isAuthenticated === false && (
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-4">
          <h3 className="text-amber-800 font-medium">Authentication Required</h3>
          <p className="text-amber-700 text-sm mt-1">
            You must be logged in to book an interview. Please{" "}
            <a href="/auth/login" className="font-medium underline">
              sign in
            </a>{" "}
            or{" "}
            <a href="/auth/register" className="font-medium underline">
              create an account
            </a>
            .
          </p>
        </div>
      )}

      {/* Success Message */}
      {success ? (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckIcon className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">Interview Scheduled!</h3>
          <p className="text-gray-500 mb-4 max-w-md">
            Your interview with {staffName} has been scheduled for {date && format(date, "EEEE, MMMM d, yyyy")}.
            We will notify you of any updates.
          </p>
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Service Type</Label>
            <RadioGroup 
              value={serviceType} 
              onValueChange={setServiceType}
              className="grid grid-cols-2 gap-2"
            >
              <div>
                <RadioGroupItem value="full-time" id="full-time" className="peer sr-only" />
                <Label
                  htmlFor="full-time"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <span>Full-Time</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="part-time" id="part-time" className="peer sr-only" />
                <Label
                  htmlFor="part-time"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <span>Part-Time</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Duration</Label>
            <RadioGroup 
              value={duration} 
              onValueChange={setDuration}
              className="grid grid-cols-2 gap-2"
            >
              <div>
                <RadioGroupItem value="1-month" id="1-month" className="peer sr-only" />
                <Label
                  htmlFor="1-month"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <span>1 Month</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="3-months" id="3-months" className="peer sr-only" />
                <Label
                  htmlFor="3-months"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <span>3 Months</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="6-months" id="6-months" className="peer sr-only" />
                <Label
                  htmlFor="6-months"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <span>6 Months</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="1-year" id="1-year" className="peer sr-only" />
                <Label
                  htmlFor="1-year"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <span>1 Year</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Interview Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="additional-info">Additional Information</Label>
            <Textarea
              id="additional-info"
              placeholder="Any specific requirements or questions..."
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              rows={3}
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm bg-red-50 p-2 rounded-md">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading || isAuthenticated === false}>
            {loading ? "Booking..." : "Book Interview"}
          </Button>
        </form>
      )}
    </div>
  )
} 