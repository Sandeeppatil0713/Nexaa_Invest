# Aura Invest

Build a production-ready, responsive MERN Stack Investment & MLM Referral Platform with a premium modern SaaS landing page and dashboard.

## Design Inspiration

Use a premium Framer-inspired design language.

The website should NOT copy any existing brand or template but should have the same premium feel.

Use:

• Dark theme (#050505 background)

• Blue and Orange gradient glows

• Glassmorphism cards

• Soft shadows

• Large typography

• Rounded corners (16-24px)

• Premium SaaS aesthetics

• Smooth scrolling

• Framer Motion animations

• Hover effects

• Animated gradient borders

• Floating blur backgrounds

• Minimal clean layout

• Fully responsive

• Modern spacing

• High quality UI/UX

Use React + TailwindCSS + Framer Motion.

Use Lucide React icons.

Animations should include:

- Fade In

- Slide Up

- Scale on Hover

- Floating Background Lights

- Glow Effects

- Animated Counters

- Stagger Card Animations

--------------------------------------------

PROJECT NAME

NexaInvest

An Investment & Referral Platform

--------------------------------------------

Navbar

Sticky transparent navbar

Logo

Navigation

Home

Features

How It Works

Dashboard

Plans

FAQ

Contact

Buttons

Login

Register

Navbar becomes glassmorphism on scroll.

--------------------------------------------

Hero Section

Large heading

Invest Smarter.

Earn Daily.

Grow Together.

Subtitle

A secure investment platform where users can invest in plans, earn daily ROI, build referral networks, and track everything from a beautiful dashboard.

Buttons

Get Started

View Dashboard

Right side

Modern 3D dashboard mockup showing

Wallet

Daily ROI

Referral Income

Investment Growth

Animated background

Blue glow

Orange glow

Grid pattern

Floating particles

--------------------------------------------

Trusted Statistics

Display animated counters

50K+

Active Investors

₹120M+

Investments

₹25M+

ROI Distributed

150+

Countries

--------------------------------------------

Features Section

Use premium glass cards.

Features

Secure JWT Authentication

Investment Management

Daily Automated ROI

Referral Network

Wallet Management

ROI History

Investment Analytics

Referral Tree

Responsive Dashboard

Fast API

MongoDB Database

Cron Job Automation

Each card should have

Icon

Title

Description

Hover animation

Gradient border

--------------------------------------------

How It Works

Create an animated timeline.

Step 1

Register

Create an account using email, mobile number and password.

Generate your own referral code.

Optionally register using another user's referral code.

Step 2

Login

Authenticate securely using JWT.

Access private dashboard.

Step 3

Invest

Choose an investment plan.

Enter investment amount.

Investment becomes Active.

Step 4

Earn Daily ROI

Every day at midnight a scheduler automatically calculates ROI.

Wallet gets updated.

ROI history gets stored.

Step 5

Referral Earnings

Invite friends using referral code.

When referrals invest,

Eligible users receive level income.

Step 6

Track Everything

Dashboard displays

Wallet

Investments

Daily ROI

Referral Income

Investment History

ROI History

Referral Tree

Charts

--------------------------------------------

Investment Plans

Premium pricing cards.

Starter

Professional

Enterprise

Each plan should include

Investment Amount

ROI Percentage

Duration

Expected Returns

CTA

Invest Now

--------------------------------------------

Dashboard Preview

Show modern analytics UI.

Cards

Wallet Balance

Total Investment

Total ROI Earned

Level Income

Charts

Investment Growth

ROI Trend

Wallet Growth

Referral Earnings

Tables

Investment History

ROI History

Referral Income

Referral Tree

Recent Transactions

--------------------------------------------

Referral System Section

Illustrate the hierarchy visually.

Example

User

↓

Level 1

↓

Level 2

↓

Level 3

↓

Level 4

Show how referral income flows upward.

Animated tree visualization.

--------------------------------------------

Business Logic Showcase

Explain platform automation.

Daily Scheduler

Runs every day at 12 AM

Finds Active Investments

Calculates ROI

Updates Wallet

Stores ROI History

Distributes Referral Income

Prevents Duplicate Credits

Display as modern workflow cards connected by animated arrows.

--------------------------------------------

Technology Section

Display stack icons.

React

Node.js

Express

MongoDB

JWT

Node Cron

Tailwind CSS

Framer Motion

Mongoose

--------------------------------------------

Security Section

JWT Authentication

Encrypted Passwords

Protected Routes

Role Based Authorization

MongoDB Validation

Secure APIs

Optimized Database Queries

Transaction Safety

--------------------------------------------

API Showcase

Modern code cards.

Authentication APIs

POST /register

POST /login

Investment APIs

POST /investment

GET /investments

Dashboard APIs

GET /dashboard

Referral APIs

GET /referrals

GET /referral-tree

--------------------------------------------

Database Architecture

Visual cards for collections.

Users

Fields

Full Name

Email

Mobile

Password

Referral Code

Referred By

Wallet Balance

Total ROI

Level Income

Status

Investments

User

Amount

Plan

Daily ROI

Start Date

End Date

Status

ROI History

Investment

Amount

Date

Status

Referral Income

Receiver

Generated By

Level

Amount

Date

--------------------------------------------

Testimonials

Premium cards.

Investor reviews.

--------------------------------------------

FAQ

Questions

How does ROI work?

How are referrals calculated?

Is my wallet secure?

How often is ROI credited?

Can I track my earnings?

--------------------------------------------

Footer

Company

About

Features

Pricing

Documentation

Support

Privacy Policy

Terms

Social Icons

Newsletter

--------------------------------------------

UI Guidelines

Rounded cards

Glassmorphism

Dark gradients

Orange + Blue accent colors

Smooth hover transitions

Large typography

Beautiful spacing

No clutter

Modern premium SaaS appearance

Looks like a premium $79 Framer template.

--------------------------------------------

Backend Architecture

Generate complete MERN folder structure.

client/

server/

controllers/

routes/

middleware/

models/

services/

cron/

utils/

config/

--------------------------------------------

Backend Features

Implement:

JWT Authentication

User Registration

User Login

Password Encryption

Investment CRUD

Dashboard APIs

Referral APIs

Referral Tree

Daily ROI Calculation

Cron Job

Wallet Updates

ROI History

Referral Income Distribution

MongoDB Models

Proper Relationships

Indexes

Validation

Centralized Error Handling

REST API Structure

--------------------------------------------

Business Logic

Every day at 12 AM

Find active investments

Calculate daily ROI

Save ROI history

Update wallet

Update total ROI

Traverse referral hierarchy

Calculate level income

Credit eligible users

Store referral history

Prevent duplicate processing using idempotent logic.

--------------------------------------------

Frontend

Responsive React application.

Pages

Landing

Login

Register

Dashboard

Investments

Wallet

Referral Tree

ROI History

Profile

Settings

Admin Dashboard (optional)

--------------------------------------------

Charts

Use Recharts.

Investment Analytics

ROI Trend

Wallet Growth

Referral Earnings

Monthly Growth

--------------------------------------------

Code Quality

Generate clean production-ready code.

Use reusable React components.

Use Context API or Redux Toolkit for authentication.

Use Axios.

Use React Router.

Use environment variables.

Use Tailwind utility classes.

Organize code into reusable folders.

Follow scalable architecture.

The final application should look like a premium SaaS product while implementing all features required in the MERN Stack Developer Technical Assessment, including database schema, authentication, investments, dashboard, referral system, ROI automation, cron jobs, API architecture, and responsive UI.

NexaInvest is an investment & referral platform delivering automated daily ROI, transparent wallets, and multi-level network earnings.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
