"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { Calendar } from "@/components/ui/calendar"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { format } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, CheckIcon, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Shell } from "@/components/shells/shell"
import Link from "next/link"

type Staff = {
  id: string
  name: string
  role: string
  experience: number
  salary: number
  availability: boolean | null
  image_url: string | null
  location: string | null
}

export default function RequestStaffPage({ params }: { params: { id: string } }) {
  const staffId = params.id
  const router = useRouter()
  const [staff, setStaff] = useState<Staff | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  
  // Request form state
  const [serviceType, setServiceType] = useState<string>("full-time")
  const [duration, setDuration] = useState<string>("1-month")
  const [date, setDate] = useState<Date>()
  const [additionalInfo, setAdditionalInfo] = useState<string>("")
  
  // Fetch staff details and check authentication
  useEffect(() => {
    const fetchStaffDetails = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from("staff")
          .select("id, name, role, experience, salary, availability, image_url, location")
          .eq("id", staffId)
          .single()
        
        if (error) throw error
        
        if (!data.availability) {
          setError("This staff member is not available for requests")
        }
        
        setStaff(data)
      } catch (error: any) {
        console.error("Error fetching staff details:", error)
        setError(error.message || "Failed to load staff details")
      } finally {
        setLoading(false)
      }
    }
    
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession()
      setIsAuthenticated(!!data.session)
    }
    
    fetchStaffDetails()
    checkAuth()
  }, [staffId])
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!date) {
      setError("Please select a preferred start date")
      return
    }
    
    if (!isAuthenticated) {
      setError("You must be logged in to make a request")
      return
    }
    
    setSubmitting(true)
    setError(null)
    
    try {
      // Get the current user
      const { data: userData } = await supabase.auth.getUser()
      
      if (!userData.user) {
        throw new Error("User not found")
      }
      
      // Create the staff selection record
      const { error: requestError } = await supabase
        .from("staff_selections")
        .insert({
          staff_id: staffId,
          user_id: userData.user.id,
          service_type: serviceType,
          duration: duration,
          preferred_start_date: date.toISOString(),
          additional_info: additionalInfo,
          status: "pending"
        })
      
      if (requestError) throw requestError
      
      setSuccess(true)
    } catch (err: any) {
      console.error("Error requesting staff:", err)
      setError(err.message || "Failed to submit request")
    } finally {
      setSubmitting(false)
    }
  }
  
  const getInitials = (name: string) => {
    if (!name) return "NA"
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
  }

  return (
    <Shell>
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        <div className="flex-1 space-y-4 pt-6">
          <div className="flex items-center justify-between px-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Request Staff</h2>
              <p className="text-muted-foreground">Submit a request to hire this staff member</p>
            </div>
            <div className="flex items-center gap-2">
              <Link href={`/clients/discover/${staffId}`}>
                <Button variant="outline">Back to Profile</Button>
              </Link>
            </div>
          </div>

          <div className="px-6 pb-8">
            {/* Loading State */}
            {loading && (
              <div className="space-y-6">
                <Card>
                  <CardHeader className="space-y-2">
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-4 w-1/3" />
                  </CardHeader>
                  <CardContent className="flex items-center gap-4">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-40" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-1/4" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Error State */}
            {!loading && error && !success && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <X className="mx-auto h-12 w-12 text-red-400 mb-4" />
                <h3 className="text-lg font-medium text-red-800 mb-2">Request Unavailable</h3>
                <p className="text-red-500 mb-4">{error}</p>
                <Link href="/clients/discover">
                  <Button>Return to Staff Directory</Button>
                </Link>
              </div>
            )}

            {/* Success State */}
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckIcon className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-medium text-green-800 mb-2">Request Submitted Successfully!</h3>
                <p className="text-green-700 mb-6 max-w-md mx-auto">
                  Your request for {staff?.name} has been submitted. We will review your request and get back to you soon.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/clients/discover">
                    <Button variant="outline">Browse More Staff</Button>
                  </Link>
                  <Link href="/clients/dashboard">
                    <Button>Go to Dashboard</Button>
                  </Link>
                </div>
              </div>
            )}

            {/* Request Form */}
            {!loading && !error && !success && staff && (
              <div className="grid gap-6 max-w-4xl mx-auto">
                {/* Staff Summary Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Staff Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 bg-blue-500">
                      {staff.image_url ? (
                        <AvatarImage src={staff.image_url} alt={staff.name} />
                      ) : null}
                      <AvatarFallback className="text-lg">{getInitials(staff.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-medium">{staff.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-gray-600">{staff.role}</span>
                        {staff.experience && (
                          <span className="text-gray-500">• {staff.experience} years experience</span>
                        )}
                      </div>
                      <div className="mt-1">
                        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                          ₦{Number(staff.salary).toLocaleString()} monthly
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Request Form Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Request Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Authentication Check */}
                    {isAuthenticated === false && (
                      <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-4">
                        <h3 className="text-amber-800 font-medium">Authentication Required</h3>
                        <p className="text-amber-700 text-sm mt-1">
                          You must be logged in to request staff. Please{" "}
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

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <Label>Service Type</Label>
                        <RadioGroup 
                          value={serviceType} 
                          onValueChange={setServiceType}
                          className="grid grid-cols-2 gap-3"
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
                          className="grid grid-cols-2 md:grid-cols-4 gap-3"
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
                        <Label>Preferred Start Date</Label>
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
                          placeholder="Please include any specific requirements or questions you have..."
                          value={additionalInfo}
                          onChange={(e) => setAdditionalInfo(e.target.value)}
                          rows={4}
                        />
                      </div>

                      {error && !success && (
                        <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">
                          {error}
                        </div>
                      )}

                      <Button type="submit" className="w-full" disabled={submitting || isAuthenticated === false}>
                        {submitting ? "Submitting..." : "Submit Request"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </Shell>
  )
} 