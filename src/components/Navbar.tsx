import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSelector } from "@/components/LanguageSelector";
import { 
  Sprout, 
  LayoutDashboard, 
  LineChart, 
  History, 
  CloudSun, 
  Leaf, 
  Menu, 
  X,
  User,
  LogOut,
  Loader2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, isLoading, signOut } = useAuth();
  const { t } = useLanguage();

  const navLinks = [
    { to: "/", label: t("nav.dashboard"), icon: LayoutDashboard },
    { to: "/predict", label: t("nav.predict"), icon: LineChart },
    { to: "/history", label: t("nav.history"), icon: History },
    { to: "/weather", label: t("nav.weather"), icon: CloudSun },
    { to: "/recommendations", label: t("nav.recommendations"), icon: Leaf },
  ];

  const getInitials = (email: string) => {
    return email.slice(0, 2).toUpperCase();
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-glow transition-transform group-hover:scale-105">
              <Sprout className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="hidden font-display text-xl font-bold text-foreground sm:block">
              CropYield<span className="text-primary">Pro</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link key={link.to} to={link.to}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    size="sm"
                    className={isActive ? "bg-secondary text-secondary-foreground" : ""}
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-2">
            <LanguageSelector className="hidden sm:flex" />
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.user_metadata?.avatar_url} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials(user.email || "U")}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.user_metadata?.full_name || "User"}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/history" className="cursor-pointer">
                      <History className="mr-2 h-4 w-4" />
                      {t("nav.history")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="cursor-pointer text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    {t("nav.logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button variant="outline" size="sm" className="hidden sm:flex">
                  <User className="h-4 w-4" />
                  {t("nav.login")}
                </Button>
              </Link>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-border py-4 animate-slide-up">
            <div className="flex flex-col gap-2">
              <div className="px-2 pb-2">
                <LanguageSelector className="w-full" />
              </div>
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.to;
                return (
                  <Link key={link.to} to={link.to} onClick={() => setIsOpen(false)}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className="w-full justify-start"
                    >
                      <Icon className="h-4 w-4" />
                      {link.label}
                    </Button>
                  </Link>
                );
              })}
              {!user && (
                <Link to="/auth" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full justify-start mt-2">
                    <User className="h-4 w-4" />
                    {t("nav.login")}
                  </Button>
                </Link>
              )}
              {user && (
                <Button 
                  variant="outline" 
                  className="w-full justify-start mt-2 text-destructive"
                  onClick={() => {
                    signOut();
                    setIsOpen(false);
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  {t("nav.logout")}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
