import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Edit, Plus, Eye, EyeOff } from "lucide-react";

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({ username: "", password: "" });

  // Mock data for demonstration
  const [patents] = useState([
    { id: 1, title: "Smart Irrigation System", status: "Granted", field: "Agriculture" },
    { id: 2, title: "Bio-degradable Packaging", status: "Pending", field: "Materials Science" },
    { id: 3, title: "Food Preservation Method", status: "Granted", field: "Food Technology" }
  ]);

  const [services] = useState([
    { id: 1, name: "IP Protection", requests: 15 },
    { id: 2, name: "Technology Licensing", requests: 8 },
    { id: 3, name: "Industry Matching", requests: 12 }
  ]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login - in real app, this would validate against backend
    if (loginData.username === "admin" && loginData.password === "admin123") {
      setIsLoggedIn(true);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-ustp-blue">USTP TPCO Admin</CardTitle>
            <CardDescription>Sign in to manage portal content</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={loginData.username}
                  onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                  placeholder="Enter username"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    placeholder="Enter password"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full" variant="ustp">
                Sign In
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                Demo: admin / admin123
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-ustp-blue">USTP TPCO Admin Panel</h1>
          <Button variant="outline" onClick={() => setIsLoggedIn(false)}>
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="patents">Patents</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Total Patents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-ustp-blue">24</div>
                  <p className="text-sm text-muted-foreground">+3 this month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Service Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-ustp-blue">35</div>
                  <p className="text-sm text-muted-foreground">+8 pending</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Active Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-ustp-blue">156</div>
                  <p className="text-sm text-muted-foreground">+12 this week</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="patents" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Patent Management</h2>
              <Button variant="ustp">
                <Plus className="mr-2 h-4 w-4" />
                Add Patent
              </Button>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Add New Patent</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="patent-title">Patent Title</Label>
                    <Input id="patent-title" placeholder="Enter patent title" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patent-id">Patent ID</Label>
                    <Input id="patent-id" placeholder="Enter patent ID" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="inventors">Inventors</Label>
                    <Input id="inventors" placeholder="Enter inventors (comma separated)" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="field">Field</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select field" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="agriculture">Agriculture</SelectItem>
                        <SelectItem value="materials">Materials Science</SelectItem>
                        <SelectItem value="food">Food Technology</SelectItem>
                        <SelectItem value="engineering">Engineering</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="abstract">Abstract</Label>
                  <Textarea id="abstract" placeholder="Enter patent abstract" rows={4} />
                </div>
                <Button variant="ustp">Save Patent</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Existing Patents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patents.map((patent) => (
                    <div key={patent.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{patent.title}</h3>
                        <div className="flex gap-2 mt-2">
                          <Badge variant={patent.status === "Granted" ? "default" : "secondary"}>
                            {patent.status}
                          </Badge>
                          <Badge variant="outline">{patent.field}</Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Service Management</h2>
              <Button variant="ustp">
                <Plus className="mr-2 h-4 w-4" />
                Add Service
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {services.map((service) => (
                <Card key={service.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                    <CardDescription>{service.requests} pending requests</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        View Requests
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Resource Management</h2>
              <Button variant="ustp">
                <Plus className="mr-2 h-4 w-4" />
                Add Resource
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Upload New Resource</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="resource-title">Resource Title</Label>
                    <Input id="resource-title" placeholder="Enter resource title" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="resource-type">Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="template">Template</SelectItem>
                        <SelectItem value="guide">Guide</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="document">Document</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="resource-description">Description</Label>
                  <Textarea id="resource-description" placeholder="Enter description" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="file-upload">File Upload</Label>
                  <Input id="file-upload" type="file" />
                </div>
                <Button variant="ustp">Upload Resource</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">User Management</h2>
              <Button variant="ustp">
                <Plus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>User Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-ustp-blue">45</div>
                    <div className="text-sm text-muted-foreground">Researchers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-ustp-blue">23</div>
                    <div className="text-sm text-muted-foreground">Industry Partners</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-ustp-blue">78</div>
                    <div className="text-sm text-muted-foreground">Students</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-ustp-blue">10</div>
                    <div className="text-sm text-muted-foreground">Admins</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;