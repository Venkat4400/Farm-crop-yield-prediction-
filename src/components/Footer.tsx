import { Sprout, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                <Sprout className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold">
                CropYield<span className="text-primary">Pro</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Empowering farmers with AI-powered crop yield predictions for smarter, more profitable farming decisions.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-primary transition-colors">Dashboard</Link></li>
              <li><Link to="/predict" className="hover:text-primary transition-colors">Predict Yield</Link></li>
              <li><Link to="/history" className="hover:text-primary transition-colors">Prediction History</Link></li>
              <li><Link to="/weather" className="hover:text-primary transition-colors">Weather Insights</Link></li>
              <li><Link to="/weather" className="hover:text-primary transition-colors">Crop calendar</Link></li>
            </ul>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Features</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/recommendations" className="hover:text-primary transition-colors">Crop Recommendations</Link></li>
              <li><Link to="/recommendations" className="hover:text-primary transition-colors">Fertilizer Guide</Link></li>
              <li><Link to="/Prediction" className="hover:text-primary transition-colors">satalite NDVI DATA</Link></li>
              <li><Link to="/weather" className="hover:text-primary transition-colors">Mobile supporting Weather Report</Link></li>
              <li><Link to="/weather" className="hover:text-primary transition-colors">Crop calendar & Smart prediction </Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Contact</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                kotavenakt2004@gmail.com
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                +91  97017 12613
              </li>
              <li><Link to="https://github.com/Venkat4400" className="hover:text-primary transition-colors">Linked In</Link></li>
              <li><Link to="https://www.linkedin.com/in/venkat2026/" className="hover:text-primary transition-colors">Github </Link></li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Agricultural Hub, Farm District
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 CropYieldPro. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="hover:text-primary cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-primary cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-primary cursor-pointer transition-colors">Help & FAQ</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
