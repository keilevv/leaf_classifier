import {
  FaLeaf,
  FaFlask,
  FaGlobe,
  FaChartLine,
  FaAward,
  FaHeart,
  FaSeedling,
  FaShieldAlt,
  FaHandsHelping,
  FaEye,
  FaBookOpen,
  FaUniversity,
  FaEnvira,
  FaBug,
  FaExclamationTriangle,
  FaCheckCircle,
  FaArrowRight,
  FaDatabase,
} from "react-icons/fa";
import Header from "../../Components/Layout/Header";

function About({ onGetStarted }) {
  const investigators = [
    {
      name: "Dr. María Elena Rodríguez",
      title: "Principal Investigator",
      department: "Department of Plant Pathology",
      specialization: "Plant Disease Diagnostics & AI Applications",
      image: "/placeholder.svg?height=200&width=200&text=Dr.+Rodriguez",
      bio: "Leading expert in plant pathology with 15+ years of experience in Colombian agricultural systems. Specializes in integrating AI technologies with traditional plant disease diagnosis.",
    },
    {
      name: "Dr. Carlos Andrés Mejía",
      title: "Co-Principal Investigator",
      department: "Department of Computer Science",
      specialization: "Machine Learning & Computer Vision",
      image: "/placeholder.svg?height=200&width=200&text=Dr.+Mejia",
      bio: "Computer vision researcher focused on agricultural applications. Expert in deep learning models for image classification and pattern recognition in biological systems.",
    },
    {
      name: "Dr. Ana Lucía Vargas",
      title: "Research Collaborator",
      department: "Department of Biology",
      specialization: "Colombian Flora & Biodiversity",
      image: "/placeholder.svg?height=200&width=200&text=Dr.+Vargas",
      bio: "Botanist specializing in Colombian native species. Curator of the university's herbarium with extensive knowledge of regional plant diversity and taxonomy.",
    },
  ];

  const objectives = [
    {
      icon: FaDatabase,
      title: "Comprehensive Database Creation",
      description:
        "Build the most extensive database of Colombian plant species with disease classifications",
      details:
        "Targeting 2,000+ native species with multiple disease states documented",
    },
    {
      icon: FaBug,
      title: "Disease Pattern Recognition",
      description:
        "Develop AI models to identify early signs of plant diseases in Colombian flora",
      details:
        "Focus on fungal, bacterial, viral, and nutrient deficiency symptoms",
    },
    {
      icon: FaShieldAlt,
      title: "Agricultural Protection",
      description:
        "Create tools to help farmers and researchers protect Colombian crops",
      details:
        "Early detection system to prevent crop losses and improve food security",
    },
    {
      icon: FaGlobe,
      title: "Biodiversity Conservation",
      description:
        "Support conservation efforts for Colombia's unique plant biodiversity",
      details:
        "Document and preserve knowledge of endemic species and their health patterns",
    },
  ];

  const impacts = [
    {
      category: "Agricultural Impact",
      icon: FaSeedling,
      color: "green",
      items: [
        "Reduce crop losses by 30-40% through early disease detection",
        "Support 50,000+ Colombian farmers with diagnostic tools",
        "Improve food security for rural communities",
        "Enhance sustainable farming practices",
      ],
    },
    {
      category: "Scientific Impact",
      icon: FaFlask,
      color: "blue",
      items: [
        "First comprehensive Colombian plant disease database",
        "Advance AI applications in tropical agriculture",
        "Support botanical research and taxonomy",
        "Enable predictive disease modeling",
      ],
    },
    {
      category: "Economic Impact",
      icon: FaChartLine,
      color: "purple",
      items: [
        "Prevent $100M+ in annual crop losses",
        "Create new agtech opportunities",
        "Support rural economic development",
        "Reduce pesticide dependency costs",
      ],
    },
    {
      category: "Environmental Impact",
      icon: FaEnvira,
      color: "emerald",
      items: [
        "Preserve Colombia's unique biodiversity",
        "Reduce chemical pesticide usage",
        "Support ecosystem health monitoring",
        "Enable climate change adaptation strategies",
      ],
    },
  ];

  const challenges = [
    {
      icon: FaExclamationTriangle,
      title: "Colombia's Agricultural Challenge",
      description:
        "Colombia loses 25-30% of its agricultural production annually due to plant diseases, affecting food security and farmer livelihoods.",
    },
    {
      icon: FaEye,
      title: "Limited Diagnostic Tools",
      description:
        "Rural farmers lack access to plant pathologists and diagnostic laboratories, leading to delayed treatment and crop losses.",
    },
    {
      icon: FaGlobe,
      title: "Biodiversity at Risk",
      description:
        "Colombia's unique flora faces threats from climate change and diseases, with limited documentation of disease patterns.",
    },
  ];

  return (
    <>
      {" "}
      <Header className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50" />
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        {/* Hero Section */}
        <section className="relative  bg-gradient-to-r from-green-600 to-emerald-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center text-white">
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="p-6 bg-white bg-opacity-20 rounded-full">
                    <FaLeaf className="h-16 w-16" />
                  </div>
                  <div className="absolute -top-2 -right-2 p-2 bg-yellow-400 rounded-full">
                    <FaBug className="h-6 w-6 text-yellow-800" />
                  </div>
                </div>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                About Our <span className="text-yellow-300">Mission</span>
              </h1>

              <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto opacity-90">
                Protecting Colombia's agricultural heritage and biodiversity
                through AI-powered plant disease identification and crowdsourced
                data collection.
              </p>

              <div className="flex justify-center">
                <div className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-sm">
                  <div className="flex items-center justify-center space-x-8">
                    <div className="text-center">
                      <div className="text-3xl font-bold">🇨🇴</div>
                      <div className="text-sm opacity-80">Colombian Focus</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold">2,000+</div>
                      <div className="text-sm opacity-80">Target Species</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold">AI</div>
                      <div className="text-sm opacity-80">Powered</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The Challenge Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                The Challenge We're Addressing
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Colombia faces significant agricultural and biodiversity
                challenges that require innovative solutions
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {challenges.map((challenge, index) => (
                <div
                  key={index}
                  className="bg-red-50 border border-red-200 rounded-lg p-6"
                >
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-red-100 rounded-full">
                      <challenge.icon className="h-8 w-8 text-red-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
                    {challenge.title}
                  </h3>
                  <p className="text-gray-700 text-center">
                    {challenge.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Solution Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Our Solution
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                A comprehensive approach combining crowdsourcing, AI technology,
                and expert knowledge to build Colombia's first plant disease
                classification database
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {objectives.map((objective, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-green-100 rounded-full">
                      <objective.icon className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">
                    {objective.title}
                  </h3>
                  <p className="text-gray-600 text-center mb-3">
                    {objective.description}
                  </p>
                  <p className="text-sm text-green-600 text-center font-medium">
                    {objective.details}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* University Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-blue-100 rounded-full mr-4">
                    <FaUniversity className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Universidad Nacional de Colombia
                    </h3>
                    <p className="text-gray-600">
                      Sede Bogotá • Facultad de Ciencias
                    </p>
                  </div>
                </div>

                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Leading Agricultural Research in Colombia
                </h2>

                <p className="text-lg text-gray-600 mb-6">
                  As Colombia's premier public university, Universidad Nacional
                  has been at the forefront of agricultural research for over
                  150 years. Our interdisciplinary approach combines traditional
                  botanical knowledge with cutting-edge AI technology.
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start">
                    <FaAward className="h-6 w-6 text-yellow-500 mr-3 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Research Excellence
                      </h4>
                      <p className="text-gray-600">
                        Ranked #1 in Colombia for agricultural and biological
                        sciences
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <FaBookOpen className="h-6 w-6 text-green-600 mr-3 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Herbarium Collection
                      </h4>
                      <p className="text-gray-600">
                        Home to over 500,000 plant specimens, including rare
                        Colombian species
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <FaHandsHelping className="h-6 w-6 text-blue-600 mr-3 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Community Impact
                      </h4>
                      <p className="text-gray-600">
                        Serving Colombian farmers and communities for
                        generations
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Project Funding & Support
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <FaCheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">
                      COLCIENCIAS Research Grant
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FaCheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">
                      Ministry of Agriculture Partnership
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FaCheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">
                      International Collaboration Network
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FaCheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">
                      Private Sector Partnerships
                    </span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-white rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Project Timeline
                  </h4>
                  <div className="text-sm text-gray-600">
                    <p>Phase 1 (2024): Database Development</p>
                    <p>Phase 2 (2025): AI Model Training</p>
                    <p>Phase 3 (2026): Field Implementation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Research Team Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Meet Our Research Team
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Leading experts in plant pathology, computer science, and
                Colombian biodiversity working together to advance agricultural
                science
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {investigators.map((investigator, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-lg overflow-hidden"
                >
                  <img
                    src={investigator.image || "/placeholder.svg"}
                    alt={investigator.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {investigator.name}
                    </h3>
                    <p className="text-green-600 font-medium mb-2">
                      {investigator.title}
                    </p>
                    <p className="text-sm text-gray-600 mb-3">
                      {investigator.department}
                    </p>
                    <p className="text-sm font-medium text-blue-600 mb-3">
                      {investigator.specialization}
                    </p>
                    <p className="text-sm text-gray-700">{investigator.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Expected Impact
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                This project will create lasting positive change across multiple
                sectors in Colombia and beyond
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {impacts.map((impact, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-8">
                  <div className="flex items-center mb-6">
                    <div
                      className={`p-3 bg-${impact.color}-100 rounded-full mr-4`}
                    >
                      <impact.icon
                        className={`h-8 w-8 text-${impact.color}-600`}
                      />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {impact.category}
                    </h3>
                  </div>

                  <ul className="space-y-3">
                    {impact.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start">
                        <FaCheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-600">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-white mb-6">
              Join Our Mission
            </h2>
            <p className="text-xl text-green-100 mb-8">
              Help us build the future of Colombian agriculture and biodiversity
              conservation. Every contribution makes a difference.
            </p>

            <button
              onClick={onGetStarted}
              className="bg-white text-green-600 hover:bg-gray-100 font-bold py-4 px-12 rounded-lg text-xl transition-colors inline-flex items-center"
            >
              <FaHeart className="mr-3" />
              Start Contributing
              <FaArrowRight className="ml-3" />
            </button>

            <p className="text-green-100 mt-6 text-sm">
              Together, we can protect Colombia's agricultural future and
              preserve its incredible biodiversity
            </p>
          </div>
        </section>
      </div>
    </>
  );
}

export default About;
