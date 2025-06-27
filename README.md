# Innovative – Commish Track 2.0

A modern web application that automates the parsing and tracking of insurance commission statements using AI-powered field extraction and intelligent data processing.

## 🎯 Purpose

Innovative – Commish Track 2.0 streamlines the complex process of handling insurance commission statements by:

- **Automating Data Extraction**: Uses GPT-4 to intelligently parse PDF and Excel commission statements
- **Standardizing Workflows**: Provides consistent field mapping and approval processes
- **Enhancing Collaboration**: Multi-role system enables team-based statement processing
- **Improving Accuracy**: AI-powered validation reduces manual errors and processing time

## ✨ Features

### 📄 Document Processing
- **Multi-format Support**: Upload PDF and Excel commission statements
- **Drag & Drop Interface**: Intuitive file upload with visual feedback
- **Batch Processing**: Handle multiple statements simultaneously
- **File Validation**: Automatic format and content validation

### 🤖 AI-Powered Field Extraction
- **GPT-4 Integration**: Advanced natural language processing for field identification
- **Smart Parsing**: Automatically extracts commission data, dates, amounts, and policy details
- **Context Awareness**: Understands different statement formats and layouts
- **Learning Capability**: Improves accuracy over time with usage

### 🔄 Field Mapping Approval Flow
- **Interactive Mapping**: Visual field mapping interface for data validation
- **Approval Workflow**: Multi-step approval process with role-based permissions
- **Error Correction**: Easy editing and correction of extracted fields
- **Audit Trail**: Complete history of changes and approvals

### 💬 Persistent Sidebar Copilot
- **Always Available**: Fixed sidebar for instant AI assistance
- **Contextual Help**: Ask questions about uploaded statements
- **Real-time Guidance**: Get help with field mapping and data interpretation
- **Conversation History**: Maintains chat context throughout the session

### 👥 Multi-Role User System
- **Admin Role**: Full system access, user management, and configuration
- **Manager Role**: Statement approval, team oversight, and reporting
- **User Role**: Basic statement processing and field mapping
- **Role-based Permissions**: Secure access control for different user levels

## 🛠 Tech Stack

### Frontend
- **React 18**: Modern UI framework with hooks and functional components
- **TypeScript**: Type-safe development for better code quality
- **Styled JSX**: Component-scoped styling for maintainable CSS

### AI & Backend
- **GPT-4**: Advanced AI model for intelligent document parsing
- **OpenAI API**: Integration for natural language processing
- **RESTful APIs**: Clean API design for data communication

### Deployment & Infrastructure
- **Vercel**: Planned deployment platform for optimal performance
- **Git**: Version control and collaboration
- **Environment Variables**: Secure configuration management

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager
- OpenAI API key (for GPT-4 integration)

### Installation
```bash
# Clone the repository
git clone [repository-url]
cd innovative-commish-track-2.0

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your OpenAI API key

# Start development server
npm run dev
```

### Environment Variables
Create a `.env` file in the project root:
```env
OPENAI_API_KEY=your_openai_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📁 Project Structure

```
innovative-commish-track-2.0/
├── ui/
│   ├── components/
│   │   ├── FileUploader.tsx      # Document upload interface
│   │   ├── SidebarCopilot.tsx    # AI assistant sidebar
│   │   └── App.tsx              # Main application component
│   └── ...
├── .gitignore                   # Git ignore rules
├── README.md                    # Project documentation
└── package.json                 # Dependencies and scripts
```

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run test suite

### Code Style
- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Conventional commits for version control

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation for common solutions

---

**Innovative – Commish Track 2.0** - Revolutionizing insurance commission statement processing with AI-powered automation. 