# ChinaPrice - International Price Comparison Platform

ChinaPrice is a smart price comparison platform that helps users compare product prices across international and domestic e-commerce platforms. It leverages AI-powered search, real-time price tracking, and historical price analytics to help consumers make informed purchasing decisions.

## Quick Start

```bash
git clone <repo-url> && cd price-comparison-platform

cp .env.example .env
# Edit .env and fill in your API keys

docker-compose up -d
```

The frontend will be available at `http://localhost:3000` and the backend API at `http://localhost:8000`.

## Tech Stack

- **Backend**: Python, FastAPI, Celery, SQLAlchemy
- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Database**: PostgreSQL 16
- **Cache**: Redis 7
- **Search Engine**: Elasticsearch 8
- **Containerization**: Docker, Docker Compose

## Project Structure

```
.
├── backend/            # FastAPI backend service
│   ├── app/
│   │   ├── main.py
│   │   ├── models/
│   │   ├── routers/
│   │   ├── services/
│   │   └── tasks/
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/           # Next.js frontend application
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
├── .env.example
└── README.md
```

## License

MIT
