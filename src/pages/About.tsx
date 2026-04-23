import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Mail, Phone, MapPin, Linkedin, Award, Users, Target, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();
  const team = [
    {
      name: "Dr. Venessa Garcia",
      position: "Director – Technology Promotions and Commercialization Office",
      expertise: "",
      education: "",
      email: "",
      bio: "",
      image: "/images/team/venessa-garcia.jpg"
    },
    {
      name: "Engr. Gladdy Christie Compasan",
      position: "Manager, TPCO – Innovation and Technology Support Unit",
      expertise: "",
      education: "",
      email: "",
      bio: "",
      image: "/images/team/gladdy-christie-compasan.jpg"
    },
    {
      name: "Ms. Flora Monica Mabaylan",
      position: "Manager, TPCO – Promotions Management Unit",
      expertise: "",
      education: "",
      email: "",
      bio: "",
      image: "/images/team/flora-monica-mabaylan.jpg"
    },
    {
      name: "Ms. Rhea Suzette Haguisan",
      position: "Manager, TPCO – Business Development Unit",
      expertise: "",
      education: "",
      email: "",
      bio: "",
      image: "/images/team/rhea-suzette-haguisan.jpg"
    },
    {
      name: "Engr. Jodie Rey Fernandez",
      position: "Technology Promotions Officer, TPCO – Promotions Management Unit",
      expertise: "",
      education: "",
      email: "",
      bio: "",
      image: "/images/team/jodie-rey-fernandez.jpg"
    },
    {
      name: "Engr. Clark Darwin Gozon",
      position: "Technical Expert, TPCO – Innovation and Technology Support Unit",
      expertise: "",
      education: "",
      email: "",
      bio: "",
      image: "/images/team/clark-darwin-gozon.jpg"
    },
    {
      name: "Engr. Mark Lister Nalupa",
      position: "Technical Expert, TPCO – Innovation and Technology Support Unit",
      expertise: "",
      education: "",
      email: "",
      bio: "",
      image: "/images/team/mark-lister-nalupa.jpg"
    },
    {
      name: "Noreza P. Aleno",
      position: "Administrative Staff, TPCO – Innovation and Technology Support Unit",
      expertise: "",
      education: "",
      email: "",
      bio: "",
      image: "/images/team/noreza-aleno.jpg"
    },
    {
      name: "Krystia Ces G. Napili",
      position: "Science Research Specialist, Technology Promotions and Commercialization Office",
      expertise: "",
      education: "",
      email: "",
      bio: "",
      image: "/images/team/krystia-ces-napili.jpg"
    },
    {
      name: "Michael J. Cerbito",
      position: "Administrative Assistant, Technology Promotions and Commercialization Office",
      expertise: "",
      education: "",
      email: "",
      bio: "",
      image: "/images/team/michael-cerbito.jpg"
    }
  ];

  const partners = [
    {
      name: "Oro Chamber of Commerce and Industry",
      logo: "/images/partners/oro-chamber.png"
    },
    {
      name: "Ateneo Innovation and Patent Office (IPO)",
      logo: "/images/partners/ateneo-ipo.png",
      large: true
    },
    {
      name: "Department of Science and Technology (DOST) Region X",
      logo: "/images/partners/dost-region-x.png"
    },
    {
      name: "Department of Trade and Industry (DTI) Misamis Oriental",
      logo: "/images/partners/dti-mis-or.png"
    },
    {
      name: "CDO b.i.t.e.s.",
      logo: "/images/partners/cdo-bites.jpg"
    },
    {
      name: "Intellectual Property Office of the Philippines (IPOPhil)",
      logo: "/images/partners/ipophil.png"
    },
    {
      name: "USAID",
      logo: "/images/partners/usaid.png",
      xlarge: true
    },
    {
      name: "RTI International",
      logo: "/images/partners/rti-international.png",
      large: true
    },
    {
      name: "Food Innovation Center (Northern Mindanao)",
      logo: "/images/partners/food-innovation-center.png",
      large: true
    },
    {
      name: "OROBEST Innovation",
      logo: "/images/partners/orobest-innovation.png"
    },
    {
      name: "DOST-PCIEERD",
      logo: "/images/partners/dost-pcieerd.png"
    },
    {
      name: "Best Friend Goodies",
      logo: "/images/partners/best-friend-goodies.png"
    },
    {
      name: "Bukidnon State University",
      logo: "/images/partners/bukidnon-state-university.png"
    },
    {
      name: "European Chamber of Commerce of the Philippines (ECCP)",
      logo: "/images/partners/eccp.png"
    },
    {
      name: "Asian Development Bank",
      logo: "/images/partners/asian-development-bank.png"
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
                <Button 
                  variant="gold" 
                  size="lg"
                  onClick={() => navigate('/contact')}
                >
                  Contact Our Team
                  <Mail className="ml-2" />
                </Button>
                <Button 
                  variant="gold-outline" 
                  size="lg"
                  onClick={() => window.open('https://maps.app.goo.gl/QADDEJs8reyJs9959', '_blank')}
                >
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

      {/* About Us Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-roboto font-bold text-primary mb-8 text-center">
              About Us
            </h2>
            <div className="space-y-6 text-muted-foreground leading-relaxed text-lg">
              <p>
                The Technology Promotions and Commercialization Office (TPCO) serves as the interface between the talent and technology housed in the academic institute, the industry, and the community; fostering new relationships and partnerships resulting in life-changing innovations, enhanced productivity and ingenious discoveries that amends the human condition. The TPCO ambitiously aspires to be in the innovation map, visibly interfacing with stakeholders and creating a significant mark in fostering innovations not just in the academe but in the whole innovation community.
              </p>
              <p>
                At the TPCO, we contribute towards nurturing an empowered innovation ecosystem that promotes entrepreneurship and commercialization of technologies to contribute to the economic and social development of the community it serves. As part of the university's commitment in delivering its Strategic Directional Areas, the TPCO was established and approved by the Board of Regents in May 2020 amidst the challenges of the COVID-19 pandemic in the country. The office was officially launched to the public in August 2020 and is strategically poised right at the forefront of the university making it accessible for stakeholders.
              </p>
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
                  Create and nurture a working innovation ecosystem that promotes entrepreneurship and commercialization of technologies to contribute to the economic and social development of the community it services.
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
                  To be on the innovation map, visibly interfacing with stakeholders and creating a significant mark in fostering innovations not just in the academe but in the whole innovation community.
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
            <h2 className="text-3xl md:text-4xl font-roboto font-bold text-primary text-white mb-4">
              Our Expert Team
            </h2>
            <p className="text-lg text-muted-foreground text-white max-w-3xl mx-auto">
              Meet the dedicated professionals driving innovation and technology transfer at USTP TPCO.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="group hover:shadow-card transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6 text-center">
                  <div className="mx-auto mb-4">
                    <Avatar className="w-20 h-20 mx-auto">
                      <AvatarImage src={member.image} alt={member.name} />
                      <AvatarFallback className="bg-gradient-ustp text-white font-roboto font-bold text-xl">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
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
      <section id="strategic-partners" className="py-16 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-roboto font-bold text-primary mb-4 text-white">
              Our Strategic Partners
            </h2>
            <p className="text-lg text-muted-foreground text-primary-foreground/80">
              Collaborating with leading organizations to drive innovation and economic development
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-10 items-center justify-items-center">
            {partners.map((partner, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-8 w-full min-h-[220px]"
                title={partner.name}
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className={`object-contain ${partner.xlarge ? 'max-w-[270px] max-h-[190px]' : partner.large ? 'max-w-[260px] max-h-[180px]' : 'max-w-[220px] max-h-[160px]'} w-auto h-auto`}
                />
              </div>
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
            <Button variant="gold" size="lg" onClick={() => navigate('/contact')}>
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