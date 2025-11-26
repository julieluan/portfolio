const portfolioData = {
  design: {
    title: "DESIGN",
    desc: "Fusing tactile storytelling, branding, and spatial imagination.",
    color: "#ff0055",
    projects: [
      {
        name: "Tag Tracks: Toy Design",
        subtitle: "Moose Toys Sponsored",
        summary: "A diorama-inspired collectible line with story-rich play.",
        slug: "tag-tracks",
        problem:
          "Children’s collectible toys often lack deeper narrative, tactile interaction, and display value.",
        outcome:
          "A diorama-inspired collectible toy line with a strong aesthetic identity and modular story tiles.",
        role: "Product Manager & 3D Modeler",
        process: [
          "User interviews with children and parents",
          "Play pattern exploration",
          "Prototyping with Shapr3D",
          "Branding, packaging, and visual development",
          "Market testing across multiple iterations"
        ],
        impact:
          "Delivered manufacturing-ready prototypes with validated play patterns and shelf presence."
      },
      {
        name: "Business Pitch Projects",
        subtitle: "Honda / Google / Meow Wolf / IYA",
        summary: "Future-facing proposals across mobility, art-tech, and education.",
        slug: "business-pitch-projects",
        problem:
          "Companies need fresh perspectives to explore future markets and solve emerging problems.",
        outcome:
          "Concept proposals spanning future mobility, education, healthcare, emergency prevention, and art-tech experiences.",
        role: "Researcher & Graphic/UX Designer",
        process: [
          "User research and trend mapping",
          "Concept design + speculative scenarios",
          "Wireframes and visual storytelling",
          "Pitch deck creation for executive reviews"
        ],
        impact:
          "Contributed to presentations selected for multiple showcase reviews and partner discussions."
      }
    ]
  },
  tech: {
    title: "TECHNOLOGY",
    desc: "Full-stack engineering and data visualization for high-stakes systems.",
    color: "#00aaff",
    projects: [
      {
        name: "AI-Powered Disaster Response Mapping System",
        subtitle: "AWS × Vanderbilt Hackathon",
        summary: "Real-time danger mapping for emergency responders.",
        slug: "ai-disaster-response",
        problem:
          "Emergency responders lack real-time visibility into blocked roads, trapped civilians, and high-risk zones.",
        outcome:
          "An AI-driven visualization platform mapping danger zones using drone and thermal sensor data.",
        role: "Product Manager & Frontend Developer",
        process: [
          "Defined product scope and safety requirements",
          "Built backend data pipeline in Python",
          "Designed real-time API architecture",
          "Developed interactive map UI with React",
          "Used AWS Amplify for continuous deployment",
          "Tested with simulated disaster datasets"
        ],
        impact:
          "Enabled faster, clearer situational understanding for emergency responders."
      },
      {
        name: "Counter-Strike 2 Market Data Visualization",
        summary: "Linking CS2 economy movements to global signals.",
        slug: "cs2-market-visualization",
        problem:
          "Players lack tooling that shows how CS2 skin prices correlate with real-world trends.",
        outcome:
          "An interactive dashboard connecting CS2 market data with S&P 500, COVID-19, and Google Trends.",
        role: "Data Analysis Engineer",
        process: [
          "Data collection and cleaning",
          "SQL database design",
          "HTML/CSS chart development",
          "User interviews and UI refinement",
          "Multiple data-visualization iterations"
        ],
        impact:
          "Helped players understand macro-economic patterns behind market fluctuations."
      }
    ]
  },
  business: {
    title: "BUSINESS",
    desc: "Strategy sprints that turn research into scalable programs.",
    color: "#00ffaa",
    projects: [
      {
        name: "Northrop Grumman FabLab Innovation Sprint",
        summary: "A mobile Fab Lab program reaching 1,000+ students.",
        slug: "fablab-innovation-sprint",
        problem:
          "STEM opportunities remain limited for underrepresented student communities.",
        outcome:
          "A scalable mobile Fab Lab program delivering hands-on innovation experiences to 1,000+ students.",
        role: "Product Manager",
        process: [
          "Field research and community analysis",
          "Designed mobile lab workflow and curriculum",
          "Built financial and resource models",
          "Created deployment and partnership strategy"
        ],
        impact:
          "Projected 15% ROI through increased outreach efficiency and brand visibility."
      },
      {
        name: "Snyping Game",
        subtitle: "Startup Project",
        summary: "Data-backed concept validation for indie studios.",
        slug: "snyping-game",
        problem:
          "Indie studios often lack actionable insight into profitable audiences and ad channels.",
        outcome:
          "A validated product concept supported by market, user, and funnel analysis.",
        role: "Product Manager & Data Analyst",
        process: [
          "Market + competitor research",
          "Designed user flows and product concept",
          "Built Excel-based traffic and ad performance models",
          "Identified key channels and audience personas"
        ],
        impact:
          "Influenced product direction and go-to-market strategy with data-backed recommendations."
      }
    ]
  }
};

export const getProjectBySlug = (slug) => {
  for (const category of Object.values(portfolioData)) {
    const match = category.projects.find((project) => project.slug === slug);
    if (match) {
      return { ...match, category };
    }
  }
  return null;
};

export default portfolioData;

