"use client"

import { useState, useEffect } from "react"
import { supabase } from '@/lib/supabase'
import {
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  User,
  Menu,
  MessageSquare,
  LayoutGrid,
  List,
  MoreVertical,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { usePathname } from "next/navigation"

type CompanyDetails = {
  id: string
  name: string
  email: string
  logo: string
}

type DashboardStats = {
  activeStaffCount: number
  pendingRequests: number
  completedHires: number
}

export default function ClientsDashboard() {
  const [viewMode, setViewMode] = useState("card") // "card" or "list"
  const [companyDetails, setCompanyDetails] = useState<CompanyDetails>({
    id: '',
    name: 'FGS Staffing',
    email: 'client@fgstaffing.com',
    logo: 'F'
  })
  const [stats, setStats] = useState<DashboardStats>({
    activeStaffCount: 0,
    pendingRequests: 0,
    completedHires: 0
  })
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()

  useEffect(() => {
    // Fetch company details
    async function fetchCompanyDetails() {
      try {
        const { data, error } = await supabase
          .from('company_details')
          .select('*')
          .limit(1)
          .single()
        
        if (error) {
          console.error('Error fetching company details:', error)
          return
        }
        
        if (data) {
          setCompanyDetails(data)
        }
      } catch (error) {
        console.error('Error fetching company details:', error)
      }
    }

    // Fetch dashboard stats
    async function fetchDashboardStats() {
      setLoading(true)
      try {
        // Get active staff count
        const { count: activeStaffCount, error: staffError } = await supabase
          .from('staff')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'active')
        
        if (staffError) throw staffError

        // Get pending requests count - this is a placeholder
        // In a real app, you'd fetch from a requests or staff_selections table
        const pendingRequests = 3
        
        // Get completed hires count - this is a placeholder
        // In a real app, you'd fetch from a hires or staff_assignment table
        const completedHires = 12

        setStats({
          activeStaffCount: activeStaffCount || 0,
          pendingRequests,
          completedHires
        })
      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCompanyDetails()
    fetchDashboardStats()
  }, [])

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar */}
      <div className="w-56 bg-white border-r flex-shrink-0 flex flex-col h-screen">
        {/* Company Logo */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-md flex items-center justify-center text-white">
              <span className="text-xl">{companyDetails.logo}</span>
            </div>
            <div>
              <div className="font-semibold">{companyDetails.name}</div>
              <div className="text-xs text-gray-500">{companyDetails.email}</div>
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
                className={`flex items-center gap-3 px-3 py-2 text-gray-600 rounded-md hover:bg-gray-100 ${
                  pathname === "/clients/dashboard" ? "bg-gray-100 text-gray-900 font-medium" : ""
                }`}
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
                className={`flex items-center gap-3 px-3 py-2 text-gray-600 rounded-md hover:bg-gray-100 ${
                  pathname === "/clients/discover" || pathname.startsWith("/clients/discover/") ? "bg-gray-100 text-gray-900 font-medium" : ""
                }`}
              >
                <User className="h-5 w-5" />
                <span>Discover</span>
              </Link>

              <Link href="#" className="flex items-center gap-3 px-3 py-2 text-gray-600 rounded-md hover:bg-gray-100">
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
                <span>Hiring</span>
              </Link>

              <Link href="#" className="flex items-center gap-3 px-3 py-2 text-gray-600 rounded-md hover:bg-gray-100">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 6H22M2 12H22M2 18H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <span>Payroll</span>
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
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                  <path
                    d="M12 7V12L15 15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Attendance</span>
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

        {/* Pro Access - moved outside overflow container */}
        <div className="p-4 bg-orange-500 text-white mx-4 mb-4 rounded-lg">
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
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back to your dashboard</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card className="p-5 flex items-center">
                <div className="bg-blue-100 p-3 rounded-full">
                  <User className="text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Active Staff</p>
                  <p className="text-2xl font-semibold">{stats.activeStaffCount}</p>
                </div>
              </Card>
              <Card className="p-5 flex items-center">
                <div className="bg-green-100 p-3 rounded-full">
                  <svg className="h-5 w-5 text-green-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 8V16M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Pending Requests</p>
                  <p className="text-2xl font-semibold">{stats.pendingRequests}</p>
                </div>
              </Card>
              <Card className="p-5 flex items-center">
                <div className="bg-purple-100 p-3 rounded-full">
                  <svg className="h-5 w-5 text-purple-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Completed Hires</p>
                  <p className="text-2xl font-semibold">{stats.completedHires}</p>
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="md:col-span-2">
                <Card className="overflow-hidden">
                  <div className="p-5 border-b">
                    <h3 className="font-medium">Recent Activities</h3>
                  </div>
                  <div className="divide-y">
                    <div className="p-4 flex items-start">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <p className="font-medium">New staff added</p>
                        <p className="text-sm text-gray-500">Sarah Williams was added as Nanny</p>
                        <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                      </div>
                    </div>
                    <div className="p-4 flex items-start">
                      <div className="bg-green-100 p-2 rounded-full">
                        <svg className="h-4 w-4 text-green-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="font-medium">Request approved</p>
                        <p className="text-sm text-gray-500">Your request for Chef John Doe was approved</p>
                        <p className="text-xs text-gray-400 mt-1">Yesterday</p>
                      </div>
                    </div>
                    <div className="p-4 flex items-start">
                      <div className="bg-amber-100 p-2 rounded-full">
                        <svg className="h-4 w-4 text-amber-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="font-medium">Payment reminder</p>
                        <p className="text-sm text-gray-500">Payment for current month is due in 3 days</p>
                        <p className="text-xs text-gray-400 mt-1">2 days ago</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              <div>
                <Card>
                  <div className="p-5 border-b">
                    <h3 className="font-medium">Quick Actions</h3>
                  </div>
                  <div className="p-4 space-y-3">
                    <Link href="/clients/discover">
                      <Button className="w-full justify-start">
                        <User className="mr-2 h-4 w-4" />
                        Find Staff
                      </Button>
                    </Link>
                    <Button variant="outline" className="w-full justify-start">
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 8V16M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      New Request
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <path d="M16 2V6M8 2V6M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      Schedule Meeting
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <path d="M9 12H15M9 16H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      View Contracts
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Footer - changed to white smoke */}
        <div className="fixed bottom-0 left-0 right-0 h-8 bg-gray-200 text-gray-800 flex items-center justify-between px-4 z-10">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-gray-700 px-2 py-0 hover:bg-gray-300 flex items-center gap-1"
            >
              <Menu className="h-4 w-4" />
              <span className="text-xs">Menu</span>
            </Button>
            <div className="flex items-center">
              <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded flex items-center">₦0.00</span>
            </div>
          </div>

          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-gray-700 px-2 py-0 hover:bg-gray-300 flex items-center gap-1"
            >
              <MessageSquare className="h-4 w-4" />
              <span className="text-xs">Chat</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ClientCard({ 
  type, 
  name, 
  email, 
  industry, 
  position, 
  clientId, 
  joinDate, 
  avatarText, 
  avatarColor 
}: { 
  type: string; 
  name: string; 
  email: string; 
  industry: string; 
  position: string; 
  clientId: string; 
  joinDate: string; 
  avatarText: string; 
  avatarColor: string; 
}) {
  const getBadgeColor = (type) => {
    switch (type) {
      case "Active":
        return "bg-green-100 text-green-800 border-green-200"
      case "Inactive":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "Prospect":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getIndustryColor = (industry) => {
    switch (industry) {
      case "Technology":
        return "text-blue-600"
      case "Manufacturing":
        return "text-green-600"
      case "Defense":
        return "text-gray-800"
      case "Pharmaceuticals":
        return "text-purple-600"
      case "Research":
        return "text-yellow-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <Card className="overflow-hidden">
      <div className="p-4 border-b flex items-center justify-between">
        <Badge className={`${getBadgeColor(type)} border`}>{type}</Badge>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className={`h-12 w-12 ${avatarColor}`}>
            <AvatarFallback className="text-white">{avatarText}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{name}</div>
            <div className="text-sm text-gray-500">{email}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <div className={`w-2 h-2 rounded-full ${getIndustryColor(industry)}`}></div>
          <div className={`text-sm font-medium ${getIndustryColor(industry)}`}>{industry}</div>
          <div className="text-sm text-gray-700 ml-2">{position}</div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 text-sm">
        <div className="flex justify-between mb-2">
          <div className="text-gray-500">Client ID</div>
          <div className="font-medium">{clientId}</div>
        </div>
        <div className="flex justify-between">
          <div className="text-gray-500">Join Date</div>
          <div className="font-medium">{joinDate}</div>
        </div>
      </div>
    </Card>
  )
}

