---
description: The NEET Study Automation Suite is an intelligent, personalized learning platform that automates study plan generation, quiz creation from past papers, progress tracking, and schedule management for NEET aspirants
---

# NEET Study Automation Suite - Product Requirements Document

## Executive Summary

The NEET Study Automation Suite is an intelligent, personalized learning platform that automates study plan generation, quiz creation from past papers, progress tracking, and schedule management for NEET aspirants. The platform adapts to student performance in real-time and synchronizes study sessions with Google Calendar while sending Telegram reminders.

---

## Product Overview

### Vision
Reduce study planning friction for NEET aspirants by automating syllabus parsing, quiz generation, and adaptive scheduling based on performance metrics.

### Target Users
- NEET exam aspirants (medical entrance examination candidates in India)
- Students requiring personalized, adaptive study plans
- Learners who benefit from automated reminders and progress tracking

### Core Value Propositions
1. **Automated Study Planning**: AI-generated personalized study schedules based on NEET syllabus
2. **Adaptive Quizzes**: AI-powered question generation with detailed explanations
3. **Smart Scheduling**: Calendar integration that adapts to performance
4. **Progress Visibility**: Streak tracking, metrics, and visual analytics
5. **Proactive Reminders**: Telegram notifications for study sessions and milestones

---

## Product Scope

### In Scope
- Personalized NEET study plan generation
- Quiz generation from NEET past papers
- Progress tracking with streaks and performance metrics
- Google Calendar and Google Tasks integration
- Telegram notifications and reminders
- SQLite-based data persistence
- Streamlit/Matplotlib visualizations
- CLI and dashboard interfaces
- Deployment on Vercel

### Out of Scope
- Live video tutoring or instructor interaction
- Mobile-native app development
- Community/social features
- Payment processing
- Real-time collaboration

---

## User Flows

### Flow 1: Initial Setup & Study Plan Generation
1. User launches CLI or dashboard
2. Authenticates with Google (OAuth)
3. Inputs NEET target date and learning style preferences
4. System scrapes NEET syllabus and past papers
5. AI generates personalized study plan with daily/weekly milestones
6. Plan synced to Google Calendar as events
7. User confirms and begins studying

### Flow 2: Taking Adaptive Quizzes
1. User selects a topic or subject
2. System generates quiz from relevant past papers (PyPDF2 extraction)
3. OpenAI API creates adaptive questions with explanations
4. User answers questions via CLI or dashboard UI
5. System records performance metrics
6. AI adjusts difficulty and topic scheduling based on performance
7. User views detailed explanations and analytics

### Flow 3: Progress Tracking & Reminders
1. System tracks daily study streaks, accuracy, and time spent
2. Telegram bot sends reminders 30 minutes before scheduled sessions
3. User can view analytics dashboard (Matplotlib/Streamlit)
4. Performance triggers automatic calendar rescheduling
5. Milestones generate celebratory notifications

---

## Key Features

### 1. Study Plan Generator
- **Input**: Target exam date, subject preferences, available study hours
- **Output**: Personalized weekly/daily study schedule
- **Logic**: Distributes NEET syllabus evenly, prioritizes weak areas after assessments
- **Integration**: Auto-syncs to Google Calendar

### 2. Adaptive Quiz Engine
- **Past Paper Scraping**: BeautifulSoup extracts questions; PyPDF2 parses PDFs
- **Question Generation**: OpenAI API creates context-aware questions and explanations
- **Difficulty Adjustment**: Increases/decreases based on user accuracy
- **Coverage Tracking**: Ensures all topics are tested proportionally

### 3. Performance Analytics
- **Metrics Tracked**: Accuracy %, daily streak, time per question, topics mastered, weak areas
- **Visualizations**: Charts (Matplotlib), dashboards (Streamlit)
- **Storage**: SQLite database
- **Exports**: User can download progress reports

### 4. Calendar Integration
- **Google Calendar**: Study sessions sync as events
- **Google Tasks**: Quiz and assignment tracking
- **Rescheduling Logic**: Moves sessions based on performance; low scores trigger extra practice
- **Conflict Detection**: Avoids overlaps with user's existing events

### 5. Notification System
- **Telegram Bot**: Session reminders (30 min before), daily motivation, milestone alerts
- **Customization**: Users choose frequency and content type
- **Two-way Interaction**: Users can mark sessions complete via Telegram

### 6. CLI & Dashboard
- **CLI**: Command-line interface for power users; generate plans, start quizzes, view stats
- **Dashboard**: Streamlit-based web UI for visualization, quiz taking, and settings
- **Features**: Real-time progress, one-click calendar sync, performance graphs

---

## Technical Architecture

### Backend Stack
- **Language**: Python 3.9+
- **Web Framework**: Streamlit (dashboard), Flask/FastAPI (optional API layer)
- **Data Scraping**: BeautifulSoup, PyPDF2
- **AI/API**: OpenAI API (GPT-4 or GPT-3.5 Turbo)
- **Database**: SQLite
- **External APIs**: Google Calendar API, Google Tasks API, Telegram Bot API

### Frontend Stack
- **Dashboard**: Streamlit
- **Visualizations**: Matplotlib, Plotly (optional for interactivity)
- **CLI**: Python Click/Typer framework

### Deployment
- **Platform**: Vercel (for Streamlit dashboard)
- **Database**: SQLite (local or synced via Git/cloud)
- **Environment Variables**: API keys (OpenAI, Google, Telegram) stored securely

### Data Model (SQLite)
```
Tables:
- users (id, google_id, telegram_id, created_at)
- study_plans (id, user_id, target_date, subjects, created_at)
- quizzes (id, user_id, topic, date_taken, score, num_questions)
- questions (id, quiz_id, topic, question_text, correct_answer, user_answer, explanation)
- performance_metrics (id, user_id, date, streak_count, accuracy, topics_completed)
- calendar_events (id, user_id, google_event_id, session_date, topic, status)
```

---

## Feature Specifications

### Feature 1: NEET Syllabus Scraper
| Aspect | Details |
|--------|---------|
| **Trigger** | On initial setup or manual refresh |
| **Data Source** | Official NEET syllabus URLs, past papers (PDFs) |
| **Tools** | BeautifulSoup (HTML), PyPDF2 (PDFs) |
| **Output** | Structured topic list, question bank |
| **Frequency** | One-time on setup; refresh available monthly |

### Feature 2: AI Quiz Generator
| Aspect | Details |
|--------|---------|
| **Model** | OpenAI GPT-4 or GPT-3.5 Turbo |
| **Prompt Template** | Topic + difficulty + question type (MCQ, assertion-reason, numeric) |
| **Output** | Question, options, correct answer, detailed explanation |
| **Adapt Logic** | If accuracy > 80% over last 5 Qs → increase difficulty; < 60% → decrease |
| **Rate Limits** | Token budgeting to manage API costs |

### Feature 3: Google Calendar Sync
| Aspect | Details |
|--------|---------|
| **Trigger** | Study plan generation, performance-based rescheduling |
| **Event Details** | Topic, duration, reminder (30 min before) |
| **Rescheduling** | Low scores or missed sessions extend study time |
| **Conflict Check** | Does not overlap with existing events |
| **Auth** | OAuth 2.0 with Google |

### Feature 4: Telegram Reminders
| Aspect | Details |
|--------|---------|
| **Trigger** | 30 min before scheduled session, daily streak milestone |
| **Message Types** | Session reminder, motivational quote, performance summary |
| **Interactions** | User can reply "done" to mark session complete |
| **Frequency** | Configurable (daily, only study days, etc.) |

### Feature 5: Performance Dashboard
| Aspect | Details |
|--------|---------|
| **Metrics** | Accuracy %, daily streak, topics completed, weak areas, time trends |
| **Visualizations** | Line chart (accuracy over time), bar chart (topics), heatmap (study frequency) |
| **Filters** | By subject, time range, difficulty |
| **Export** | CSV/PDF download option |

---

## User Requirements

### Functional Requirements
- FR1: System shall generate a personalized study plan within 2 minutes of user input
- FR2: System shall create quizzes with AI-generated questions and explanations
- FR3: System shall sync study sessions to Google Calendar without manual entry
- FR4: System shall send Telegram reminders 30 minutes before scheduled sessions
- FR5: System shall track and display performance metrics in a dashboard
- FR6: System shall adjust quiz difficulty based on user accuracy
- FR7: System shall support CLI commands for all major operations

### Non-Functional Requirements
- NFR1: Dashboard shall load within 3 seconds
- NFR2: API response time for quiz generation ≤ 5 seconds
- NFR3: System shall support concurrent users on Vercel deployment
- NFR4: Data shall be persisted in SQLite with regular backups
- NFR5: All API keys shall be stored in environment variables
- NFR6: System shall handle API rate limits gracefully with queuing/retry logic

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| User Engagement | 5+ study sessions/week | Dashboard activity logs |
| Quiz Completion | 80%+ of assigned quizzes | Quiz table completion rate |
| Accuracy Improvement | +10% improvement in 4 weeks | Performance metrics trend |
| Calendar Sync | 100% of plans synced | Audit Google Calendar |
| Reminder Open Rate | 70%+ Telegram message engagement | Telegram analytics |
| Platform Uptime | 99%+ | Monitoring via Vercel |
| User Retention | 60%+ monthly active users | User login frequency |

---

## Timeline & Milestones

### Phase 1: MVP (Weeks 1-4)
- [ ] Syllabus scraper (BeautifulSoup + PyPDF2)
- [ ] OpenAI quiz generator with basic adaptation
- [ ] SQLite schema and data models
- [ ] Basic Streamlit dashboard
- [ ] Google Calendar integration

### Phase 2: Enhancement (Weeks 5-6)
- [ ] Telegram bot integration with reminders
- [ ] Advanced performance analytics and visualizations
- [ ] CLI with Click/Typer
- [ ] User authentication (OAuth)

### Phase 3: Deployment & Polish (Weeks 7-8)
- [ ] Vercel deployment and testing
- [ ] Performance optimization
- [ ] Documentation and user guide
- [ ] Bug fixes and refinements

---

## Dependencies & Risks

### External Dependencies
- **Google APIs**: Calendar, Tasks, OAuth
- **OpenAI API**: Availability and rate limits
- **Telegram Bot API**: Stability
- **NEET Syllabus Sources**: Availability of scrape-able resources

### Risks & Mitigation
| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| OpenAI API rate limiting | High | Users cannot generate quizzes | Implement queue, batch processing, cost monitoring |
| Google Calendar API quota | Medium | Sync failures | Cache events, batch requests, error handling |
| Syllabus source changes | Medium | Scraper breaks | Maintain multiple sources, manual fallback |
| Poor quiz quality | Medium | Low user engagement | Implement review system, human feedback loop |
| Deployment scalability | Low | Vercel limits | Optimize code, consider alternative hosting |

---

## Future Enhancements

1. **Spaced Repetition**: SRS algorithm to optimize long-term retention
2. **Collaborative Groups**: Study group features with shared progress
3. **AI Tutoring**: Chat interface for concept clarification
4. **Mobile App**: Native iOS/Android app
5. **Video Content**: Integration with YouTube for topic explanations
6. **Mock Exams**: Full-length practice tests with performance analysis
7. **Peer Leaderboards**: Gamification and community challenges
8. **Multi-Exam Support**: Extend to other competitive exams (AIIMS, JEE, etc.)

---

## Appendix

### Technologies Stack Summary
- **Backend**: Python, Flask/FastAPI
- **Frontend**: Streamlit, Matplotlib, Plotly
- **Database**: SQLite
- **APIs**: OpenAI, Google, Telegram
- **Deployment**: Vercel
- **Libraries**: BeautifulSoup, PyPDF2, python-telegram-bot, google-auth

### References
- NEET Syllabus: Official NTA documentation
- OpenAI API Docs: https://platform.openai.com/docs
- Google Calendar API: https://developers.google.com/calendar
- Streamlit Docs: https://docs.streamlit.io
- Vercel Deployment: https://vercel.com/docs