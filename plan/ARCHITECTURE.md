
# ⚫ BlackCloud Architecture

> Technical architecture blueprint for BlackCloud

---

# Purpose

This document defines the high-level system architecture, major services, communication patterns, infrastructure decisions, scalability strategy, and deployment model for BlackCloud.

The architecture is designed to support:

* Large-scale interactive cloud diagrams
* Multi-cloud infrastructure modeling
* AI-powered architecture analysis
* Infrastructure migration planning
* Real-time collaboration
* Future simulation and governance features

---

# System Overview

```text
┌────────────────────────────────────────────┐
│                 Frontend                   │
│                                            │
│ Next.js + React + TypeScript + Bun         │
│ React Flow + R3F + Motion + Zustand        │
└──────────────────┬─────────────────────────┘
                   │
                   ▼
┌────────────────────────────────────────────┐
│                 API Gateway                │
│                  FastAPI                   │
└──────────────────┬─────────────────────────┘
                   │
 ┌─────────────────┼─────────────────┐
 ▼                 ▼                 ▼

Auth Service   Project Service   AI Service

 ▼                 ▼                 ▼

Database      Storage Layer     LLM Providers

                   ▼

          Background Workers

                   ▼

           Analytics Engine
```

---

# Architectural Principles

## API First

All business functionality must be accessible through APIs.

Frontend should never directly interact with infrastructure services.

---

## Modular Monolith First

Early stages should remain a modular monolith.

Avoid premature microservices.

Benefits:

* Faster development
* Easier debugging
* Lower operational cost
* Simpler deployments

---

## Service Extraction Later

When scale requires:

* AI Engine
* Simulation Engine
* Collaboration Engine

can become independent services.

---

# Frontend Architecture

## Technology Stack

### Framework

* Next.js 16+
* React 20+
* TypeScript
* Bun

---

### State Management

#### Global State

* Zustand

#### Server State

* TanStack Query

---

### Forms

* React Hook Form
* Zod

---

### UI Components

* ShadCN UI
* Radix UI

---

### Graph Engine

* React Flow

Responsibilities:

* Nodes
* Edges
* Canvas
* Selection
* Dragging
* Zooming

---

### 3D Layer

* Three.js
* React Three Fiber
* Drei

Responsibilities:

* Visual storytelling
* Landing experience
* Infrastructure worlds

---

### Animation Layer

* Motion
* GSAP
* Theatre.js

Responsibilities:

* Transitions
* Interactions
* Cinematic experiences

---

# Frontend Structure

```text
apps/web

src/

├── app/
├── components/
├── features/
│
├── playground/
├── migration/
├── ai/
├── auth/
│
├── hooks/
├── store/
├── services/
├── lib/
├── styles/
└── types/
```

---

# Backend Architecture

## Technology Stack

### Runtime

Python 3.14+

---

### Framework

FastAPI

---

### Package Manager

UV

---

### Validation

Pydantic

---

### ORM

SQLAlchemy

---

### Migrations

Alembic

---

### Background Tasks

Celery

---

### Cache

Redis

---

# Backend Structure

```text
apps/api

app/

├── api/
├── auth/
├── projects/
├── playground/
├── migration/
├── ai/
├── exports/
├── analytics/
├── workers/
├── db/
├── models/
├── services/
└── utils/
```

---

# Core Domains

## Authentication Domain

Responsibilities:

* Registration
* Login
* OAuth
* Session management

---

## Project Domain

Responsibilities:

* Project creation
* Versioning
* Sharing
* Organization management

---

## Playground Domain

Responsibilities:

* Node storage
* Connection storage
* Graph validation
* Canvas state

---

## Migration Domain

Responsibilities:

* Infrastructure imports
* Service mapping
* Compatibility analysis

---

## AI Domain

Responsibilities:

* Architecture generation
* Cost recommendations
* Security reviews
* Optimization suggestions

---

# Database Architecture

## Primary Database

PostgreSQL

---

# Core Tables

## Users

Stores:

* Accounts
* Preferences
* Subscription data

---

## Organizations

Stores:

* Teams
* Workspaces

---

## Projects

Stores:

* Infrastructure projects

---

## Versions

Stores:

* Historical snapshots

---

## Nodes

Stores:

* Infrastructure services

---

## Edges

Stores:

* Infrastructure relationships

---

## AI Reports

Stores:

* Generated recommendations

---

## Migrations

Stores:

* Migration analyses

---

# Storage Layer

## Object Storage

S3 Compatible Storage

Stores:

* Exports
* Assets
* Attachments

---

# Caching Layer

## Redis

Used for:

* Session caching
* Query caching
* Background job queues
* Rate limiting

---

# AI Architecture

## AI Gateway

Single service responsible for:

* Prompt management
* Model routing
* Usage tracking

---

# Supported Models

* OpenAI
* Claude
* Gemini

---

# AI Workflows

## Architecture Generation

Input:

User requirements

Output:

Infrastructure design

---

## Cost Analysis

Input:

Architecture graph

Output:

Cost estimation

---

## Security Analysis

Input:

Infrastructure graph

Output:

Security recommendations

---

# Infrastructure Import Engine

Supported Formats:

* Terraform
* CloudFormation
* Pulumi

---

# Processing Flow

```text
Upload

   ↓

Parser

   ↓

Infrastructure Graph

   ↓

Validation

   ↓

Migration Analysis
```

---

# Export Engine

Supported Outputs:

* Terraform
* CloudFormation
* Pulumi
* Bicep
* PNG
* SVG
* PDF
* JSON

---

# Real-Time Architecture

## Phase 1

Polling

---

## Phase 2

WebSockets

---

## Phase 3

CRDT Collaboration

---

# Collaboration Architecture

Future Feature

---

## Presence System

Track:

* Active users
* Cursor positions
* Editing activity

---

## Shared Editing

Support:

* Multi-user editing
* Comments
* Reviews

---

# Security Architecture

## Authentication

* OAuth
* Email Login

Future:

* SAML
* SSO

---

## Authorization

Role-Based Access Control

Roles:

* Owner
* Admin
* Editor
* Viewer

---

## Secrets

Never store secrets in plaintext.

Use:

* Environment Variables
* Secret Managers

---

# Observability

## Logging

Structured logging.

---

## Metrics

Track:

* API latency
* Errors
* Usage patterns

---

## Monitoring

Future:

* Prometheus
* Grafana

---

# Deployment Architecture

## Development

Docker Compose

Services:

* Frontend
* Backend
* PostgreSQL
* Redis

---

## Production

Containerized deployment.

---

### Frontend

Next.js Container

---

### Backend

FastAPI Container

---

### Database

Managed PostgreSQL

---

### Cache

Managed Redis

---

# CI/CD

## GitHub Actions

Pipeline:

```text
Lint

 ↓

Test

 ↓

Build

 ↓

Container Build

 ↓

Deploy
```

---

# Scalability Strategy

## Stage 1

Single Server

Target:

0–1,000 users

---

## Stage 2

Container Scaling

Target:

1,000–10,000 users

---

## Stage 3

Kubernetes

Target:

10,000+ users

---

# Future Architecture Modules

## Simulation Engine

Failure modeling.

---

## Cost Prediction Engine

Forecast infrastructure spending.

---

## Governance Engine

Enterprise policies.

---

## Compliance Engine

Security compliance.

---

## Infrastructure Time Machine

Historical replay.

---

# Architecture Decision Record

## Why FastAPI

* High performance
* Async support
* Excellent typing
* Strong ecosystem

---

## Why PostgreSQL

* Reliable
* Mature
* Supports complex relationships

---

## Why React Flow

* Industry standard graph editor
* Extensible
* Performance optimized

---

## Why Zustand

* Lightweight
* Minimal boilerplate
* Excellent performance

---

## Why Modular Monolith

* Faster execution
* Easier maintenance
* Lower complexity

---

# Final Goal

BlackCloud should become a platform where infrastructure is not merely documented.

It is visualized, validated, simulated, migrated, analyzed, and governed through a unified architecture system capable of scaling from individual engineers to enterprise organizations.
