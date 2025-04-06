"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { User, AlignRight } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"

type CompanyDetails = {
  id: string
  name: string
  email: string
  logo: string
}

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [companyDetails, setCompanyDetails] = useState<CompanyDetails>({
    id: '',
    name: 'FGS Staffing',
    email: 'client@fgstaffing.com',
    logo: 'F'
  })

  // Fetch company details
  useEffect(() => {
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

    fetchCompanyDetails()
  }, [])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar toggle */}
      <div className="md:hidden fixed top-4 left-4 z-30">
        <Button variant="outline" size="icon" onClick={toggleSidebar}>
          <AlignRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Left Sidebar */}
      <div className={`${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 w-64 bg-white border-r flex-shrink-0 flex flex-col h-screen fixed md:sticky top-0 z-20 transition-transform duration-200 ease-in-out`}>
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

              <Link href="/clients/hiring" className="flex items-center gap-3 px-3 py-2 text-gray-600 rounded-md hover:bg-gray-100">
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
            </nav>
          </div>

          <div className="p-4">
            <div className="text-sm font-medium text-gray-500 mb-2">Settings</div>
            <nav className="space-y-1">
              <Link href="#" className="flex items-center gap-3 px-3 py-2 text-gray-600 rounded-md hover:bg-gray-100">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M19.4 15C19.1277 15.8031 19.2207 16.6718 19.65 17.4L19.71 17.51C20.0367 17.9977 20.156 18.5951 20.0356 19.1671C19.9153 19.7392 19.5658 20.2387 19.07 20.54C18.577 20.8482 18.004 20.9911 17.4232 20.9465C16.8423 20.9019 16.2969 20.672 15.86 20.29L15.75 20.2C15.0266 19.747 14.1733 19.6421 13.37 19.91C12.5901 20.1583 11.9428 20.723 11.57 21.47L11.52 21.58C11.2961 22.1283 10.8768 22.5729 10.346 22.8328C9.81524 23.0928 9.2061 23.1488 8.64 23C8.0866 22.861 7.60525 22.535 7.28 22.08C6.96105 21.6276 6.8222 21.0786 6.89 20.54V20.4C6.99446 19.6022 6.75905 18.7883 6.25 18.15C5.74095 17.5117 5.00488 17.1154 4.2 17.05H4C3.43573 16.9611 2.94356 16.6565 2.62 16.2C2.29644 15.7435 2.1691 15.1823 2.26 14.63C2.34929 14.0718 2.6471 13.5663 3.08 13.22C3.50843 12.8656 4.04938 12.6723 4.61 12.67H4.69C5.48639 12.6706 6.25461 12.3508 6.8 11.78C7.35937 11.2035 7.65599 10.4283 7.62 9.63C7.58939 9.01172 7.7519 8.39823 8.09 7.88L8.15 7.74C8.48273 7.27533 8.96742 6.94896 9.51967 6.8357C10.0719 6.72244 10.6452 6.83224 11.12 7.14C11.6042 7.43018 11.9707 7.88361 12.1567 8.42297C12.3428 8.96233 12.3368 9.55153 12.14 10.09L12.07 10.27C11.7032 11.0761 11.7167 12.0013 12.1067 12.7951C12.4966 13.589 13.2204 14.1561 14.07 14.34H14.16C14.9508 14.5341 15.818 14.3628 16.47 13.88L16.55 13.82C17.0053 13.4582 17.5806 13.2729 18.1636 13.294C18.7466 13.3151 19.3058 13.5415 19.73 13.93C20.1809 14.3297 20.4489 14.8978 20.4717 15.4992C20.4944 16.1006 20.2702 16.6878 19.85 17.12L19.76 17.21C19.3969 17.5752 19.1991 18.0765 19.2 18.6V19.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Settings</span>
              </Link>

              <Link href="#" className="flex items-center gap-3 px-3 py-2 text-gray-600 rounded-md hover:bg-gray-100">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 17V11M12 8V8.01M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <span>Help</span>
              </Link>
            </nav>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t mt-auto">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/avatars/01.png" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium text-sm">Client Account</div>
              <div className="text-xs text-gray-500">client@example.com</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 min-w-0 overflow-auto ${isSidebarOpen ? 'md:ml-0' : 'ml-0'}`}>
        {children}
      </div>

      {/* Sidebar overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={toggleSidebar}
        />
      )}
    </div>
  )
} 