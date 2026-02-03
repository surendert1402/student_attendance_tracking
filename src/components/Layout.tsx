import { ReactNode, useState } from 'react';
import { NavLink } from '@/components/NavLink';
import { useAuthContext } from '@/contexts/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  CalendarCheck, 
  BarChart3, 
  LogOut,
  Menu,
  X,
  GraduationCap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: ReactNode;
}

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/students', icon: Users, label: 'Students' },
  { to: '/attendance', icon: CalendarCheck, label: 'Attendance' },
  { to: '/reports', icon: BarChart3, label: 'Reports' },
];

export function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuthContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-foreground">AttendanceHub</h1>
              <p className="text-xs text-muted-foreground">Student Tracking System</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                activeClassName="bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* User Info & Logout */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-foreground capitalize">{user?.username}</p>
              <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className="text-muted-foreground hover:text-destructive"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            'md:hidden border-t bg-card overflow-hidden transition-all duration-300',
            mobileMenuOpen ? 'max-h-64' : 'max-h-0'
          )}
        >
          <nav className="container mx-auto px-4 py-2 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                activeClassName="bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}
