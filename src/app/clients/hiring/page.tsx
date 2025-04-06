"use client"

import { useState, useEffect } from "react"
import {
  Search,
  Filter,
  ChevronDown,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
  MoreVertical,
  MapPin,
  Menu
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { format } from "date-fns"
import { supabase } from "@/lib/supabase"

interface SelectedStaff {
  id?: string;
  name?: string;
  role?: string;
  location?: string;
  image?: string;
}

type Interview = {
  id: string
  status: string
  scheduled_time: string
  notes: string | null
  order: {
    id: string
    order_number: string
    customer_name: string
    selected_staff: SelectedStaff[]
  } | null
}

export default function HiringPage() {
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [loading, setLoading] = useState(true)
  const [filteredInterviews, setFilteredInterviews] = useState<Interview[]>([])
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const pathname = usePathname()

  useEffect(() => {
    async function fetchInterviews() {
      try {
        console.log("Fetching interviews...")
        const { data, error } = await supabase
          .from('interviews')
          .select(`
            id,
            status,
            scheduled_time,
            notes,
            order:order_id (
              id,
              order_number,
              customer_name,
              selected_staff
            )
          `)
          .order('scheduled_time', { ascending: false })
        
        if (error) {
          console.error("Error fetching interviews:", error)
          throw error
        }
        
        console.log("Interviews fetched:", data)
        if (data) {
          setInterviews(data as Interview[])
          setFilteredInterviews(data as Interview[])
        }
      } catch (error) {
        console.error("Error in fetchInterviews:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchInterviews()
  }, [])

  useEffect(() => {
    // Filter interviews based on status and search query
    let filtered = [...interviews]
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(interview => interview.status === statusFilter)
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(interview => {
        const staffMatches = interview.order?.selected_staff.some(staff => 
          staff.name?.toLowerCase().includes(query) || 
          staff.role?.toLowerCase().includes(query)
        )
        
        return (
          interview.order?.order_number.toLowerCase().includes(query) ||
          interview.order?.customer_name.toLowerCase().includes(query) ||
          staffMatches
        )
      })
    }
    
    setFilteredInterviews(filtered)
  }, [statusFilter, searchQuery, interviews])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200 border">Scheduled</Badge>
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 border-green-200 border">Completed</Badge>
      case 'hired':
        return <Badge className="bg-green-100 text-green-800 border-green-200 border">Hired</Badge>
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 border-red-200 border">Rejected</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200 border">{status}</Badge>
    }
  }

  function getInitials(name: string) {
    if (!name) return "?"
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar */}
      <div className="w-56 bg-white border-r flex-shrink-0 flex flex-col h-screen">
        {/* Company Logo */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-md flex items-center justify-center text-white">
              <span className="text-xl">F</span>
            </div>
            <div>
              <div className="font-semibold">FGS Staffing</div>
              <div className="text-xs text-gray-500">client@fgstaffing.com</div>
            </div>
          </div>
        </div>

        {/* Main Menu */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <div className="text-sm font-medium text-gray-500 mb-2">Main Menu</div>
            <nav className="space-y-1">
              <Link
                href="/clients/dashboard"
                className="flex items-center gap-3 px-3 py-2 text-gray-600 rounded-md hover:bg-gray-100"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                  <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                  <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                  <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                </svg>
                <span>Dashboard</span>
              </Link>

              <Link
                href="/clients/discover"
                className="flex items-center gap-3 px-3 py-2 text-gray-600 rounded-md hover:bg-gray-100"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
                <span>Discover</span>
              </Link>

              <Link
                href="/clients/hiring"
                className={`flex items-center gap-3 px-3 py-2 text-gray-900 bg-gray-100 rounded-md font-medium`}
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M4 4L8 8M8 8V4M8 8H4M20 4L16 8M16 8V4M16 8H20M4 20L8 16M8 16V20M8 16H4M20 20L16 16M16 16V20M16 16H20"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Hiring</span>
              </Link>

              <Link href="#" className="flex items-center gap-3 px-3 py-2 text-gray-600 rounded-md hover:bg-gray-100">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 6H22M2 12H22M2 18H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <span>Transactions</span>
              </Link>

              <Link href="#" className="flex items-center gap-3 px-3 py-2 text-gray-600 rounded-md hover:bg-gray-100">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M16 8L21 3M21 3H16M21 3V8M8 21L3 16M3 16H8M3 16V21M16 3L8 21"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Performance</span>
              </Link>

              <Link href="#" className="flex items-center gap-3 px-3 py-2 text-gray-600 rounded-md hover:bg-gray-100">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path d="M16 2V6M8 2V6M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <span>Schedule</span>
              </Link>
            </nav>
          </div>

          <div className="p-4">
            <div className="text-sm font-medium text-gray-500 mb-2">Preference</div>
            <nav className="space-y-1">
              <Link href="#" className="flex items-center gap-3 px-3 py-2 text-gray-600 rounded-md hover:bg-gray-100">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                  <path d="M12 9V15M9 12H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <span>Help Center</span>
              </Link>

              <Link href="#" className="flex items-center gap-3 px-3 py-2 text-gray-600 rounded-md hover:bg-gray-100">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12.22 2H11.78C11.2496 2 10.7409 2.21071 10.3658 2.58579C9.99072 2.96086 9.78 3.46957 9.78 4V4.18C9.78 4.73 9.5 5.43 9.13 5.8L8.7 6.23C8.5 6.43 8.16 6.5 7.9 6.37L7.75 6.3C7.2825 6.06694 6.74832 5.99908 6.23824 6.10686C5.72815 6.21464 5.27525 6.49278 4.96 6.89L4.74 7.21C4.42434 7.60704 4.25976 8.10424 4.27599 8.61275C4.29222 9.12126 4.48807 9.60493 4.82 9.98L4.92 10.1C5.28 10.5 5.28 11.1 4.92 11.5L4.82 11.62C4.48807 11.9951 4.29222 12.4787 4.27599 12.9873C4.25976 13.4958 4.42434 13.993 4.74 14.39L4.96 14.71C5.27525 15.1072 5.72815 15.3854 6.23824 15.4931C6.74832 15.6009 7.2825 15.5331 7.75 15.3L7.9 15.23C8.16 15.1 8.5 15.17 8.7 15.37L9.13 15.8C9.5 16.17 9.78 16.87 9.78 17.42V17.6C9.78 18.1304 9.99072 18.6391 10.3658 19.0142C10.7409 19.3893 11.2496 19.6 11.78 19.6H12.22C12.7504 19.6 13.2591 19.3893 13.6342 19.0142C14.0093 18.6391 14.22 18.1304 14.22 17.6V17.42C14.22 16.87 14.5 16.17 14.87 15.8L15.3 15.37C15.5 15.17 15.84 15.1 16.1 15.23L16.25 15.3C16.7175 15.5331 17.2517 15.6009 17.7618 15.4931C18.2719 15.3854 18.7247 15.1072 19.04 14.71L19.26 14.39C19.5757 13.993 19.7402 13.4958 19.724 12.9873C19.7078 12.4787 19.5119 11.9951 19.18 11.62L19.08 11.5C18.72 11.1 18.72 10.5 19.08 10.1L19.18 9.98C19.5119 9.60493 19.7078 9.12126 19.724 8.61275C19.7402 8.10424 19.5757 7.60704 19.26 7.21L19.04 6.89C18.7247 6.49278 18.2719 6.21464 17.7618 6.10686C17.2517 5.99908 16.7175 6.06694 16.25 6.3L16.1 6.37C15.84 6.5 15.5 6.43 15.3 6.23L14.87 5.8C14.5 5.43 14.22 4.73 14.22 4.18V4C14.22 3.46957 14.0093 2.96086 13.6342 2.58579C13.2591 2.21071 12.7504 2 12.22 2Z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <circle cx="12" cy="11" r="3" stroke="currentColor" strokeWidth="2" />
                </svg>
                <span>Settings</span>
              </Link>
            </nav>
          </div>
        </div>

        {/* Pro Access */}
        <div className="p-4 bg-orange-500 text-white m-4 rounded-lg">
          <div className="font-semibold mb-1">Get Pro Access</div>
          <div className="text-xs mb-3">Get access to advanced tools, upgrade and maximize your experience</div>
          <button className="w-full bg-white text-orange-500 rounded-md py-2 text-sm font-medium flex items-center justify-center gap-1">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                fill="currentColor"
              />
            </svg>
            Try Pro
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Content area */}
        <div className="flex-1 overflow-auto">
          <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Hiring Management</h1>
              <p className="text-gray-600">View and manage your interview history and hiring process</p>
            </div>

            {/* Toolbar */}
            <div className="bg-white rounded-lg p-4 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-500" />
                <span className="font-medium">
                  Interviews: <span className="text-gray-900">{filteredInterviews.length}</span>
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative w-full sm:w-auto">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input 
                    className="pl-9 w-full sm:w-64 bg-gray-50" 
                    placeholder="Search by name or order" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="hired">Hired</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="mb-4">
                    <CardContent className="p-0">
                      <div className="p-4 border-b">
                        <div className="flex justify-between">
                          <Skeleton className="h-6 w-32 mb-2" />
                          <Skeleton className="h-6 w-24" />
                        </div>
                        <Skeleton className="h-4 w-56 mt-2" />
                      </div>
                      <div className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="flex-1">
                          <Skeleton className="h-5 w-48 mb-2" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                        <Skeleton className="h-9 w-24" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* No Results */}
            {!loading && filteredInterviews.length === 0 && (
              <div className="bg-white rounded-lg p-8 text-center">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No interviews found</h3>
                <p className="text-gray-500 mb-4">
                  {searchQuery || statusFilter !== "all" 
                    ? "Try changing your search or filter criteria"
                    : "Your interview history will appear here once you schedule interviews with staff members"}
                </p>
                <Link href="/clients/discover">
                  <Button>Browse Staff</Button>
                </Link>
              </div>
            )}

            {/* Interview List */}
            {!loading && filteredInterviews.length > 0 && (
              <div className="space-y-4">
                {filteredInterviews.map((interview) => (
                  <Card key={interview.id} className="mb-4 overflow-hidden">
                    <CardContent className="p-0">
                      <div className="p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="font-medium text-gray-900">
                            {interview.order?.order_number || "Unknown Order"}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            {interview.scheduled_time && (
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>{format(new Date(interview.scheduled_time), "MMM d, yyyy")}</span>
                                <span className="mx-1">•</span>
                                <Clock className="h-3.5 w-3.5" />
                                <span>{format(new Date(interview.scheduled_time), "h:mm a")}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div>{getStatusBadge(interview.status)}</div>
                      </div>
                      
                      {interview.order?.selected_staff.map((staff, index) => (
                        <div key={index} className="p-4 flex flex-col sm:flex-row sm:items-center gap-4 border-b last:border-b-0">
                          <Avatar className="h-12 w-12 bg-blue-500">
                            {staff.image ? (
                              <AvatarImage src={staff.image} alt={staff.name} />
                            ) : null}
                            <AvatarFallback className="text-white">{getInitials(staff.name || "")}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="font-medium">{staff.name || "Unnamed Staff"}</div>
                            <div className="text-sm text-gray-500 flex flex-wrap gap-x-3 gap-y-1 mt-1">
                              <span>{staff.role || "Unknown Role"}</span>
                              {staff.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {staff.location}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {interview.status === 'scheduled' && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    Actions
                                    <ChevronDown className="ml-2 h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    <span>Mark as Hired</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <XCircle className="mr-2 h-4 w-4" />
                                    <span>Mark as Rejected</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                            
                            {(interview.status === 'hired' || interview.status === 'rejected') && (
                              <>
                                {interview.status === 'hired' ? (
                                  <Button variant="outline" size="sm" className="text-green-600 border-green-200 hover:bg-green-50">
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Hired
                                  </Button>
                                ) : (
                                  <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Rejected
                                  </Button>
                                )}
                              </>
                            )}
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Calendar className="mr-2 h-4 w-4" />
                                  <span>View Details</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <MessageSquare className="mr-2 h-4 w-4" />
                                  <span>Contact Staff</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      ))}
                      
                      {interview.notes && (
                        <div className="p-4 bg-gray-50 border-t">
                          <div className="font-medium text-sm mb-1">Notes</div>
                          <div className="text-sm text-gray-600">{interview.notes}</div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="bg-white border-t p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-gray-700 hover:bg-gray-100 flex items-center gap-1"
            >
              <Menu className="h-4 w-4" />
              <span className="text-xs">Menu</span>
            </Button>
          </div>

          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-gray-700 hover:bg-gray-100 flex items-center gap-1"
            >
              <MessageSquare className="h-4 w-4" />
              <span className="text-xs">Support</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

