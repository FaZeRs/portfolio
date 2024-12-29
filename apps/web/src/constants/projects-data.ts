export const projectsData = [
  {
    id: 1,
    title: "Portfolio",
    slug: "portfolio",
    description:
      "My personal portfolio website, built with Next.js, Tailwind CSS, and TypeScript.",
    content: `# Portfolio Website

This is my personal portfolio website built with modern web technologies. It showcases my projects, skills, and experience while serving as a platform to share my work with others.

## Tech Stack

The project is built using a modern tech stack with the following key technologies:

- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **tRPC** - End-to-end typesafe APIs
- **Turborepo** - High-performance build system
- **Drizzle** - TypeScript ORM

## Key Features

### 1. Monorepo Structure

The project uses a monorepo structure powered by Turborepo, organizing code into:

<Files>
  <Folder name="apps" defaultOpen>
    <File name="web" />
  </Folder>
  <Folder name="packages">
    <File name="api" />
    <File name="auth" />
    <File name="db" />
    <File name="ui" />
    <File name="validators" />
  </Folder>
  <Folder name="tooling">
    <File name="eslint" />
    <File name="prettier" />
    <File name="typescript" />
  </Folder>
</Files>

### 2. UI Components

The UI is built using a custom component library based on shadcn/ui, providing:

- Dark/Light theme support
- Responsive design
- Reusable components
- Tailwind CSS styling

### 3. Performance

The website is optimized for performance with:

- Server-side rendering
- Image optimization
- Code splitting
- Edge runtime support

## Development
      
To run this project locally:

\`\`\`bash
# Clone the repository
git clone https://github.com/FaZeRs/portfolio.git

# Install dependencies
pnpm install

# Start development server
pnpm dev
\`\`\`

## Deployment

The website is deployed on Vercel with:

- Automatic deployments
- Edge functions
- Analytics and Speed Insights
- Sentry error tracking`,
    imageUrl: "/images/projects/portfolio.png",
    isFeature: true,
    githubUrl: "https://github.com/fazers/portfolio",
    demoUrl: "https://naurislinde.dev",
    stack: [
      {
        name: "Next.js",
      },
      {
        name: "TailwindCSS",
      },
      {
        name: "TypeScript",
      },
      {
        name: "React.js",
      },
      {
        name: "Turborepo",
      },
      {
        name: "Trpc",
      },
      {
        name: "Drizzle",
      },
    ],
  },
  {
    id: 2,
    title: "LLM Chat",
    slug: "llm-chat",
    description: "A chat application built with C++, Qt 6 and Ollama",
    content: `# LLM Chat Desktop Application

## Overview
A modern desktop chat application built with Qt 6 and C++ for interacting with Large Language Models through Ollama. The application provides a sleek Material Design interface and robust features for AI-powered conversations.

## Key Features

- 🎨 **Modern Material Design UI** - Clean, intuitive interface with dark mode support
- 💬 **Chat Interface** - Multi-threaded conversations with message history
- 🔄 **Real-time Streaming** - Live streaming of AI responses
- 🌐 **Ollama Integration** - Seamless connection to local Ollama server
- ⚡ **High Performance** - Built with C++ and Qt for optimal speed
- 🛠️ **Customizable Settings** - Configurable options including:
  - Server URL
  - Model selection
  - System prompts
  - Keyboard shortcuts
  - UI preferences
- 🖥️ **Cross-platform** - Supports Windows and Linux

## Technical Details

### Architecture
- **Frontend**: Qt Quick/QML for modern UI components
- **Backend**: C++ core with Qt framework
- **Build System**: CMake with CPM for dependency management
- **Testing**: Comprehensive unit tests using Catch2
- **CI/CD**: GitHub Actions for automated builds and testing
- **Code Quality**: 
  - SonarCloud integration
  - Clang-tidy static analysis
  - CodeQL security scanning

### Development Environment
The project includes a complete development container setup with:
- GCC 14 / Clang 18
- Qt 6.8.0
- CMake 3.27+
- Code analysis tools
- Formatting tools

### Key Components
- Chat backend with Ollama API integration
- Thread management system
- Real-time message streaming
- Settings persistence
- Custom QML components

## Development Practices

- Modern C++23 standards
- Comprehensive error handling
- Memory safety focus
- Extensive documentation
- Automated testing
- CI/CD pipeline integration


## Project Structure
The project follows a clean, modular architecture:

<Files>
  <Folder name="src" defaultOpen>
    <File name="core" />
    <File name="chat" />
    <File name="quick" />
    <File name="qml" />
  </Folder>
</Files>

## Build & Development

### Prerequisites
- Qt 6.8.0+
- CMake 3.27+
- C++17 compatible compiler
- Ollama server

### Quick Start
\`\`\`bash
git clone https://github.com/FaZeRs/llm-chat.git
cmake -E make_directory build && cd build
cmake ..
make
\`\`\`

## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Links
- [GitHub Repository](https://github.com/FaZeRs/llm-chat)
- [Documentation](https://fazers.github.io/llm-chat/)
- [Bug Tracker](https://github.com/FaZeRs/llm-chat/issues)
`,
    imageUrl: "/images/projects/llm-chat.png",
    isFeature: false,
    githubUrl: "https://github.com/fazers/llm-chat",
    stack: [
      {
        name: "C++",
      },
      {
        name: "Qt",
      },
      {
        name: "Ollama",
      },
      {
        name: "CMake",
      },
    ],
  },
];
