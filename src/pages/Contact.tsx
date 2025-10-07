import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Clock, User, Building2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import contactImage from "@/assets/services-bg.jpg";

const Contact = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section 
        className="relative py-20 bg-cover bg-center"
        style={{ backgroundImage: `url(${contactImage})` }}
      >
        <div className="absolute inset-0 bg-primary/80"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/services')}
            className="text-white hover:bg-white/10 mb-8"
          >
            <ArrowLeft className="mr-2" size={16} />
            Back to Services
          </Button>
          
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-roboto font-bold text-white mb-6">
              Contact USTP TPCO
            </h1>
            <p className="text-xl text-primary-foreground/80 max-w-3xl mx-auto">
              Get in touch with our Technology Transfer and Commercialization Office
              for personalized service consultation and support.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-roboto font-bold text-primary mb-4">
              Get Your Service Consultation
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Ready to transform your research into market success? Contact our expert team 
              for personalized guidance on technology transfer and commercialization.
            </p>
          </div>

          {/* Main Contact Card */}
          <Card className="mb-8 shadow-lg border-2 border-primary/10">
            <CardHeader className="bg-gradient-to-r from-primary to-accent text-white text-center">
              <CardTitle className="text-2xl font-roboto flex items-center justify-center">
                <Building2 className="mr-3" size={28} />
                USTP Technology Transfer & Commercialization Office
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Phone Contact */}
                <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="p-3 bg-green-100 rounded-full">
                    <Phone className="text-green-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800 mb-2">Call Us Directly</h3>
                    <p className="text-2xl font-bold text-green-600 mb-1">(088) 856-1738</p>
                    <p className="text-sm text-gray-600">Available Monday to Friday</p>
                    <p className="text-sm text-gray-600">8:00 AM - 5:00 PM</p>
                  </div>
                </div>

                {/* Email Contact */}
                <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Mail className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800 mb-2">Email Us</h3>
                    <p className="text-xl font-bold text-blue-600 mb-1">tpco@ustp.edu.ph</p>
                    <p className="text-sm text-gray-600">We respond within 24 hours</p>
                    <p className="text-sm text-gray-600">Send your inquiry anytime</p>
                  </div>
                </div>
              </div>

              {/* Office Location */}
              <div className="mt-8 p-6 bg-gray-50 rounded-lg border">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-gray-200 rounded-full">
                    <MapPin className="text-gray-600" size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-800 mb-2">Visit Our Office</h3>
                    <p className="text-gray-700 mb-2">
                      <strong>University of Science and Technology of Southern Philippines</strong>
                    </p>
                    <p className="text-gray-600 mb-1">Cagayan de Oro Campus</p>
                    <p className="text-gray-600 mb-4">
                      Claro M. Recto Ave, Lapasan, Cagayan de Oro City, 9000 Misamis Oriental
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Clock size={16} className="text-gray-500" />
                        <span><strong>Office Hours:</strong></span>
                      </div>
                      <div className="text-gray-600">
                        Monday - Friday: 8:00 AM - 5:00 PM
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Person Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="border border-accent/20">
              <CardHeader className="bg-accent/10">
                <CardTitle className="text-lg font-roboto flex items-center text-accent">
                  <User className="mr-2" size={20} />
                  Office Director
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <p className="font-semibold text-gray-800">Dr. [Director Name]</p>
                  <p className="text-sm text-gray-600">Director, TPCO</p>
                  <p className="text-sm text-gray-600">Technology Transfer Specialist</p>
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-gray-600">
                      <strong>Direct Line:</strong> (088) 856-1738
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Email:</strong> director.tpco@ustp.edu.ph
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-secondary/20">
              <CardHeader className="bg-secondary/10">
                <CardTitle className="text-lg font-roboto flex items-center text-secondary">
                  <User className="mr-2" size={20} />
                  Program Coordinator
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <p className="font-semibold text-gray-800">[Coordinator Name]</p>
                  <p className="text-sm text-gray-600">Program Coordinator</p>
                  <p className="text-sm text-gray-600">Industry Partnership Specialist</p>
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-gray-600">
                      <strong>Direct Line:</strong> (088) 856-1738
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Email:</strong> coordinator.tpco@ustp.edu.ph
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Services We Can Help With */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl font-roboto text-center text-primary">
                How We Can Help You
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-primary mb-3">Technology Transfer Services</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• IP Protection & Patent Application</li>
                    <li>• Technology Licensing Support</li>
                    <li>• Prior Art Search & Analysis</li>
                    <li>• Technology Valuation</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-primary mb-3">Partnership & Commercialization</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Industry-Academe Matching</li>
                    <li>• Startup Incubation Programs</li>
                    <li>• Market Research & Analysis</li>
                    <li>• Funding & Investment Guidance</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <div className="text-center bg-gradient-to-r from-primary/5 to-accent/5 p-8 rounded-lg">
            <h3 className="text-2xl font-roboto font-bold text-primary mb-4">
              Ready to Start Your Innovation Journey?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Don't let your research stay in the lab. Contact us today to explore how we can 
              help transform your innovations into market-ready solutions that create real impact.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="gold" 
                size="lg"
                onClick={() => window.location.href = 'tel:(088)856-1738'}
                className="flex items-center"
              >
                <Phone className="mr-2" size={18} />
                Call Now: (088) 856-1738
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => window.location.href = 'mailto:tpco@ustp.edu.ph?subject=Service Consultation Request'}
                className="flex items-center border-primary text-primary hover:bg-primary hover:text-white"
              >
                <Mail className="mr-2" size={18} />
                Send Email
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;