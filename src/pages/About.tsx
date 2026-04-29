import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Mail, Phone, MapPin, Award, Users, Target, Heart, Building2, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  // Carousel team members — filenames in /public/images/team/tpco-team/ map to display names
  const teamMembers = [
    { nickname: "Ven",   fullName: "Dr. Venessa A. Garcia",           title: "TPCO Director",                    image: "/images/team/tpco-team/Ven.png"   },
    { nickname: "Gladi", fullName: "Engr. Gladdy Christie H. Compasan", title: "Manager \u2014 ITSU",              image: "/images/team/tpco-team/Gladi.png" },
    { nickname: "Carl",  fullName: "Geoffrey Carlo P. Delada",         title: "Administrative Assistant",         image: "/images/team/tpco-team/Carl.png"  },
    { nickname: "Rhea",  fullName: "Rhea Suzette M. Haguisan",         title: "Manager \u2014 BDU",               image: "/images/team/tpco-team/Rhea.png"  },
    { nickname: "Jodie", fullName: "Engr. Jodie Rey D. Fernandez",     title: "Technology Promotions Officer",    image: "/images/team/tpco-team/Jodie.png" },
    { nickname: "Clark", fullName: "Engr. Clark Darwin Gozon",         title: "Technical Expert",                 image: "/images/team/tpco-team/Clark.png" },
    { nickname: "Nas",   fullName: "Fatimah Nasra P. Hamoy",           title: "Technical Expert",                 image: "/images/team/tpco-team/Nas.png"   },
    { nickname: "Nor",   fullName: "Noreza P. Ale\u00f1o",             title: "Administrative Staff",             image: "/images/team/tpco-team/Nor.png"   },
    { nickname: "Ces",   fullName: "Krystia Ces G. Napili",            title: "Science Research Specialist",      image: "/images/team/tpco-team/Ces.png"   },
    { nickname: "Mich",  fullName: "Atty. Michelle M. Bacarra",        title: "Contract Management Officer",      image: "/images/team/tpco-team/Mich.png"  },
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
                  <div className="text-2xl font-roboto font-bold text-white mb-1">10</div>
                  <div className="text-primary-foreground/80 text-sm">Expert Team Members</div>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6 text-center">
                  <Building2 className="text-secondary mx-auto mb-3" size={32} />
                  <div className="text-2xl font-roboto font-bold text-white mb-1">3</div>
                  <div className="text-primary-foreground/80 text-sm">Specialized Units</div>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6 text-center">
                  <Briefcase className="text-secondary mx-auto mb-3" size={32} />
                  <div className="text-2xl font-roboto font-bold text-white mb-1">4+</div>
                  <div className="text-primary-foreground/80 text-sm">Core Services Offered</div>
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

      {/* Team Section — Professional Carousel */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-block text-xs font-semibold tracking-[0.2em] text-secondary uppercase mb-3">
              Our People
            </div>
            <h2 className="text-3xl md:text-4xl font-roboto font-bold text-primary mb-4">
              Meet our Team
            </h2>
            <div className="w-16 h-0.5 bg-secondary mx-auto mb-5"></div>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              A dedicated group of professionals driving innovation, technology transfer,
              and commercialization across Northern Mindanao.
            </p>
          </div>

          <div className="relative px-4 sm:px-8 md:px-16">
            <Carousel
              opts={{ align: "start", loop: true }}
              className="w-full max-w-6xl mx-auto"
            >
              <CarouselContent className="-ml-6">
                {teamMembers.map((member) => (
                  <CarouselItem
                    key={member.nickname}
                    className="pl-6 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                  >
                    <article className="group h-full rounded-lg bg-white border border-border overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-secondary/40">
                      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                        <img
                          src={member.image}
                          alt={member.fullName}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          loading="lazy"
                        />
                        <div className="absolute inset-x-0 bottom-0 h-1 bg-secondary scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500"></div>
                      </div>
                      <div className="p-5">
                        <h3 className="font-roboto font-bold text-primary text-[15px] leading-snug">
                          {member.fullName}
                        </h3>
                        <p className="mt-1 text-xs text-muted-foreground uppercase tracking-wide">
                          {member.title}
                        </p>
                      </div>
                    </article>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="-left-2 md:-left-10 bg-white border-primary/20 text-primary hover:bg-primary hover:text-white hover:border-primary" />
              <CarouselNext className="-right-2 md:-right-10 bg-white border-primary/20 text-primary hover:bg-primary hover:text-white hover:border-primary" />
            </Carousel>
          </div>
        </div>
      </section>

      {/* Organizational Chart Section — Corporate Tree */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Heading */}
          <div className="text-center mb-16">
            <div className="inline-block text-xs font-semibold tracking-[0.2em] text-secondary uppercase mb-3">
              Office Structure
            </div>
            <h2 className="text-3xl md:text-4xl font-roboto font-bold text-primary mb-4">
              TPCO Organizational Chart
            </h2>
            <div className="w-16 h-0.5 bg-secondary mx-auto mb-5"></div>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Our office is organized into three specialized units, each led by a dedicated
              manager reporting to the Director.
            </p>
          </div>

          <div className="max-w-6xl mx-auto lg:translate-x-16 xl:translate-x-24">
            {/* ===== Director + Admin Assistant sidecar ===== */}
            <div className="relative">
              <div className="flex justify-center">
                <div className="w-full sm:w-[30rem] bg-white rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-secondary"></div>
                  <div className="flex items-center gap-5 px-6 py-6">
                    <div className="w-24 h-32 rounded-md overflow-hidden bg-slate-100 ring-1 ring-border flex-shrink-0">
                      <img
                        src="/images/team/tpco-team/Ven.png"
                        alt="Dr. Venessa A. Garcia"
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="min-w-0 flex-1 text-left">
                      <div className="text-[10px] font-bold tracking-[0.25em] text-secondary uppercase">
                        TPCO Director
                      </div>
                      <div className="font-roboto font-bold text-primary text-xl md:text-[22px] mt-1 leading-tight">
                        Dr. Venessa A. Garcia
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed">
                        Technology Promotions and Commercialization Office
                      </div>
                    </div>
                  </div>
                </div>

                {/* Geoffrey sidecar — broken side link to Director (desktop) */}
                <div className="hidden lg:flex absolute top-1/2 -translate-y-1/2 left-[calc(50%+15.5rem)] items-center">
                  <div className="w-10 border-t-2 border-dashed border-slate-400"></div>
                  <div className="bg-white rounded-lg border border-dashed border-slate-300 shadow-sm px-3 py-3 flex items-center gap-3 w-60">
                    <div className="w-14 h-[4.5rem] rounded-md overflow-hidden bg-slate-100 ring-1 ring-border flex-shrink-0">
                      <img src="/images/team/tpco-team/Carl.png" alt="Geoffrey Carlo P. Delada" className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[9px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">Administrative Assistant</div>
                      <div className="text-primary font-medium text-[12px] leading-snug">Geoffrey Carlo P. Delada</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile / tablet fallback for Geoffrey */}
              <div className="lg:hidden mt-6 flex justify-center">
                <div className="bg-white rounded-lg border border-dashed border-slate-300 shadow-sm px-3 py-3 flex items-center gap-3 w-full max-w-sm">
                  <div className="w-14 h-[4.5rem] rounded-md overflow-hidden bg-slate-100 ring-1 ring-border flex-shrink-0">
                    <img src="/images/team/tpco-team/Carl.png" alt="Geoffrey Carlo P. Delada" className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[9px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">Administrative Assistant</div>
                    <div className="text-primary font-medium text-[12px] leading-snug">Geoffrey Carlo P. Delada</div>
                    <div className="text-[9px] text-muted-foreground italic mt-0.5">Reports to Director</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Connector stub under Director */}
            <div className="hidden md:flex justify-center">
              <div className="h-10 w-px bg-slate-300"></div>
            </div>

            {/* T-junction connectors aligned to 4 column centers */}
            <div className="hidden md:grid grid-cols-4">
              <div className="relative h-6">
                <div className="absolute left-1/2 right-0 top-0 h-px bg-slate-300"></div>
                <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-slate-300"></div>
              </div>
              <div className="relative h-6">
                <div className="absolute inset-x-0 top-0 h-px bg-slate-300"></div>
                <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-slate-300"></div>
              </div>
              <div className="relative h-6">
                <div className="absolute inset-x-0 top-0 h-px bg-slate-300"></div>
                <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-slate-300"></div>
              </div>
              <div className="relative h-6">
                <div className="absolute left-0 right-1/2 top-0 h-px bg-slate-300"></div>
                <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-slate-300"></div>
              </div>
            </div>

            {/* ===== 4 Columns: ITSU, PMU, BDU, Contract Mgmt ===== */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-4 mt-8 md:mt-0">
              {/* --- ITSU --- */}
              <div className="flex flex-col">
                {/* Unit header */}
                <div className="bg-white rounded-lg border border-border shadow-sm px-4 py-4 text-center">
                  <span className="inline-block px-2.5 py-0.5 rounded bg-secondary/15 text-secondary text-[10px] font-bold tracking-[0.25em] uppercase">
                    ITSU
                  </span>
                  <div className="font-roboto font-semibold text-primary text-[12px] mt-2 leading-snug">
                    Innovation &amp; Technology Support Unit
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="h-5 w-px bg-slate-300"></div>
                </div>
                {/* Manager: Gladdy + Noreza sidecar (broken side link) */}
                <div className="relative">
                  <div className="bg-white rounded-lg border border-border shadow-sm px-4 py-5 text-center">
                    <div className="w-28 aspect-[3/4] rounded-md overflow-hidden bg-slate-100 ring-1 ring-border mx-auto mb-3">
                      <img
                        src="/images/team/tpco-team/Gladi.png"
                        alt="Engr. Gladdy Christie H. Compasan"
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="text-[9px] font-semibold tracking-[0.22em] text-muted-foreground uppercase">Manager</div>
                    <div className="font-roboto font-semibold text-primary text-[12px] mt-1 leading-snug">
                      Engr. Gladdy Christie H. Compasan
                    </div>
                  </div>
                  {/* Noreza sidecar — broken side link to ITSU Manager (desktop lg+, left side) */}
                  <div className="hidden lg:flex absolute top-1/2 -translate-y-1/2 right-[calc(100%+0.25rem)] items-center z-20">
                    <div className="bg-white rounded-lg border border-dashed border-slate-300 shadow-sm px-3 py-3 flex items-center gap-3 w-56">
                      <div className="w-14 aspect-[3/4] rounded-md overflow-hidden bg-slate-100 ring-1 ring-border flex-shrink-0">
                        <img src="/images/team/tpco-team/Nor.png" alt="Noreza P. Aleño" className="w-full h-full object-cover" loading="lazy" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[9px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">Administrative Staff</div>
                        <div className="text-primary font-medium text-[12px] leading-snug">Noreza P. Aleño</div>
                      </div>
                    </div>
                    <div className="w-8 border-t-2 border-dashed border-slate-400 flex-shrink-0"></div>
                  </div>
                </div>
                {/* Solid connector to Fatimah */}
                <div className="flex justify-center">
                  <div className="h-5 w-px bg-slate-300"></div>
                </div>
                {/* Fatimah — solid connection */}
                <div className="bg-white rounded-lg border border-border shadow-sm px-3 py-3 flex items-center gap-3 hover:border-secondary/50 transition-colors">
                  <div className="w-14 aspect-[3/4] rounded-md overflow-hidden bg-slate-100 ring-1 ring-border flex-shrink-0">
                    <img src="/images/team/tpco-team/Nas.png" alt="Fatimah Nasra P. Hamoy" className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[9px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">Technical Expert</div>
                    <div className="text-primary font-medium text-[12px] leading-snug">Fatimah Nasra P. Hamoy</div>
                  </div>
                </div>
                {/* Noreza — mobile/tablet fallback (stacked below, dashed connector) */}
                <div className="lg:hidden flex justify-center">
                  <div className="h-5 border-l-2 border-dashed border-slate-400"></div>
                </div>
                <div className="lg:hidden bg-white rounded-lg border border-dashed border-slate-300 shadow-sm px-3 py-3 flex items-center gap-3">
                  <div className="w-14 aspect-[3/4] rounded-md overflow-hidden bg-slate-100 ring-1 ring-border flex-shrink-0">
                    <img src="/images/team/tpco-team/Nor.png" alt="Noreza P. Aleño" className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[9px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">Administrative Staff</div>
                    <div className="text-primary font-medium text-[12px] leading-snug">Noreza P. Aleño</div>
                  </div>
                </div>
              </div>

              {/* --- PMU --- */}
              <div className="flex flex-col">
                <div className="bg-white rounded-lg border border-border shadow-sm px-4 py-4 text-center">
                  <span className="inline-block px-2.5 py-0.5 rounded bg-secondary/15 text-secondary text-[10px] font-bold tracking-[0.25em] uppercase">
                    PMU
                  </span>
                  <div className="font-roboto font-semibold text-primary text-[12px] mt-2 leading-snug">
                    Promotions Management Unit
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="h-5 w-px bg-slate-300"></div>
                </div>
                {/* Empty Manager box */}
                <div className="bg-white rounded-lg border-2 border-dashed border-slate-300 px-4 py-5 flex flex-col items-center justify-center text-center min-h-[14rem]">
                  <div className="w-28 aspect-[3/4] rounded-md bg-slate-50 border border-dashed border-slate-200 mx-auto mb-3"></div>
                  <div className="text-[9px] font-semibold tracking-[0.22em] text-muted-foreground uppercase">Manager</div>
                  <div className="text-muted-foreground text-[11px] mt-1 italic">(Vacant)</div>
                </div>
                <div className="flex justify-center">
                  <div className="h-5 w-px bg-slate-300"></div>
                </div>
                {/* Jodie */}
                <div className="bg-white rounded-lg border border-border shadow-sm px-3 py-3 flex items-center gap-3 hover:border-secondary/50 transition-colors">
                  <div className="w-14 aspect-[3/4] rounded-md overflow-hidden bg-slate-100 ring-1 ring-border flex-shrink-0">
                    <img src="/images/team/tpco-team/Jodie.png" alt="Engr. Jodie Rey D. Fernandez" className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[9px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">Promotions &amp; Marketing Officer</div>
                    <div className="text-primary font-medium text-[12px] leading-snug">Engr. Jodie Rey D. Fernandez</div>
                  </div>
                </div>
              </div>

              {/* --- BDU --- */}
              <div className="flex flex-col">
                <div className="bg-white rounded-lg border border-border shadow-sm px-4 py-4 text-center">
                  <span className="inline-block px-2.5 py-0.5 rounded bg-secondary/15 text-secondary text-[10px] font-bold tracking-[0.25em] uppercase">
                    BDU
                  </span>
                  <div className="font-roboto font-semibold text-primary text-[12px] mt-2 leading-snug">
                    Business Development Unit
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="h-5 w-px bg-slate-300"></div>
                </div>
                {/* Manager: Rhea */}
                <div className="bg-white rounded-lg border border-border shadow-sm px-4 py-5 text-center">
                  <div className="w-28 aspect-[3/4] rounded-md overflow-hidden bg-slate-100 ring-1 ring-border mx-auto mb-3">
                    <img
                      src="/images/team/tpco-team/Rhea.png"
                      alt="Rhea Suzette M. Haguisan"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="text-[9px] font-semibold tracking-[0.22em] text-muted-foreground uppercase">Manager</div>
                  <div className="font-roboto font-semibold text-primary text-[12px] mt-1 leading-snug">
                    Rhea Suzette M. Haguisan
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="h-5 w-px bg-slate-300"></div>
                </div>
                {/* Krystia */}
                <div className="bg-white rounded-lg border border-border shadow-sm px-3 py-3 flex items-center gap-3 hover:border-secondary/50 transition-colors">
                  <div className="w-14 aspect-[3/4] rounded-md overflow-hidden bg-slate-100 ring-1 ring-border flex-shrink-0">
                    <img src="/images/team/tpco-team/Ces.png" alt="Krystia Ces G. Napili" className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[9px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">Science Research Specialist</div>
                    <div className="text-primary font-medium text-[12px] leading-snug">Krystia Ces G. Napili</div>
                  </div>
                </div>
              </div>

              {/* --- Contract Management Officer (direct report to Director) --- */}
              <div className="flex flex-col">
                <div className="bg-white rounded-lg border border-border shadow-sm px-4 py-5 text-center">
                  <div className="w-28 aspect-[3/4] rounded-md overflow-hidden bg-slate-100 ring-1 ring-border mx-auto mb-3">
                    <img
                      src="/images/team/tpco-team/Mich.png"
                      alt="Atty. Michelle M. Bacarra"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="text-[9px] font-semibold tracking-[0.22em] text-muted-foreground uppercase">Contract Management Officer</div>
                  <div className="font-roboto font-semibold text-primary text-[12px] mt-1 leading-snug">
                    Atty. Michelle M. Bacarra
                  </div>
                </div>
              </div>
            </div>
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
                (088) 856-1738 Local 1145<br />
              </p>
            </div>

            <div className="text-center">
              <Mail className="text-secondary mx-auto mb-3" size={32} />
              <h3 className="font-roboto font-semibold mb-2">Email</h3>
              <p className="text-primary-foreground/80">
                ustp.tpco@ustp.edu.ph<br />
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