
# ⚫ BlackCloud MVP

> **Version:** v0.1.0
> **Objective:** Validate the core product idea by enabling users to visually design cloud infrastructure, receive intelligent validation, and export their work—without building every planned feature.

---

# MVP Philosophy

The MVP is **not** a stripped-down demo.

It is a focused product that solves one real problem exceptionally well.

**Core question:**

> Can cloud architects and DevOps engineers design infrastructure faster and more accurately in BlackCloud than with Lucidchart, Draw.io, or diagrams.net?

If the answer is **yes**, the product has a strong foundation.

---

# Target Users

### Primary

* Cloud Engineers
* DevOps Engineers
* Platform Engineers
* Solutions Architects
* Freelancers
* Students learning cloud architecture

### Secondary

* Technical Trainers
* Startup Founders
* Technical Consultants

---

# Problem to Solve

Today, users often:

* Draw diagrams in one tool.
* Write Terraform in another.
* Validate architecture manually.
* Use cloud documentation to verify service compatibility.

BlackCloud combines these workflows into a single interactive experience.

---

# MVP Goals

The MVP must allow users to:

* Create a cloud architecture visually.
* Connect services together.
* Receive immediate architecture validation.
* Save projects.
* Export architecture diagrams.
* Share architecture with others (read-only).

Everything else is deferred.

---

# MVP Scope

## Authentication

### Features

* Email authentication
* Google OAuth
* User profiles

---

## Dashboard

### Features

* Project list
* Recent projects
* Create project
* Delete project

---

## Cloud Playground

This is the heart of the MVP.

### Infinite Canvas

Features:

* Pan
* Zoom
* Drag
* Multi-selection

---

### Node Library

AWS

* VPC
* Internet Gateway
* NAT Gateway
* EC2
* ECS
* Lambda
* ALB
* NLB
* RDS
* DynamoDB
* S3
* CloudFront
* Route 53

Azure

* Virtual Machine
* AKS
* Azure Functions
* Azure SQL
* Blob Storage

GCP

* Compute Engine
* Cloud Run
* GKE
* Cloud SQL
* Cloud Storage

---

### Node Operations

Users can:

* Add
* Move
* Duplicate
* Delete
* Rename

---

### Connections

Users can:

* Connect services
* Remove connections
* Modify connections

---

### Canvas Features

* Grid
* Snap to grid
* Minimap
* Fit to screen
* Undo
* Redo
* Keyboard shortcuts

---

# Architecture Validation Engine

Validate:

* Invalid service connections
* Missing required networking
* Public/private subnet mistakes
* Unsupported service relationships

Example:

ALB → RDS

Response:

❌ Invalid.

Suggested:

ALB → ECS → RDS

---

# Inspector Panel

Selecting any node displays:

* Name
* Service type
* Configuration
* Status
* Tags
* Connected services

---

# Export System

Supported exports:

* PNG
* SVG
* JSON

Terraform export is **not** included in the MVP.

---

# Save System

Users can:

* Save architecture
* Rename project
* Reopen projects

---

# Search

Search services by:

* Name
* Provider
* Category

---

# AI Assistant (Limited)

The AI assistant is intentionally lightweight.

Supported capabilities:

* Explain a service
* Explain a connection
* Suggest architecture improvements

The AI **does not** generate entire architectures in the MVP.

---

# Responsive Design

Supported devices:

* Desktop
* Tablet

Mobile receives a simplified read-only experience.

A full mobile editor is deferred.

---

# UI Requirements

Inspired by:

* Linear
* Framer
* Vercel
* Stripe
* Figma

Characteristics:

* Dark-first
* Minimal
* Motion-driven
* Highly polished

---

# Performance Targets

Canvas must support:

* 100 nodes
* 200 connections

without noticeable lag.

---

# Accessibility

Minimum requirements:

* Keyboard navigation
* Focus indicators
* ARIA labels
* Reduced motion mode

---

# Out of Scope

The following features are **explicitly excluded** from the MVP:

## Migration Ground

Deferred.

---

## AI Architecture Generator

Deferred.

---

## Failure Simulator

Deferred.

---

## Cost Simulator

Deferred.

---

## Multi-user Collaboration

Deferred.

---

## Version History

Deferred.

---

## Terraform Import

Deferred.

---

## CloudFormation Import

Deferred.

---

## Pulumi Import

Deferred.

---

## Enterprise Authentication

Deferred.

---

## Team Workspaces

Deferred.

---

## Billing

Deferred.

---

## Analytics Dashboard

Deferred.

---

# Technology Stack

## Frontend

* Next.js 16.2.10
* React 19.2.4
* TypeScript
* Bun
* Tailwind CSS v4
* Motion
* React Flow
* Zustand
* TanStack Query
* ShadCN UI
* Radix UI

---

## Backend

* Python 3.14.6
* FastAPI
* UV
* SQLAlchemy
* PostgreSQL
* Redis

---

## Infrastructure

* Docker
* Docker Compose
* GitHub Actions

---

# Database

Core entities:

* Users
* Projects
* Nodes
* Edges
* SavedLayouts

---

# Success Metrics

The MVP is successful if users can:

✅ Create a complete cloud architecture.

✅ Connect services correctly.

✅ Receive useful validation.

✅ Save their work.

✅ Export diagrams.

✅ Complete the workflow without documentation.

---

# Future Expansion

Once the MVP is validated, the roadmap expands to:

1. AI Architecture Generator
2. Migration Ground
3. Cost Simulator
4. Failure Simulator
5. Real-Time Collaboration
6. Infrastructure Versioning
7. Terraform & CloudFormation Import/Export
8. Enterprise Governance
9. Multi-Cloud Migration Intelligence

---

# Exit Criteria

The MVP is complete when a user can:

1. Sign in.
2. Create a project.
3. Build an AWS, Azure, or GCP architecture visually.
4. Receive intelligent validation while designing.
5. Save the architecture.
6. Export it as an image or JSON.
7. Reopen and continue editing later.

If these seven tasks can be completed smoothly, BlackCloud has achieved its MVP and is ready for user testing and iterative development.
