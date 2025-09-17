import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Linkedin, Award, Users, Target, Heart } from "lucide-react";

const About = () => {
  const team = [
    {
      name: "Dr. Venessa Garcia",
      position: "Director – Technology Promotions and Commercialization Office",
      expertise: "",
      education: "",
      email: "",
      bio: ""
    },
    {
      name: "Engr. Gladdy Christie Compasan",
      position: "Manager, TPCO – Innovation and Technology Support Unit",
      expertise: "",
      education: "",
      email: "",
      bio: ""
    },
    {
      name: "Ms. Flora Monica Mabaylan",
      position: "Manager, TPCO – Promotions Management Unit",
      expertise: "",
      education: "",
      email: "",
      bio: ""
    },
    {
      name: "Ms. Rhea Suzette Haguisan",
      position: "Manager, TPCO – Business Development Unit",
      expertise: "",
      education: "",
      email: "",
      bio: ""
    },
    {
      name: "Engr. Jodie Rey Fernandez",
      position: "Technology Promotions Officer, TPCO – Promotions Management Unit",
      expertise: "",
      education: "",
      email: "",
      bio: ""
    },
    {
      name: "Engr. Clark Darwin Gozon",
      position: "Technical Expert, TPCO – Innovation and Technology Support Unit",
      expertise: "",
      education: "",
      email: "",
      bio: ""
    },
    {
      name: "Engr. Mark Lister Nalupa",
      position: "Technical Expert, TPCO – Innovation and Technology Support Unit",
      expertise: "",
      education: "",
      email: "",
      bio: ""
    },
    {
      name: "Noreza P. Aleno",
      position: "Administrative Staff, TPCO – Innovation and Technology Support Unit",
      expertise: "",
      education: "",
      email: "",
      bio: ""
    },
    {
      name: "Krystia Ces G. Napili",
      position: "Science Research Specialist, Technology Promotions and Commercialization Office",
      expertise: "",
      education: "",
      email: "",
      bio: ""
    },
    {
      name: "Michael J. Cerbito",
      position: "Administrative Assistant, Technology Promotions and Commercialization Office",
      expertise: "",
      education: "",
      email: "",
      bio: ""
    }
  ];

  const partners = [
    {
      name: "Oro Chamber of Commerce and Industry",
      type: "Industry Association",
      description: "Leading chamber representing business interests in Northern Mindanao"
    },
    {
      name: "Ateneo Innovation and Patent Office (IPO)",
      type: "Academic Partner", 
      description: "Strategic partnership for IP protection and technology transfer expertise"
    },
    {
      name: "Department of Science and Technology (DOST) Region X",
      type: "Government Agency",
      description: "Primary government partner for research funding and technology development"
    },
    {
      name: "Department of Trade and Industry (DTI) Misamis Oriental",
      type: "Government Agency",
      description: "Supporting SME development and business partnerships"
    },
    {
      name: "CDO b.i.t.e.s. (Cagayan de Oro business innovation technology e-startup)",
      type: "Incubator",
      description: "Premier startup incubator and innovation hub in Cagayan de Oro"
    },
    {
      name: "Intellectual Property Office of the Philippines (IPOPhil)",
      type: "Government Agency",
      description: "Official IP registration and protection agency"
    }
  ];

  const milestones = [
    {
      year: "2018",
      title: "TPCO Establishment",
      description: "Founded as USTP's dedicated technology transfer office"
    },
    {
      year: "2019",
      title: "First Patent Grant",
      description: "Achieved first successful patent registration for USTP innovation"
    },
    {
      year: "2020",
      title: "Industry Partnership Program",
      description: "Launched formal industry-academe collaboration framework"
    },
    {
      year: "2021",
      title: "CDO b.i.t.e.s. Partnership",
      description: "Established strategic alliance for startup incubation"
    },
    {
      year: "2022",
      title: "IP Portfolio Milestone",
      description: "Reached 15 patents granted with active licensing program"
    },
    {
      year: "2023",
      title: "Regional Recognition",
      description: "Awarded Outstanding Technology Transfer Office in Mindanao"
    },
    {
      year: "2024",
      title: "Innovation Hub Launch",
      description: "Opened state-of-the-art facility for technology commercialization"
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-ustp">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-roboto font-bold text-white mb-6">
                About USTP TPCO
              </h1>
              <p className="text-xl text-primary-foreground/80 mb-8">
                Leading technology transfer and innovation in Northern Mindanao through 
                strategic partnerships between academia and industry.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="gold" size="lg">
                  Contact Our Team
                  <Mail className="ml-2" />
                </Button>
                <Button variant="gold-outline" size="lg">
                  Visit Our Office
                  <MapPin className="ml-2" />
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6 text-center">
                  <Award className="text-secondary mx-auto mb-3" size={32} />
                  <div className="text-2xl font-roboto font-bold text-white mb-1">6</div>
                  <div className="text-primary-foreground/80 text-sm">Years of Excellence</div>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6 text-center">
                  <Users className="text-secondary mx-auto mb-3" size={32} />
                  <div className="text-2xl font-roboto font-bold text-white mb-1">12</div>
                  <div className="text-primary-foreground/80 text-sm">Expert Team Members</div>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6 text-center">
                  <Target className="text-secondary mx-auto mb-3" size={32} />
                  <div className="text-2xl font-roboto font-bold text-white mb-1">95%</div>
                  <div className="text-primary-foreground/80 text-sm">Success Rate</div>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6 text-center">
                  <Heart className="text-secondary mx-auto mb-3" size={32} />
                  <div className="text-2xl font-roboto font-bold text-white mb-1">24/7</div>
                  <div className="text-primary-foreground/80 text-sm">Support Available</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-card transition-all duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="text-secondary" size={32} />
                </div>
                <h3 className="text-2xl font-roboto font-bold text-primary mb-4">Our Mission</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To accelerate the translation of USTP research innovations into market-ready 
                  technologies that address regional and national development needs while fostering 
                  sustainable industry-academe partnerships.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-card transition-all duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award className="text-secondary" size={32} />
                </div>
                <h3 className="text-2xl font-roboto font-bold text-primary mb-4">Our Vision</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To be the premier technology transfer office in the Philippines, recognized for 
                  excellence in innovation commercialization and as the catalyst for economic 
                  development in Northern Mindanao.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-card transition-all duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="text-secondary" size={32} />
                </div>
                <h3 className="text-2xl font-roboto font-bold text-primary mb-4">Our Values</h3>
                <div className="text-muted-foreground leading-relaxed space-y-2">
                  <div><strong>Innovation:</strong> Fostering creativity and breakthrough thinking</div>
                  <div><strong>Integrity:</strong> Ethical practices in all partnerships</div>
                  <div><strong>Excellence:</strong> Commitment to quality and continuous improvement</div>
                  <div><strong>Collaboration:</strong> Building meaningful partnerships</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-roboto font-bold text-primary mb-4">
              Our Expert Team
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Meet the dedicated professionals driving innovation and technology transfer at USTP TPCO.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="group hover:shadow-card transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6 text-center">
                  <div className="w-20 h-20 bg-gradient-ustp rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-roboto font-bold text-xl">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-roboto font-bold text-primary mb-1">
                    {member.name}
                  </h3>
                  <p className="text-primary font-semibold mb-2">{member.position}</p>
                  <p className="text-sm text-muted-foreground mb-3">{member.expertise}</p>
                  <p className="text-xs text-muted-foreground mb-3">{member.education}</p>
                  <p className="text-sm text-muted-foreground mb-4">{member.bio}</p>
                  
                  <div className="flex justify-center space-x-2">
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary">
                      <Mail size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary">
                      <Linkedin size={16} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-roboto font-bold text-primary mb-4">
              Our Journey
            </h2>
            <p className="text-lg text-muted-foreground">
              Key milestones in USTP TPCO's evolution as a leading technology transfer office
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-4 md:left-1/2 md:transform md:-translate-x-1/2 h-full w-0.5 bg-secondary"></div>
            
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className={`relative flex items-center ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}>
                  <div className={`w-full md:w-1/2 ${
                    index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'
                  }`}>
                    <Card className="hover:shadow-card transition-all duration-300 ml-8 md:ml-0">
                      <CardContent className="p-6">
                        <div className="flex items-center mb-3">
                          <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-primary font-bold mr-4">
                            {milestone.year.slice(-2)}
                          </div>
                          <div>
                            <h3 className="font-roboto font-bold text-primary">{milestone.title}</h3>
                            <p className="text-primary text-sm">{milestone.year}</p>
                          </div>
                        </div>
                        <p className="text-muted-foreground">{milestone.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="absolute left-4 md:left-1/2 md:transform md:-translate-x-1/2 w-3 h-3 bg-secondary rounded-full border-4 border-white shadow-md"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-roboto font-bold text-primary mb-4">
              Our Strategic Partners
            </h2>
            <p className="text-lg text-muted-foreground">
              Collaborating with leading organizations to drive innovation and economic development
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partners.map((partner, index) => (
              <Card key={index} className="hover:shadow-card transition-all duration-300">
                <CardContent className="p-6">
                  <div className="mb-3">
                    <h3 className="font-roboto font-bold text-primary mb-1">{partner.name}</h3>
                    <span className="text-xs px-2 py-1 bg-secondary/10 text-secondary rounded-full">
                      {partner.type}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm">{partner.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-roboto font-bold mb-4">Visit Us</h2>
            <p className="text-xl text-primary-foreground/80">
              We're located at the heart of USTP's innovation ecosystem
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <MapPin className="text-secondary mx-auto mb-3" size={32} />
              <h3 className="font-roboto font-semibold mb-2">Address</h3>
              <p className="text-primary-foreground/80">
                USTP Technology Transfer Office<br />
                Cagayan de Oro Campus<br />
                Cagayan de Oro City, Philippines 9000
              </p>
            </div>

            <div className="text-center">
              <Phone className="text-secondary mx-auto mb-3" size={32} />
              <h3 className="font-roboto font-semibold mb-2">Phone</h3>
              <p className="text-primary-foreground/80">
                +63 (088) 856-1738<br />
                +63 (088) 856-1739
              </p>
            </div>

            <div className="text-center">
              <Mail className="text-secondary mx-auto mb-3" size={32} />
              <h3 className="font-roboto font-semibold mb-2">Email</h3>
              <p className="text-primary-foreground/80">
                tpco@ustp.edu.ph<br />
                info@ustp.edu.ph
              </p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-primary-foreground/80 mb-6">
              Office Hours: Monday - Friday, 8:00 AM - 5:00 PM<br />
              Walk-in consultations welcome, appointments recommended
            </p>
            <Button variant="gold" size="lg">
              Schedule a Meeting
              <Phone className="ml-2" />
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;