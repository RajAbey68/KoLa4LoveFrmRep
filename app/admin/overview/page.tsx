import AdminShell from '@/components/admin/AdminShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Image as ImageIcon, 
  Search, 
  MessageSquare, 
  Users, 
  Sparkles,
  ExternalLink,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function OverviewPage() {
  return (
    <AdminShell 
      title="Ko Lake Villa Admin Console" 
      subtitle="AI-Powered Content & CRM Management"
    >
      <div className="flex items-center justify-end mb-6">
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="text-green-600 border-green-600">
            <Sparkles className="h-3 w-3 mr-1" />
            AI-Enhanced
          </Badge>
          <Badge variant="outline" className="text-blue-600 border-blue-600">
            Live Site
          </Badge>
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            View Site
          </Button>
        </div>
      </div>

      {/* Data Integration Notice */}
      <Card className="border-amber-200 bg-amber-50 mb-6">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="h-5 w-5 text-amber-600" />
            <h3 className="font-semibold text-amber-800">Connect Real Ko Lake Villa Data</h3>
          </div>
          <p className="text-sm text-amber-700 mb-3">
            To display actual business metrics, please provide real data or connect booking systems
          </p>
          <div className="grid gap-2 text-xs text-amber-700">
            <div>• Contact villa manager for monthly booking and revenue data</div>
            <div>• Connect Google Analytics for website traffic and conversion rates</div>
            <div>• Access contact form database for inquiry tracking</div>
            <div>• Integrate Airbnb/booking platform APIs for review data</div>
          </div>
        </CardContent>
      </Card>

      {/* Direct Booking KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Direct Bookings</p>
                <p className="text-2xl font-bold text-gray-400">Ask Manager</p>
                <p className="text-xs text-green-600">Target: 60% of total</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Commission Savings</p>
                <p className="text-2xl font-bold text-gray-400">Calculate</p>
                <p className="text-xs text-blue-600">15-25% per booking</p>
              </div>
              <Search className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Contact Inquiries</p>
                <p className="text-2xl font-bold text-gray-400">Check DB</p>
                <p className="text-xs text-purple-600">From contact form</p>
              </div>
              <MessageSquare className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Gallery Images</p>
                <p className="text-2xl font-bold">36</p>
                <p className="text-xs text-amber-600">AI-optimized</p>
              </div>
              <ImageIcon className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Direct Booking Optimization Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Direct vs Platform Bookings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-500" />
              Booking Sources
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Direct Website</span>
                  <span className="text-gray-500">Need data</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{width: '0%'}}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Airbnb/Platforms</span>
                  <span className="text-gray-500">Need data</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{width: '0%'}}></div>
                </div>
              </div>
            </div>
            
            <div className="text-xs text-gray-600 bg-green-50 p-2 rounded">
              <strong>Goal:</strong> Increase direct bookings to save 15-25% commission fees
            </div>
          </CardContent>
        </Card>

        {/* Guest Experience Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              Guest Experience
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-400 mb-1">★ -.-</div>
              <p className="text-sm text-gray-600">Average Rating</p>
              <p className="text-xs text-gray-500">Connect review platforms</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total Reviews</span>
                <span className="text-gray-500">Get from platforms</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Response Rate</span>
                <span className="text-gray-500">Track responses</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Repeat Guests</span>
                <span className="text-gray-500">Calculate from bookings</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Website Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-blue-500" />
              Website Analytics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Monthly Visitors</span>
                <span className="text-gray-500">Connect Analytics</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Booking Page Views</span>
                <span className="text-gray-500">Connect Analytics</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Inquiry Conversion</span>
                <span className="text-green-600">Track from contact form</span>
              </div>
            </div>
            
            <Button variant="outline" size="sm" className="w-full">
              <ExternalLink className="mr-2 h-4 w-4" />
              Setup Google Analytics
            </Button>
          </CardContent>
        </Card>

        {/* AI Features Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              AI Content Optimization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 border rounded">
                <div>
                  <h4 className="text-sm font-medium">Gallery Analysis</h4>
                  <p className="text-xs text-gray-600">36 images AI-optimized</p>
                </div>
                <Badge variant="default" className="bg-green-600">Live</Badge>
              </div>
              
              <div className="flex items-center justify-between p-2 border rounded">
                <div>
                  <h4 className="text-sm font-medium">SEO Optimization</h4>
                  <p className="text-xs text-gray-600">Meta tags & descriptions</p>
                </div>
                <Badge variant="default" className="bg-green-600">Live</Badge>
              </div>
              
              <div className="flex items-center justify-between p-2 border rounded">
                <div>
                  <h4 className="text-sm font-medium">Hero Image Rotation</h4>
                  <p className="text-xs text-gray-600">Automated carousel system</p>
                </div>
                <Badge variant="default" className="bg-green-600">Live</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact & Booking Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-purple-500" />
              Lead Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Pending Inquiries</span>
                <span className="font-medium text-amber-600">Check DB</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>WhatsApp Messages</span>
                <span className="text-gray-500">Manual check</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Email Inquiries</span>
                <span className="text-green-600">SMTP connected</span>
              </div>
            </div>
            
            <Button variant="outline" size="sm" className="w-full">
              <MessageSquare className="mr-2 h-4 w-4" />
              View All Inquiries
            </Button>
          </CardContent>
        </Card>

        {/* Quick Management Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5 text-blue-500" />
              Direct Booking Tools
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Users className="mr-2 h-4 w-4" />
              Manage Availability
            </Button>
            
            <Button variant="outline" size="sm" className="w-full justify-start">
              <MessageSquare className="mr-2 h-4 w-4" />
              Update Gallery Content
            </Button>
            
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Search className="mr-2 h-4 w-4" />
              SEO Performance
            </Button>
            
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Marketing Copy
            </Button>
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}