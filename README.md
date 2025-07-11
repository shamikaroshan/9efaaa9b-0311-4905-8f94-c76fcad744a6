# Assessment Report Generator

A CLI application for generating assessment reports from JSON data, integrated with a Laravel application.

## Prerequisites

- **Node.js**: Version 22.14.0 or higher
- **npm**: Installed with Node.js
- **TypeScript**: Installed via npm
- **Jest**: For running tests
- **moment.js**: For date parsing
- **Laravel**: For running the Artisan command
- **PHP**: For Laravel integration

## Setup

1. **Navigate to the project directory**:
   ```bash
   cd resources/assessment-report


Install dependencies:
npm install


Build the TypeScript application:
npm run build



Running the Application
The application generates three types of reports for a given student ID:

Diagnostic Report (type 1): Shows the latest assessment results with performance by strand.
Progress Report (type 2): Lists all completed assessments with dates and scores.
Feedback Report (type 3): Provides feedback on incorrect answers from the latest assessment.

Using NPM
Run the application with:
npm run app <studentId> <reportType>

Example:
npm run app student1 1

This runs the diagnostic report for student1.
Note: Replace <studentId> with a valid student ID (e.g., student1, student2) and <reportType> with 1, 2, or 3.
Using Laravel Artisan
From the Laravel project root:
php artisan report:generate <studentId> <reportType>

Example:
php artisan report:generate student1 1

Running Tests
Run Jest tests to verify the application:
npm run test

Data Files
The application expects the following JSON files in resources/assessment-report/data:

students.json: List of students.
assessments.json: List of assessments.
questions.json: List of questions with strands and correct answers.
student-responses.json: Student responses with dates and scores.

Dates in student-responses.json must be in DD/MM/YYYY HH:mm:ss format (e.g., 16/12/2021 10:46:00).
Troubleshooting

Module not found errors: Ensure dependencies are installed with npm install.
Invalid Date errors: Verify date formats in student-responses.json.
Build errors: Check tsconfig.json and run npx tsc --noEmit to diagnose TypeScript issues.

Development

TypeScript: Source code is in resources/assessment-report/src.
Tests: Jest tests are in resources/assessment-report/src/reportGenerator.test.ts.
Build: Outputs to resources/assessment-report/dist.

For Laravel integration, see app/Console/Commands/GenerateAssessmentReport.php.```
