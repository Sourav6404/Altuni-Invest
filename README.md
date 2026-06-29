# Altuni Invest

> **AI-Powered Multi-Agent Investment Research Platform**

Altuni Invest is an AI-powered investment research platform that automates the workflow of an equity research analyst or investment banker. Instead of relying on a single AI prompt, the platform uses multiple specialized AI agents that work together to research a company, analyze its financial health, evaluate industry conditions, assess risks, estimate valuation, and finally generate an investment recommendation.

The goal of this project was not simply to summarize company information, but to simulate how a professional investment analyst approaches equity research by combining multiple sources of information into a structured investment report.

---

# Project Overview

When analyzing a company for investment, professionals rarely rely on a single metric or news article. A proper investment decision requires understanding several independent aspects of the business, including:

- Company profile and business model
- Financial statements
- Industry and market conditions
- Competitor landscape
- Recent news
- Macroeconomic environment
- Investor and analyst sentiment
- Valuation metrics
- Business and financial risks

Manually collecting this information is time-consuming and requires switching between multiple financial platforms.

Altuni Invest automates this process using a collection of AI agents that collaborate to produce a complete investment research report from a single company name.

Instead of replacing financial analysis with a single LLM prompt, the project divides the problem into smaller specialized tasks. Each AI agent is responsible for one area of analysis and passes structured information to the next stage until a final investment recommendation is produced.

---

# Motivation

The idea for this project came from studying how investment bankers and equity research analysts evaluate companies before making investment recommendations.

I observed that experienced analysts never base their opinion on one dataset alone. They combine financial statements, company fundamentals, market trends, news, valuation metrics, and macroeconomic conditions before reaching a conclusion.

This inspired me to design an AI system that follows the same workflow.

Rather than asking one LLM to answer everything at once, I created multiple specialized agents that independently analyze different aspects of a company. Their outputs are then combined to generate a structured investment recommendation.

The objective was to build a practical AI system capable of performing real-world company research while maintaining modularity, scalability, and transparency.

---

# Key Features

### Company Research

- Company overview
- Business model
- Products and services
- CEO and management
- Industry and sector
- Headquarters
- Founding details
- Employee count

---

### Financial Statement Analysis

- Revenue
- Gross Profit
- Operating Income
- Net Income
- Earnings Per Share (EPS)
- Cash Flow
- Free Cash Flow
- Assets
- Liabilities
- Equity
- Debt
- Financial Ratios

---

### Competitor Analysis

- Major competitors
- Competitive advantages
- Weaknesses
- Market positioning
- Industry comparison

---

### Market & Industry Analysis

- Industry outlook
- Market growth
- Growth drivers
- Industry challenges
- Emerging opportunities
- Future trends

---

### News Analysis

- Recent company news
- News categorization
- Positive and negative impact analysis
- Importance ranking
- Overall news sentiment

---

### Macroeconomic Analysis

- Interest rates
- Inflation
- GDP growth
- Exchange rates
- Government policies
- Global economic risks

---

### Sentiment Analysis

- Analyst sentiment
- Retail investor sentiment
- Social media sentiment
- Overall market perception

---

### Valuation Analysis

- PE Ratio
- PEG Ratio
- Price to Book
- Price to Sales
- EV / EBITDA
- Fair Value
- Analyst Target Price
- Intrinsic Value Estimation

---

### Risk Assessment

- Financial Risk
- Market Risk
- Regulatory Risk
- Operational Risk
- Competitive Risk
- Macroeconomic Risk

---

### Investment Recommendation

Based on all previous analyses, the platform generates one of the following recommendations:

- Strong Buy
- Buy
- Hold
- Sell
- Strong Sell

Each recommendation is accompanied by a detailed explanation highlighting the key factors that influenced the final decision.

---

# Technology Stack

## Frontend

- React
- TypeScript
- Tailwind CSS
- Context API
- React Router
- Framer Motion

---

## Backend

- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose

---

## AI & Data Sources

- Google Gemini
- Tavily Search API
- Alpha Vantage API

---

## Validation

- Zod

---

## Development Tools

- npm
- tsx
- Git
- GitHub
- VS Code

---

# Project Highlights

- Multi-Agent AI Architecture
- Modular Backend Design
- REST API Architecture
- MongoDB Report Storage
- Analysis Caching
- Dashboard Integration
- AI-powered Investment Recommendations
- Modular Agent Pipeline
- Structured JSON Validation
- Recovery Agent for Missing Information

# System Architecture

Altuni Invest follows a modular multi-layer architecture where each layer has a single responsibility. Instead of allowing the frontend to communicate directly with AI models or external APIs, all requests pass through a centralized backend that orchestrates multiple AI agents and combines their outputs into a unified investment report.

```
+----------------------------+
|       React Frontend       |
+-------------+--------------+
              |
              |
      REST API Request
              |
              ▼
+----------------------------+
|      Express Backend       |
+-------------+--------------+
              |
              ▼
+----------------------------+
|    Analysis Orchestrator   |
|   (analysis.service.ts)    |
+-------------+--------------+
              |
              |
  +-----------+------------+
  |                        |
  ▼                        ▼
AI Agents             External APIs
  |                        |
  ▼                        ▼
Structured Reports    Financial & Web Data
              |
              ▼
+----------------------------+
|        MongoDB             |
+-------------+--------------+
              |
              ▼
      Final Investment Report
```

The architecture separates user interaction, business logic, AI reasoning, and data storage into independent layers. This modular approach makes the system easier to maintain, extend, and debug.

---

# AI Agent Architecture

Unlike traditional AI applications that rely on a single large prompt, Altuni Invest uses multiple specialized AI agents.

Each agent focuses on a single domain of expertise and produces structured JSON output.

The output of one agent becomes input for later agents until a final recommendation is generated.

```
                Company Name
                      │
                      ▼
         Company Research Agent
                      │
                      ▼
     Financial Statement Agent
                      │
                      ▼
       Competitor Analysis Agent
                      │
                      ▼
      Market & Industry Agent
                      │
                      ▼
            News Analysis Agent
                      │
                      ▼
      Macroeconomic Analysis Agent
                      │
                      ▼
        Sentiment Analysis Agent
                      │
                      ▼
          Valuation Analysis Agent
                      │
                      ▼
             Risk Analysis Agent
                      │
                      ▼
      Investment Recommendation Agent
                      │
                      ▼
         Final Investment Report
```

Every agent has its own responsibility and can be improved independently without affecting the rest of the pipeline.

---

# AI Workflow

The overall workflow of the application follows these steps:

### Step 1 — Company Search

The user enters a company name from the dashboard.

Example

```
NVIDIA
```

The frontend sends a request to

```
POST /api/analyze
```

---

### Step 2 — Analysis Orchestrator

The request reaches the backend where the Analysis Service becomes responsible for the complete execution pipeline.

Instead of placing all business logic inside controllers, the controller simply forwards the request to the Analysis Service.

The Analysis Service is responsible for

- coordinating all AI agents
- handling failures
- collecting outputs
- generating the final report
- storing the report

---

### Step 3 — AI Agent Execution

Each AI agent performs a specialized task.

The execution order is

```
Company Research

↓

Financial Statements

↓

Competitor Analysis

↓

Market Analysis

↓

News Analysis

↓

Macroeconomic Analysis

↓

Sentiment Analysis

↓

Valuation Analysis

↓

Risk Analysis

↓

Recommendation Generation
```

This sequence was intentionally designed because some agents depend on outputs generated by previous agents.

For example:

- Risk Analysis depends on financial statements, valuation, news, market trends, and macroeconomic conditions.

- Recommendation depends on every previous agent.

---

### Step 4 — Data Aggregation

After every agent completes execution, the Analysis Service combines all outputs into one structured report.

Example

```
{
    company,
    financial,
    competitors,
    market,
    news,
    macroeconomics,
    sentiment,
    valuation,
    risk,
    recommendation
}
```

This becomes the final report returned to the frontend.

---

### Step 5 — Database Storage

Before returning the response, the report is saved into MongoDB.

This enables

- History
- Report retrieval
- Future comparisons
- Caching
- Portfolio analysis

---

### Step 6 — Frontend Rendering

The React frontend receives the report and renders

- Dashboard
- Company Overview
- Financial Metrics
- Competitors
- Market Analysis
- News Timeline
- Risk Summary
- Recommendation

without making additional AI calls.

---

# Backend Folder Structure

The backend follows a modular architecture.

```
backend
│
├── agents
│   ├── companyResearch
│   ├── financialStatements
│   ├── competitor
│   ├── marketIndustry
│   ├── news
│   ├── macroeconomic
│   ├── sentiment
│   ├── valuation
│   ├── risk
│   └── recommendation
│
├── controllers
│
├── services
│
├── routes
│
├── models
│
├── database
│
├── middleware
│
├── utils
│
├── lib
│
├── config
│
├── app.ts
│
└── server.ts
```

---

# Folder Responsibilities

## agents/

Contains all AI agents responsible for investment research.

Every agent is independent and focuses on one domain.

Each agent includes

- prompt
- schema
- extractor
- tools
- agent
- types

---

## controllers/

Controllers receive HTTP requests.

Their responsibility is limited to

- validating requests
- calling services
- sending responses

Business logic is intentionally excluded from controllers.

---

## services/

Contains reusable business logic.

Examples

- analysis.service.ts
- cache.service.ts

The Analysis Service orchestrates the execution of all AI agents.

---

## routes/

Defines every REST endpoint exposed by the backend.

Examples

```
POST /api/analyze

GET /api/report/:id

GET /api/history
```

---

## models/

Contains MongoDB models.

Current models include

- Report
- Watchlist
- Portfolio

---

## database/

Responsible for MongoDB connection.

This layer isolates database configuration from application logic.

---

## middleware/

Contains reusable Express middleware.

Examples

- error handling
- request validation
- logging

---

## utils/

General utility functions shared across the project.

Examples

- JSON extraction
- response normalization
- helper functions

---

## lib/

Contains integrations with third-party SDKs.

Examples

- Gemini
- Tavily
- Alpha Vantage

---

## config/

Stores application configuration and environment loading.

---

# Why a Multi-Agent Architecture?

During development, I initially considered using a single LLM prompt to generate the complete investment report.

However, this approach introduced several issues:

- Extremely large prompts
- Higher hallucination rates
- Difficult debugging
- Inconsistent JSON formatting
- Poor maintainability

To solve these problems, the system was redesigned into a collection of specialized AI agents.

This architecture provides several advantages:

- Smaller prompts
- Better response quality
- Easier testing
- Independent debugging
- Reusable components
- Improved scalability

Each agent can evolve independently without affecting the overall system, making the platform significantly easier to extend in the future.

# Installation & Setup

## Prerequisites

Before running the project, ensure the following software is installed on your system:

- Node.js (v18 or later)
- npm
- MongoDB (Local or MongoDB Atlas)
- Git

The project also requires API keys for external services.

---

# Clone the Repository

```bash
git clone https://github.com/<your-username>/Altuni-Invest.git

cd Altuni-Invest
```

---

# Backend Setup

Navigate to the backend directory.

```bash
cd backend
```

Install all dependencies.

```bash
npm install
```

Create a `.env` file inside the backend folder.

```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY

TAVILY_API_KEY=YOUR_TAVILY_API_KEY

ALPHA_VANTAGE_API_KEY=YOUR_ALPHA_VANTAGE_API_KEY

MONGODB_URI=YOUR_MONGODB_CONNECTION_STRING

PORT=5000
```

Start the backend server.

```bash
npm run dev
```

If everything is configured correctly, the terminal should display something similar to:

```
Connected to MongoDB

Server running on port 5000

Gemini Initialized

Routes Loaded Successfully
```

---

# Frontend Setup

Navigate to the frontend directory.

```bash
cd frontend
```

Install dependencies.

```bash
npm install
```

Create a `.env` file.

```env
VITE_API_URL=http://localhost:5000
```

Run the frontend.

```bash
npm run dev
```

The application will be available at

```
http://localhost:5173
```

---

# Environment Variables

The backend depends on multiple external services.

| Variable | Description |
|----------|-------------|
| GEMINI_API_KEY | Google Gemini API |
| TAVILY_API_KEY | Tavily Search API |
| ALPHA_VANTAGE_API_KEY | Financial Statement API |
| MONGODB_URI | MongoDB Atlas connection |
| PORT | Express Server Port |

---

# Project Workflow

Once both frontend and backend are running, the workflow is as follows.

```
User Opens Dashboard

↓

Search Company

↓

Frontend sends

POST /api/analyze

↓

Backend receives request

↓

Analysis Service starts

↓

Company Agent

↓

Financial Agent

↓

Competitor Agent

↓

Market Agent

↓

News Agent

↓

Macroeconomic Agent

↓

Sentiment Agent

↓

Valuation Agent

↓

Risk Agent

↓

Recommendation Agent

↓

Store Report

↓

Return Final JSON

↓

Dashboard Updates
```

---

# REST API

## Analyze Company

Runs the complete investment analysis pipeline.

### Endpoint

```
POST /api/analyze
```

### Request

```json
{
    "companyName":"NVIDIA"
}
```

### Response

```json
{
    "company":{},
    "financial":{},
    "competitors":[],
    "market":{},
    "news":[],
    "macroeconomic":{},
    "sentiment":{},
    "valuation":{},
    "risk":{},
    "recommendation":{}
}
```

---

## Get Analysis History

Returns all previously analyzed companies.

```
GET /api/history
```

---

## Get Report

Retrieve a specific report.

```
GET /api/report/:id
```

---

## Delete Report

Deletes a saved report.

```
DELETE /api/report/:id
```

---

## Compare Companies

Compares two or more companies.

```
POST /api/compare
```

Request

```json
{
    "companies":[
        "NVIDIA",
        "AMD"
    ]
}
```

---

# Example Runs

The following examples demonstrate the system on real companies.

---

## Example 1 — NVIDIA

### Input

```
NVIDIA
```

### AI Pipeline

```
Company Research ✔

Financial Analysis ✔

Competitor Analysis ✔

Market Analysis ✔

News Analysis ✔

Macroeconomic Analysis ✔

Sentiment Analysis ✔

Valuation Analysis ✔

Risk Analysis ✔

Recommendation ✔
```

### Output Summary

```
Recommendation

BUY

Overall Risk

Medium

Overall Sentiment

Positive

Valuation

Slightly Undervalued

Confidence

0.94
```

---

## Example 2 — Apple

### Input

```
Apple
```

### Output Summary

```
Recommendation

HOLD

Risk

Low

Overall Sentiment

Positive

Valuation

Fairly Valued
```

---

## Example 3 — Microsoft

### Input

```
Microsoft
```

### Output Summary

```
Recommendation

BUY

Risk

Medium

Overall Sentiment

Very Positive

Valuation

Undervalued
```

---

# Caching

To avoid unnecessary AI calls, every completed analysis is stored in MongoDB.

If the same company is analyzed again within the cache duration, the stored report is returned immediately instead of executing the complete AI pipeline again.

This significantly reduces response time and API usage while improving the overall user experience.

---

# Error Handling

The backend includes multiple layers of validation and recovery.

- Zod schema validation
- Recovery Agent for missing fields
- JSON normalization
- Cache fallback
- Database fallback
- Structured error responses

This allows the application to recover from incomplete LLM outputs instead of failing the entire analysis.

# Design Decisions & Trade-offs

Building Altuni Invest involved several architectural decisions. Instead of focusing only on getting the application to work, I tried to design the backend in a way that would be modular, maintainable, and easy to extend.

This section explains the major design decisions, the trade-offs involved, and why each approach was chosen.

---

# Why a Multi-Agent Architecture?

The first idea was to use a single Large Language Model prompt that would analyze a company and generate a complete investment report.

Although this approach worked for simple cases, it quickly became difficult to maintain as the project grew.

Some of the problems encountered were:

- Extremely large prompts
- Inconsistent JSON outputs
- Frequent hallucinations
- Difficult debugging
- High token usage
- Poor scalability

Instead of increasing the size of one prompt, the system was redesigned into multiple independent AI agents.

Each agent became responsible for one specific task.

For example:

- Company Research Agent only understands company fundamentals.
- Financial Statement Agent only processes structured financial data.
- News Agent only analyzes recent news.
- Risk Agent only evaluates risks.
- Recommendation Agent combines all previous analyses to make the final investment decision.

This modular design made the overall system easier to debug, easier to test, and much simpler to extend.

---

# Why Gemini?

Several LLMs were considered during development.

Google Gemini was selected because it provided:

- Large context window
- Strong structured JSON generation
- Good reasoning capabilities
- Fast response time
- Easy API integration

Since every AI agent returns structured JSON, reliable JSON generation was one of the most important requirements.

---

# Why Tavily Search?

Large Language Models should not be expected to know current market events.

Instead of asking the LLM to answer from memory, the project first retrieves trusted web results using Tavily Search.

Those search results are then passed into Gemini, allowing the model to reason only over current and relevant information.

This significantly reduces hallucinations and improves factual accuracy.

---

# Why Alpha Vantage?

Financial statements require structured numerical data rather than natural language reasoning.

Alpha Vantage provides standardized financial information including:

- Income Statements
- Balance Sheets
- Cash Flow Statements
- Company Overview

Using an external financial API ensures that calculations are based on actual reported financial data rather than AI-generated estimates.

---

# Why MongoDB?

Each company analysis generates a large nested JSON document containing outputs from every AI agent.

MongoDB was chosen because:

- JSON documents can be stored without heavy transformation.
- Flexible schema supports future agent additions.
- Fast retrieval of previous reports.
- Suitable for caching complete analyses.

This avoids unnecessary normalization that would be required in a relational database.

---

# Why Zod?

One of the biggest challenges during development was ensuring that every AI response matched the expected structure.

Since LLM outputs can occasionally contain missing fields or incorrect data types, every agent validates its output using Zod.

Benefits include:

- Runtime validation
- Type safety
- Automatic error detection
- Safer integration between agents

---

# Why an Analysis Orchestrator?

Instead of allowing controllers to directly execute AI agents, an Analysis Service was introduced.

The Analysis Service acts as the central orchestrator.

Its responsibilities include:

- Executing all agents
- Passing outputs between agents
- Combining results
- Handling failures
- Saving reports
- Returning the final response

Separating orchestration from HTTP controllers keeps the application modular and easier to maintain.

---

# Trade-offs

Every architectural decision involves trade-offs.

## Accuracy vs Response Time

Running multiple AI agents produces more reliable investment reports but increases total execution time compared to using a single prompt.

The project prioritizes analysis quality over response speed.

---

## External APIs vs Offline Data

Using live APIs ensures that financial statements and news remain current.

However, this introduces:

- Rate limits
- Network dependency
- Third-party service availability

To reduce repeated requests, report caching was added.

---

## Multiple Small Prompts vs One Large Prompt

Using many specialized prompts increases the number of API calls.

However, it provides:

- Better maintainability
- Smaller context sizes
- Easier debugging
- Better JSON consistency

The additional API calls were considered an acceptable trade-off.

---

## Flexible Schema vs Strict Validation

Strict validation catches malformed AI responses early but occasionally requires normalization or recovery logic.

This extra complexity improves the overall reliability of the system.

---

# Challenges Faced During Development

Developing Altuni Invest involved several practical challenges beyond simply integrating AI models.

### Inconsistent JSON Responses

LLMs occasionally returned incomplete or incorrectly formatted JSON.

To solve this, JSON extraction, normalization, and schema validation were implemented before processing the output.

---

### Missing Information

Search results sometimes lacked specific company details.

A dedicated Recovery Agent was introduced to recover only the missing fields without rerunning the entire analysis.

---

### API Rate Limits

Free API tiers imposed daily request limits, particularly for financial data.

Caching previously analyzed companies reduced unnecessary API usage.

---

### Large Prompt Sizes

As more information was added to prompts, some responses exceeded output limits.

Prompts were redesigned to:

- Reduce unnecessary context
- Limit article counts
- Restrict summary length
- Return only essential information

---

### Multi-Agent Coordination

Since several agents depend on previous outputs, managing execution order became increasingly important.

An orchestration layer was introduced to coordinate agent execution while keeping each agent independent.

---

# Lessons Learned

This project significantly improved my understanding of:

- Prompt engineering
- LLM limitations
- Multi-agent system design
- Backend architecture
- REST API development
- Schema validation
- Database design
- AI orchestration
- Error handling
- Caching strategies

More importantly, it demonstrated that building reliable AI applications involves much more than calling an LLM. Proper system design, validation, structured data flow, and modular architecture are equally important.

---

# What I Would Improve With More Time

Although the current implementation is fully functional, there are several improvements I would like to add in future iterations.

### Real-Time Monitoring

Continuously monitor:

- Breaking news
- Earnings releases
- Regulatory announcements

and automatically refresh affected reports.

---

### Portfolio Tracking

Allow users to create investment portfolios and receive AI-generated insights based on their holdings.

---

### Watchlist Alerts

Notify users whenever:

- Analyst ratings change
- Significant news is published
- Risk scores increase
- Valuation changes substantially

---

### Historical Trend Analysis

Store historical analyses to visualize how recommendations evolve over time.

---

### PDF Report Generation

Generate professional investment reports suitable for sharing or printing.

---

### Multi-LLM Support

Support multiple language models so different providers can be compared or used interchangeably.

---

### Improved Financial Data Sources

Integrate additional financial APIs to improve coverage and reduce dependency on a single provider.

---

### Advanced Visualizations

Add interactive financial charts, valuation comparisons, and historical trend graphs to improve the user experience.

---

# AI Usage & Development Process

Artificial Intelligence was used throughout the development process as a collaborative engineering assistant rather than as a code generator.

The LLM was primarily used to:

- Brainstorm the overall system architecture
- Refine prompt engineering strategies
- Design JSON schemas
- Debug TypeScript and Zod validation issues
- Improve backend architecture
- Review API design
- Optimize prompt size and output structure
- Discuss trade-offs and implementation decisions

Every AI agent was developed incrementally.

The workflow generally followed these steps:

1. Define the agent's responsibility.
2. Design the JSON schema.
3. Create the prompt.
4. Implement extraction and validation.
5. Test the agent independently.
6. Fix formatting and normalization issues.
7. Integrate the agent into the orchestration pipeline.
8. Verify end-to-end execution.

This iterative process allowed each component to be validated independently before becoming part of the larger system.

As requested in the assignment, the complete development conversation history with the LLM has been preserved and is included alongside this submission. These conversations document the architectural decisions, debugging process, prompt iterations, and reasoning that shaped the final implementation.

# Project Structure

The project follows a modular architecture where every component has a clearly defined responsibility. This separation makes the codebase easier to understand, maintain, and extend.

```
Altuni-Invest
│
├── backend
│   │
│   ├── agents
│   │   ├── companyResearch
│   │   ├── competitor
│   │   ├── financialStatements
│   │   ├── macroeconomic
│   │   ├── marketIndustry
│   │   ├── news
│   │   ├── recommendation
│   │   ├── recovery
│   │   ├── risk
│   │   ├── sentiment
│   │   └── valuation
│   │
│   ├── controllers
│   │   ├── analysis.controller.ts
│   │   └── report.controller.ts
│   │
│   ├── routes
│   │   ├── analysis.routes.ts
│   │   └── report.routes.ts
│   │
│   ├── services
│   │   ├── analysis.service.ts
│   │   ├── cache.service.ts
│   │   └── search.ts
│   │
│   ├── models
│   │   └── Report.ts
│   │
│   ├── database
│   │   └── mongodb.ts
│   │
│   ├── utils
│   │
│   ├── middleware
│   │
│   ├── lib
│   │
│   ├── app.ts
│   └── server.ts
│
├── frontend
│   │
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── context
│   │   ├── hooks
│   │   ├── services
│   │   ├── utils
│   │   └── assets
│   │
│   └── public
│
├── README.md
└── package.json
```

---

# Folder Overview

## backend/agents

Contains all AI agents responsible for different stages of investment research.

Each agent is completely independent and returns validated structured JSON.

---

## backend/controllers

Responsible for handling HTTP requests and responses.

Controllers never contain business logic.

---

## backend/routes

Defines all REST API endpoints exposed by the backend.

---

## backend/services

Contains reusable business logic.

The Analysis Service orchestrates the complete AI workflow.

The Cache Service prevents unnecessary AI executions.

---

## backend/models

Contains MongoDB models.

Currently used for storing completed investment reports.

---

## backend/database

Responsible for establishing the MongoDB connection.

---

## backend/utils

Contains helper utilities shared across the application.

Examples include JSON extraction, normalization, and validation helpers.

---

## frontend/components

Reusable UI components used throughout the dashboard.

---

## frontend/pages

Contains all application pages including Dashboard, Reports, Watchlist, History, Compare, and Settings.

---

## frontend/context

Stores global application state and handles communication with the backend.

---

## frontend/services

Contains API functions used by the frontend.

---

# Screenshots

The following screenshots demonstrate the application's interface.

## Landing Page

> *(Insert screenshot here)*

---

## Dashboard

> *(Insert screenshot here)*

---

## Company Analysis

> *(Insert screenshot here)*

---

## Financial Analysis

> *(Insert screenshot here)*

---

## Competitor Analysis

> *(Insert screenshot here)*

---

## Market Analysis

> *(Insert screenshot here)*

---

## News Analysis

> *(Insert screenshot here)*

---

## Valuation Analysis

> *(Insert screenshot here)*

---

## Risk Assessment

> *(Insert screenshot here)*

---

## Final Recommendation

> *(Insert screenshot here)*

---

## Compare Companies

> *(Insert screenshot here)*

---

## History

> *(Insert screenshot here)*

---

## Watchlist

> *(Insert screenshot here)*

---

# Future Roadmap

Although the current version is fully functional, there are several features planned for future releases.

- Authentication and user management
- Portfolio performance tracking
- Watchlist alerts
- Real-time market monitoring
- Scheduled report generation
- Email notifications
- PDF report export
- Interactive financial charts
- Historical recommendation tracking
- Multi-language support
- Additional financial data providers
- Support for multiple LLM providers
- Real-time streaming analysis

---

# Acknowledgements

I would like to acknowledge the following technologies and services that made this project possible.

- Google Gemini
- Tavily Search API
- Alpha Vantage
- MongoDB Atlas
- Express.js
- React
- Tailwind CSS
- TypeScript
- Mongoose
- Zod

These tools provided the foundation for building the AI-powered investment research workflow implemented in this project.

---

# Author

**Sourav Kuriakose**

B.Tech Computer Science and Engineering

Lovely Professional University

GitHub:
```
https://github.com/Sourav6404
```

Portfolio:
```
https://sourav-portfolio-pi.vercel.app/
```

LinkedIn:
```
https://www.linkedin.com/in/sourav6404
```

Email:
```
souravkuriakose6404@gmail.com
```

---

# Submission Checklist

- [x] Multi-Agent AI Architecture
- [x] Company Research Agent
- [x] Financial Statement Agent
- [x] Competitor Analysis Agent
- [x] Market & Industry Analysis Agent
- [x] News Analysis Agent
- [x] Macroeconomic Analysis Agent
- [x] Sentiment Analysis Agent
- [x] Valuation Analysis Agent
- [x] Risk Analysis Agent
- [x] Investment Recommendation Agent
- [x] Express REST API
- [x] MongoDB Integration
- [x] Report Caching
- [x] React Dashboard
- [x] Analysis History
- [x] Structured JSON Validation
- [x] AI Development Logs Included

---

# Final Thoughts

Building Altuni Invest has been a valuable learning experience in designing real-world AI systems. Rather than relying on a single large language model prompt, this project demonstrates how multiple specialized AI agents can collaborate to solve a complex problem through structured reasoning and modular architecture.

Throughout development, I gained hands-on experience with backend architecture, API integration, prompt engineering, schema validation, caching, database design, and AI orchestration. More importantly, the project reinforced that building reliable AI applications requires thoughtful system design, clear separation of responsibilities, and rigorous validation—not just calling an LLM.

This project represents my attempt to bridge modern AI capabilities with traditional investment research practices by creating a platform that is both technically robust and practically useful.