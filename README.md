Here is an improved version of the backend documentation for **DocHawk** in markdown format. I've cleaned up the structure and added some additional details to improve clarity and readability.

# Backend Project - DocHawk

This is the backend for **DocHawk**, a platform that allows generating keyword reports. The platform supports both immediate and scheduled email reports. This service is built using **NestJS**.

## Prerequisites

Before starting, ensure the following tools are installed:

- **Node.js** (version 22)
- **npm** (comes with Node.js)
- **MongoDB** (the database for storing task and user data)
- **Mailer Service** (used for sending emails with the reports)

## Installation

Follow the instructions below to set up the project on your local machine:

### Step 1: Clone the repository

```bash
git clone https://github.com/your_username/backend-search-keyword.git
cd backend-search-keyword
```

### Step 2: Configure environment variables

Create a `.env` file in the root directory and add the following environment variables:

```bash
EMAIL_N="YOUR_EMAIL"
HOST="YOUR_PORT"
PORT="PORT"
PASSWORD_EMAIL="YOUR_PASSWORD_APP_EMAIL"
MONGODB_URI="YOUR_STRING_URL_TO_MONGODB"
```

### Step 3: Install dependencies

Install the necessary dependencies using npm:

```bash
npm install
```

### Step 4: Start the server

To run the server locally in development mode:

```bash
npm run start:dev
```

## Features

1. **Sending Reports via Email**  
   The backend allows sending keyword reports in HTML format via email. There are two ways to send the reports:

   - **Immediate Execution** (`/analyze`): Sends the keyword report immediately to the provided email address.
   - **Scheduled Task** (`/schedule-task`): Allows scheduling the report to be sent at a specific date and time. There's also an option to set the task to repeat every month.

2. **HTML Report Generation**  
   Reports are generated in HTML format and can include various types of reports and tags, which the user can select when creating a task.

3. **Email Configuration**  
   The backend uses a MailerService along with an email provider (Google Mailer or other SMTP servers) to send the reports via email. Ensure that the correct credentials are configured in the `.env` file.

4. **Get Historical Data**  
   The `/getfile` endpoint allows you to retrieve historical records from the database, including the URL of the report, the title, the userId, and the creation date of the report.

## How It Works

### 1. **Scheduling a Task**

- The user submits a request to create a task, providing information such as title, email, report type, and tags.
- If **"Schedule"** is selected, the user picks a date and time. The system stores the task in the database with the scheduled time.

### 2. **Sending the Report**

- The **MailerService** triggers the report delivery via email at the scheduled time. The system uses the Google SMTP server or another configured server for sending emails.
- Reports can be sent immediately or at the scheduled time, and they can be set to repeat monthly.

## Routes and Parameters

### 1. **/schedule-task and /analyze**

The `/analyze` function is responsible for executing the entire task.

**Request Body Parameters:**

```json
{
    "url": ["string"],               // The URL to be analyzed.
    "keywords": ["string"],          // List of keywords to be tracked in the provided URL.
    "email": ["string"],             // List of emails to which the report will be sent.
    "schedule": boolean,             // Indicates if the task is scheduled (true) or immediate (false).
    "scheduleAt": "string",          // The exact date and time when the task is scheduled to run (ISO 8601 format).
    "repeatMonthly": boolean,        // If true, the task will repeat monthly.
    "title": "string",               // The title of the report or task.
    "reportType": "string",          // The type of the report to be generated.
    "tags": ["string"],              // Tags associated with the task or report.
    "userId": "string"               // A unique identifier for the user (usually IP + User-Agent).
}
```

### 2. **How It Works**

#### Immediate Execution (`schedule: false`):

If the **schedule** parameter is set to `false`, the task will execute immediately. The system will trigger the analysis and send the report right away.

#### Scheduled Tasks (`schedule: true`):

If **schedule** is set to `true`, the task will run at the specified **scheduleAt** time. The task will repeat monthly if **repeatMonthly** is set to `true`. The report will be generated and sent according to the specified schedule.

### Use Case Examples:

#### Immediate Report:

A user wants to track certain keywords and get a report right away. This is indicated by setting `schedule` to `false`.

#### Scheduled Report:

A user wants to track keywords monthly and receive a report at a specific time. This is indicated by setting `schedule` to `true`, specifying the `scheduleAt` date/time, and enabling `repeatMonthly` for recurring reports.

### Notes:

- The **scheduleAt** field must follow the ISO 8601 format for accurate scheduling.
- The **repeatMonthly** field is effective only if **schedule** is set to `true`.
- The **userId** helps uniquely identify users making requests and can be useful for debugging or tracking user activity.

## Endpoints

### 1. **POST /schedule-task**

This endpoint is used to create a task that can be scheduled or executed immediately.

**Request Body Example:**

```json
{
  "url": ["https://example.com"],
  "keywords": ["keyword1", "keyword2"],
  "email": ["user@example.com"],
  "schedule": true,
  "scheduleAt": "2025-04-30T10:00:00Z",
  "repeatMonthly": true,
  "title": "Monthly Keyword Report",
  "reportType": "Keyword Analysis",
  "tags": ["SEO", "Analytics"],
  "userId": "user123"
}
```

### 2. **POST /analyze**

This endpoint triggers an immediate report generation. The request body contains similar parameters as `/schedule-task`, but **schedule** will always be `false`.

**Request Body Example:**

```json
{
  "url": ["https://example.com"],
  "keywords": ["keyword1", "keyword2"],
  "email": ["user@example.com"],
  "schedule": false,
  "title": "Immediate Keyword Report",
  "reportType": "Keyword Analysis",
  "tags": ["SEO", "Analytics"],
  "userId": "user123"
}
```

### 3. **GET /getfile**

This endpoint allows you to retrieve historical records from the database.

**Response Example:**

```json
[
  {
    "url": "https://example.com",
    "title": "Keyword Report",
    "userId": "user123",
    "createdAt": "2025-04-15T10:00:00Z"
  },
  {
    "url": "https://another-example.com",
    "title": "Traffic Analysis",
    "userId": "user456",
    "createdAt": "2025-04-14T09:00:00Z"
  }
]
```

## Conclusion

The **DocHawk** backend provides a comprehensive platform for generating keyword-based reports. It integrates task scheduling, immediate report execution, monthly repetition, and email delivery of reports. By leveraging **NestJS**, it allows for a scalable and flexible solution for report generation and task management.

### Key Changes:

- The structure has been organized more logically.
- The **How It Works** section is improved to explain the two execution types (immediate and scheduled).
- Provided example JSON requests for clarity.
- Added **GET /getfile** endpoint and its example.

This structure should give both developers and users a clearer understanding of how the **DocHawk** backend functions and how to interact with its API.
