# Assessment Report Generator

A CLI application to generate diagnostic, progress, and feedback reports for student assessments, integrated with a Laravel project.

## Prerequisites
- PHP (>= 8.0)
- Laravel (>= 9.0)
- Node.js (version 20 or higher)
- npm
- Composer

## Installation
1. Clone the Laravel project repository.
2. Run `composer install` to install PHP dependencies.
3. Navigate to `resources/assessment-report` and install Node.js dependencies:

#Test
php artisan report:generate {studentId} {reportType}

#Samples

1.php artisan report:generate student1 2

Tony Stark has completed Numeracy assessment 3 times in total. Date and raw score given below:

Date: December 16, 2019 at 10:46 AM, Raw Score: 6 out of 16
Date: December 16, 2020 at 10:46 AM, Raw Score: 10 out of 16
Date: December 16, 2021 at 10:46 AM, Raw Score: 15 out of 16

Tony Stark got 9 more correct in the recent completed assessment than the oldest

2.php artisan report:generate student1 1

Tony Stark recently completed Numeracy assessment on December 16, 2019 at 10:46 AM
He got 6 questions right out of 16. Details by strand given below:

Number and Algebra: 3 out of 5 correct
Measurement and Geometry: 2 out of 7 correct
Statistics and Probability: 1 out of 4 correct

