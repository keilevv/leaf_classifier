import { useState } from "react";
import {
  FaLeaf,
  FaCamera,
  FaUsers,
  FaDatabase,
  FaBrain,
  FaUpload,
  FaCheckCircle,
  FaExclamationTriangle,
  FaGraduationCap,
  FaFlask,
  FaGlobe,
  FaArrowRight,
  FaLightbulb,
  FaEye,
  FaHandPaper,
  FaChartLine,
  FaSeedling,
  FaAward,
  FaBookOpen,
} from "react-icons/fa";
import utbLogo from "../../assets/images/utblogo.webp";
import backgroundImage from "../../assets/images/hero-background.webp";
import { useNavigate } from "react-router-dom";
import useStore from "../../hooks/useStore";
import Header from "../../Components/Layout/Header";

export default function Home() {
  const { user, setSelectedPage } = useStore();
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();

  const onGetStarted = () => {
    if (user) {
      setSelectedPage("upload");
    } else {
      setSelectedPage("login");
    }
    navigate("/upload");
  };

  const onLearnMore = () => {
    setSelectedPage("about");
    navigate("/about");
  };

  const steps = [
    {
      icon: FaCamera,
      title: "Take Photo",
      description:
        "Capture a clear image of a plant leaf following our guidelines",
    },
    {
      icon: FaUpload,
      title: "Upload Image",
      description: "Upload your photo to our AI-powered classification system",
    },
    {
      icon: FaBrain,
      title: "AI Analysis",
      description:
        "Our AI attempts to identify the plant species automatically",
    },
    {
      icon: FaUsers,
      title: "Human Input",
      description:
        "If AI can't identify it, you help by providing the species name",
    },
    {
      icon: FaDatabase,
      title: "Dataset Growth",
      description:
        "Your contribution helps improve our plant identification database",
    },
  ];

  const photographyTips = [
    {
      icon: FaEye,
      title: "Fill the Frame",
      description: "Make sure the leaf occupies most of the image frame",
      example: "✅ Leaf covers 70-80% of the photo",
    },
    {
      icon: FaLightbulb,
      title: "Good Lighting",
      description: "Use natural light or bright indoor lighting",
      example: "✅ Avoid shadows and dark areas",
    },
    {
      icon: FaHandPaper,
      title: "Steady Shot",
      description: "Keep the camera steady to avoid blurry images",
      example: "✅ Use both hands or a stable surface",
    },
    {
      icon: FaLeaf,
      title: "Single Leaf",
      description: "Focus on one leaf at a time for best results",
      example: "✅ Avoid multiple overlapping leaves",
    },
  ];

  const stats = [
    { number: "10,000+", label: "Images Collected", icon: FaCamera },
    { number: "500+", label: "Species Identified", icon: FaSeedling },
    { number: "1,200+", label: "Contributors", icon: FaUsers },
    { number: "85%", label: "AI Accuracy", icon: FaBrain },
  ];

  return (
    <div className="min-h-screen ">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 min-h-[28rem] md:min-h-[36rem]">
        <Header className="relative z-20 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-b border-gray-200 shadow" />
        <img
          src={backgroundImage}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 z-0 h-full w-full object-cover opacity-20"
        />
        <div className="absolute inset-0 z-10 pointer-events-none" />
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6  flex-col-reverse md:flex-row">
              <img src={utbLogo} alt="utblogo" className="h-25" />
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="p-6 bg-green-100 rounded-full">
                    <FaLeaf className="h-16 w-16 text-green-600" />
                  </div>
                  <div className="absolute -top-2 -right-2 p-2 bg-blue-100 rounded-full">
                    <FaBrain className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Plant<span className="text-green-600">AI</span> Dataset
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Help us build the world's largest crowdsourced plant
              identification dataset. Your photos train AI to recognize plant
              species worldwide.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 ">
              <div className="relative inline-flex group cursor-pointer">
                <div className="absolute z-30 transitiona-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt"></div>
                <a
                  className=" w-full z-40 cursor-pointer bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-colors flex items-center justify-center"
                  role="button"
                  onClick={onGetStarted}
                >
                  <FaCamera className="mr-2" />
                  Start Contributing
                  <FaArrowRight className="ml-2" />{" "}
                </a>
              </div>
              <button
                className=" cursor-pointer border-2 border-green-600 text-green-600 hover:bg-green-50 font-semibold py-4 px-8 rounded-lg text-lg transition-colors flex items-center justify-center"
                onClick={onLearnMore}
              >
                <FaBookOpen className="mr-2" />
                Learn More
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-lg">
                  <div className="flex justify-center mb-3">
                    <stat.icon className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our crowdsourcing approach combines AI technology with human
              expertise to build a comprehensive plant database
            </p>
          </div>

          <div className="relative">
            {/* Progress Line */}
            <div className="hidden md:block absolute top-20 left-0 right-0 h-1 bg-gray-200">
              <div
                className="h-full bg-green-500 transition-all duration-500"
                style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
              />
            </div>

            <div className="grid md:grid-cols-5 gap-8">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`relative cursor-pointer transition-all duration-300 ${
                    index <= activeStep ? "opacity-100" : "opacity-60"
                  }`}
                  onMouseEnter={() => setActiveStep(index)}
                >
                  <div className="text-center">
                    <div
                      className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center transition-colors ${
                        index <= activeStep
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      <step.icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 mt-5 md:mt-10">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Photography Guidelines */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Photography Guidelines
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Follow these simple guidelines to capture high-quality images that
              help our AI learn better
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {photographyTips.map((tip, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <tip.icon className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">
                  {tip.title}
                </h3>
                <p className="text-gray-600 text-center mb-3">
                  {tip.description}
                </p>
                <div className="text-sm text-green-600 text-center font-medium">
                  {tip.example}
                </div>
              </div>
            ))}
          </div>

          {/* Visual Examples */}
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Photo Examples
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="text-center">
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 mb-4">
                  <img
                    src="/placeholder.svg?height=200&width=300&text=Good+Example"
                    alt="Good photo example"
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <div className="flex items-center justify-center text-green-600 font-semibold">
                    <FaCheckCircle className="mr-2" />
                    Good Example
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Leaf fills frame, good lighting, clear focus, single
                    specimen
                  </p>
                </div>
              </div>

              <div className="text-center">
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 mb-4">
                  <img
                    src="/placeholder.svg?height=200&width=300&text=Avoid+This"
                    alt="Bad photo example"
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <div className="flex items-center justify-center text-red-600 font-semibold">
                    <FaExclamationTriangle className="mr-2" />
                    Avoid This
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Too far away, poor lighting, multiple leaves, blurry image
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Research & University Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-6">
                <div className="p-3 bg-blue-100 rounded-full mr-4">
                  <FaGraduationCap className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    University Research Project
                  </h3>
                  <p className="text-gray-600">
                    Department of Computer Science & Biology
                  </p>
                </div>
              </div>

              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Advancing Plant Science Through AI
              </h2>

              <p className="text-lg text-gray-600 mb-6">
                This project is part of ongoing research at our university to
                develop more accurate and accessible plant identification
                systems. Your contributions directly support scientific research
                and conservation efforts worldwide.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <FaFlask className="h-6 w-6 text-green-600 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Research Impact
                    </h4>
                    <p className="text-gray-600">
                      Supporting biodiversity research and conservation efforts
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <FaGlobe className="h-6 w-6 text-blue-600 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Global Collaboration
                    </h4>
                    <p className="text-gray-600">
                      Working with botanists and researchers worldwide
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <FaAward className="h-6 w-6 text-purple-600 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Open Science
                    </h4>
                    <p className="text-gray-600">
                      All data will be made available for scientific research
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Principal Investigators
                </h4>
                <p className="text-gray-600 mb-2">
                  Dr. Sarah Johnson - Computer Science Department
                </p>
                <p className="text-gray-600 mb-2">
                  Dr. Michael Chen - Biology Department
                </p>
                <p className="text-sm text-gray-500">
                  University of Technology • Plant AI Research Lab
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg p-8">
                <div className="flex items-center mb-4">
                  <FaChartLine className="h-8 w-8 text-green-600 mr-3" />
                  <h3 className="text-xl font-bold text-gray-900">
                    Project Goals
                  </h3>
                </div>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-center">
                    <FaCheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    Collect 100,000+ plant images
                  </li>
                  <li className="flex items-center">
                    <FaCheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    Identify 1,000+ plant species
                  </li>
                  <li className="flex items-center">
                    <FaCheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    Achieve 95% AI accuracy
                  </li>
                  <li className="flex items-center">
                    <FaCheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    Open-source the dataset
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg p-8">
                <div className="flex items-center mb-4">
                  <FaUsers className="h-8 w-8 text-blue-600 mr-3" />
                  <h3 className="text-xl font-bold text-gray-900">
                    Join Our Community
                  </h3>
                </div>
                <p className="text-gray-700 mb-4">
                  Become part of a global community of citizen scientists
                  contributing to plant research.
                </p>
                <div className="flex space-x-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      1,200+
                    </div>
                    <div className="text-sm text-gray-600">Contributors</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">50+</div>
                    <div className="text-sm text-gray-600">Countries</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">24/7</div>
                    <div className="text-sm text-gray-600">Active</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Every photo you contribute helps advance plant science and
            conservation. Join thousands of contributors making a real impact.
          </p>

          <button
            onClick={onGetStarted}
            className="cursor-pointer bg-white text-green-600 hover:bg-gray-100 font-bold py-4 px-12 rounded-lg text-xl transition-colors inline-flex items-center"
          >
            <FaCamera className="mr-3" />
            Start Contributing Now
            <FaArrowRight className="ml-3" />
          </button>

          <p className="text-green-100 mt-6 text-sm">
            Free to use • No registration required • Make an impact today
          </p>
        </div>
      </section>
    </div>
  );
}
