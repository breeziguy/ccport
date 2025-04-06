"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { X, Phone, MapPin, User, CheckCircle, XCircle, Calendar, Mail, Briefcase, GraduationCap, Award } from "lucide-react"
import { 
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog"
import { InterviewBooking } from "@/components/staff/interview-booking"
import { Shell } from "@/components/shells/shell"

type StaffDetail = {
  id: string
  name: string
  role: string
  experience: number
  salary: number
  availability: boolean | null
  image_url: string | null
  location: string | null
  phone: string | null
  email: string | null
  skills: string[] | null
  status: string | null
  verified: boolean | null
  age: number | null
  gender: string | null
  marital_status: string | null
  education_background: any
  work_history: any
  created_at: string | null
}

export default function StaffDetailPage({ params }: { params: { id: string } }) {
  const staffId = params.id
  const [staff, setStaff] = useState<StaffDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStaffDetails() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from("staff")
          .select("*")
          .eq("id", staffId)
          .single()

        if (error) throw error

        setStaff(data)
        console.log("Staff data loaded:", data)
      } catch (error: any) {
        console.error("Error fetching staff details:", error)
        setError(error.message || "Failed to load staff details")
      } finally {
        setLoading(false)
      }
    }

    fetchStaffDetails()
  }, [staffId])

  const getInitials = (name: string) => {
    if (!name) return "NA"
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Function to format skills for better display
  const formatSkills = (skills: string[] | null) => {
    if (!skills || skills.length === 0) return [];
    return skills.map(skill => skill.trim()).filter(skill => skill !== "");
  }

  // Function to safely render education background
  const renderEducation = (education: any) => {
    if (!education) return null;
    
    // If education is a string, render it as text
    if (typeof education === 'string') {
      return <p className="text-gray-700 whitespace-pre-line">{education}</p>;
    }
    
    // If education is an array of objects, render it as formatted entries
    if (Array.isArray(education)) {
      return (
        <div className="space-y-3">
          {education.map((edu, index) => (
            <div key={index} className="border rounded-lg p-3 bg-gray-50">
              <p className="font-medium">{edu.institution}</p>
              <p className="text-gray-600">
                {edu.qualification} in {edu.field} ({edu.year})
              </p>
            </div>
          ))}
        </div>
      );
    }
    
    // Fallback for any other format
    return <p className="text-gray-500">Education information unavailable</p>;
  }
  
  // Function to safely render work history
  const renderWorkHistory = (workHistory: any) => {
    if (!workHistory) return null;
    
    // If work history is a string, render it as text
    if (typeof workHistory === 'string') {
      return <p className="text-gray-700 whitespace-pre-line">{workHistory}</p>;
    }
    
    // If work history is an array of objects, render it as formatted entries
    if (Array.isArray(workHistory)) {
      return (
        <div className="space-y-3">
          {workHistory.map((work, index) => (
            <div key={index} className="border rounded-lg p-3 bg-gray-50">
              <p className="font-medium">{work.company}</p>
              <p className="text-gray-600">{work.position}</p>
              <p className="text-gray-500">
                {work.startDate || ''} {work.endDate ? `- ${work.endDate}` : work.startDate ? '- Present' : ''}
              </p>
              {work.responsibilities && (
                <p className="text-gray-600 mt-1">{work.responsibilities}</p>
              )}
            </div>
          ))}
        </div>
      );
    }
    
    // Fallback for any other format
    return <p className="text-gray-500">Work history unavailable</p>;
  }

  return (
    <Shell>
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        <div className="flex-1 space-y-4 pt-6">
          <div className="flex items-center justify-between px-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Staff Details</h2>
              <p className="text-muted-foreground">View detailed information about this staff member</p>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/clients/discover">
                <Button variant="outline">Back to Discover</Button>
              </Link>
              {staff && staff.availability && (
                <Link href={`/clients/discover/${staffId}/request`}>
                  <Button>Request Staff</Button>
                </Link>
              )}
            </div>
          </div>

          <div className="px-6 pb-8">
            {/* Loading State */}
            {loading && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-28 w-28 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-5 w-48" />
                    <div className="flex gap-2 mt-2">
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-6 w-24" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-5 w-full" />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Skeleton className="h-64 w-full" />
                  <Skeleton className="h-64 w-full" />
                  <Skeleton className="h-64 w-full" />
                  <Skeleton className="h-64 w-full" />
                  <Skeleton className="h-64 md:col-span-2 w-full" />
                </div>
              </div>
            )}

            {/* Error State */}
            {!loading && error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <XCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
                <h3 className="text-lg font-medium text-red-800 mb-2">Error loading staff details</h3>
                <p className="text-red-500 mb-4">{error}</p>
                <Link href="/clients/discover">
                  <Button>Return to Staff Directory</Button>
                </Link>
              </div>
            )}

            {/* Staff Details */}
            {!loading && staff && (
              <div className="space-y-6">
                {/* Profile Summary Card */}
                <Card className="overflow-hidden">
                  <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start">
                    <div className="flex-shrink-0">
                      <Avatar className="h-28 w-28 bg-blue-500">
                        {staff.image_url ? (
                          <AvatarImage src={staff.image_url} alt={staff.name} />
                        ) : null}
                        <AvatarFallback className="text-2xl">{getInitials(staff.name)}</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex-1">
                      <div className="mb-3">
                        <h1 className="text-2xl font-bold">{staff.name}</h1>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={`${staff.availability ? 'bg-green-100 text-green-800 border-green-200' : 'bg-purple-100 text-purple-800 border-purple-200'} border`}>
                            {staff.availability ? 'Available' : 'Hired'}
                          </Badge>
                          <div className="text-gray-600">
                            <span>{staff.role}</span>
                            {staff.experience !== null && (
                              <span className="ml-1">• {staff.experience} years experience</span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3 mb-4">
                        {/* Personal & Financial Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {staff.location && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <MapPin className="h-4 w-4" />
                              <span>{staff.location}</span>
                            </div>
                          )}
                          {staff.salary && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" />
                                <path d="M15 8H9C7.9 8 7 8.9 7 10V14C7 15.1 7.9 16 9 16H15C16.1 16 17 15.1 17 14V10C17 8.9 16.1 8 15 8Z" />
                              </svg>
                              <span>₦{Number(staff.salary || 0).toLocaleString()} monthly</span>
                            </div>
                          )}
                          {staff.marital_status && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <User className="h-4 w-4" />
                              <span>{staff.marital_status}</span>
                            </div>
                          )}
                          {staff.education_background && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <GraduationCap className="h-4 w-4" />
                              <span>
                                {typeof staff.education_background === 'string' 
                                  ? 'Has education records' 
                                  : Array.isArray(staff.education_background) 
                                    ? `${staff.education_background.length} education entries` 
                                    : 'Education available'}
                              </span>
                            </div>
                          )}
                          {staff.phone && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <Phone className="h-4 w-4" />
                              <span>{staff.phone}</span>
                            </div>
                          )}
                          {staff.email && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <Mail className="h-4 w-4" />
                              <span>{staff.email}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {staff.skills && staff.skills.length > 0 && (
                        <div className="mb-5">
                          <h3 className="text-sm font-medium text-gray-500 mb-2">Key Skills</h3>
                          <div className="flex flex-wrap gap-2">
                            {formatSkills(staff.skills).slice(0, 5).map((skill, index) => (
                              <Badge key={index} variant="secondary" className="bg-gray-100 text-gray-800 hover:bg-gray-200">
                                {skill}
                              </Badge>
                            ))}
                            {staff.skills.length > 5 && (
                              <Badge variant="secondary" className="bg-gray-100 text-gray-500">
                                +{staff.skills.length - 5} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-4 flex gap-3">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline">Book Interview</Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>Book Interview with {staff.name}</DialogTitle>
                              <DialogDescription>
                                Schedule an interview to discuss hiring {staff.name} as your {staff.role.toLowerCase()}.
                              </DialogDescription>
                            </DialogHeader>
                            <InterviewBooking staffId={staff.id} staffName={staff.name} />
                          </DialogContent>
                        </Dialog>
                        
                        {staff.availability && (
                          <Link href={`/clients/discover/${staffId}/request`}>
                            <Button>Request Staff</Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Details Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Financial Details */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <svg className="h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="currentColor"/>
                          <path d="M12 17C12.8284 17 13.5 16.3284 13.5 15.5C13.5 14.6716 12.8284 14 12 14C11.1716 14 10.5 14.6716 10.5 15.5C10.5 16.3284 11.1716 17 12 17Z" fill="currentColor"/>
                          <path d="M13 7H11V13H13V7Z" fill="currentColor"/>
                        </svg>
                        Financial Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-500">Monthly Salary</span>
                        <span className="font-medium">₦{Number(staff.salary || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-500">Estimated Daily Rate</span>
                        <span className="font-medium">₦{Number((staff.salary || 0) / 30).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-gray-500">Estimated Hourly Rate</span>
                        <span className="font-medium">₦{Number((staff.salary || 0) / 30 / 8).toLocaleString()}</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Skills & Expertise */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-gray-500" />
                        Skills & Expertise
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {staff.skills && staff.skills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {formatSkills(staff.skills).map((skill, index) => (
                            <Badge key={index} variant="secondary" className="bg-gray-100 text-gray-800 hover:bg-gray-200">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">No skills listed</p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Personal Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5 text-gray-500" />
                        Personal Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {staff.age && (
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-gray-500">Age</span>
                          <span className="font-medium">{staff.age} years</span>
                        </div>
                      )}
                      {staff.gender && (
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-gray-500">Gender</span>
                          <span className="font-medium">{staff.gender}</span>
                        </div>
                      )}
                      {staff.marital_status && (
                        <div className="flex justify-between py-2">
                          <span className="text-gray-500">Marital Status</span>
                          <span className="font-medium">{staff.marital_status}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Verification Status */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-gray-500" />
                        Verification
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-500">Status</span>
                        <span className={`font-medium flex items-center gap-1 ${staff.status === 'active' ? 'text-green-600' : 'text-amber-600'}`}>
                          {staff.status === 'active' ? (
                            <>
                              <CheckCircle className="h-4 w-4" />
                              Active
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4 w-4" />
                              {staff.status || 'Inactive'}
                            </>
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-500">Background Check</span>
                        <span className={`font-medium flex items-center gap-1 ${staff.verified ? 'text-green-600' : 'text-amber-600'}`}>
                          {staff.verified ? (
                            <>
                              <CheckCircle className="h-4 w-4" />
                              Verified
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4 w-4" />
                              Not Verified
                            </>
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-gray-500">Member Since</span>
                        <span className="font-medium flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(staff.created_at)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Education Background */}
                  {staff.education_background && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <GraduationCap className="h-5 w-5 text-gray-500" />
                          Education Background
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {renderEducation(staff.education_background)}
                      </CardContent>
                    </Card>
                  )}

                  {/* Work History */}
                  {staff.work_history && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Briefcase className="h-5 w-5 text-gray-500" />
                          Work History
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {renderWorkHistory(staff.work_history)}
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Shell>
  )
}