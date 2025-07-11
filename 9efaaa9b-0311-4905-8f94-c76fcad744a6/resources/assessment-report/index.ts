 import * as fs from 'fs';
     import * as path from 'path';
     import moment from 'moment';

   interface Student {
     id: string;
     firstName: string;
     lastName: string;
     yearLevel: number;
   }

   interface Question {
     id: string;
     stem: string;
     type: string;
     strand: string;
     config: {
       options: { id: string; label: string; value: string }[];
       key: string;
       hint: string;
     };
   }

   interface Assessment {
     id: string;
     name: string;
     questions: { questionId: string; position: number }[];
   }

   interface StudentResponse {
     id: string;
     assessmentId: string;
     assigned: string;
     started: string;
     completed?: string;
     student: { id: string; yearLevel: number };
     responses: { questionId: string; response: string }[];
     results: { rawScore: number };
   }

export class AssessmentReportGenerator {
       private students: Student[];
       private assessments: Assessment[];
       private questions: Question[];
       private responses: StudentResponse[];

       constructor() {
         const dataDir = path.resolve(__dirname, '..', 'data');
         this.students = JSON.parse(fs.readFileSync(path.join(dataDir, 'students.json'), 'utf-8'));
         this.assessments = JSON.parse(fs.readFileSync(path.join(dataDir, 'assessments.json'), 'utf-8'));
         this.questions = JSON.parse(fs.readFileSync(path.join(dataDir, 'questions.json'), 'utf-8'));
         this.responses = JSON.parse(fs.readFileSync(path.join(dataDir, 'student-responses.json'), 'utf-8'));
       }

       private getStudentName(studentId: string): string {
         const student = this.students.find(s => s.id === studentId);
         return student ? `${student.firstName} ${student.lastName}` : 'Unknown Student';
       }

       private formatDate(dateStr?: string): string {
         if (!dateStr) {
           return 'Date not available';
         }
         const date = moment(dateStr, 'DD/MM/YYYY HH:mm:ss', true);
         if (!date.isValid()) {
           return 'Invalid Date';
         }
         return date.toDate().toLocaleString('en-US', {
           day: 'numeric',
           month: 'long',
           year: 'numeric',
           hour: 'numeric',
           minute: '2-digit',
           hour12: true
         });
       }

       generateDiagnosticReport(studentId: string): string {
         const latestResponse = this.responses
           .filter(r => r.student.id === studentId && r.completed)
           .sort((a, b) => new Date(b.completed!).getTime() - new Date(a.completed!).getTime())[0];

         if (!latestResponse) return 'No completed assessments found for this student.';

         const assessment = this.assessments.find(a => a.id === latestResponse.assessmentId);
         const totalQuestions = this.questions.length;
         const strands = [...new Set(this.questions.map(q => q.strand))];
         let report = `${this.getStudentName(studentId)} recently completed ${assessment?.name} assessment on ${this.formatDate(latestResponse.completed!)}\n`;
         report += `He got ${latestResponse.results.rawScore} questions right out of ${totalQuestions}. Details by strand given below:\n\n`;

         strands.forEach(strand => {
           const strandQuestions = this.questions.filter(q => q.strand === strand);
           const correct = latestResponse.responses.filter(r => {
             const question = this.questions.find(q => q.id === r.questionId);
             return question && question.config.key === r.response;
           }).filter(r => {
             const question = this.questions.find(q => q.id === r.questionId);
             return question && question.strand === strand;
           }).length;
           report += `${strand}: ${correct} out of ${strandQuestions.length} correct\n`;
         });

         return report;
       }

       generateProgressReport(studentId: string): string {
         const studentResponses = this.responses
           .filter(r => r.student.id === studentId && r.completed)
           .sort((a, b) => new Date(a.completed!).getTime() - new Date(b.completed!).getTime());

         if (studentResponses.length === 0) return 'No completed assessments found for this student.';

         const assessment = this.assessments.find(a => a.id === studentResponses[0].assessmentId);
         let report = `${this.getStudentName(studentId)} has completed ${assessment?.name} assessment ${studentResponses.length} times in total. Date and raw score given below:\n\n`;

         studentResponses.forEach(response => {
           report += `Date: ${this.formatDate(response.completed!)}, Raw Score: ${response.results.rawScore} out of ${this.questions.length}\n`;
         });

         if (studentResponses.length > 1) {
           const scoreDiff = studentResponses[studentResponses.length - 1].results.rawScore - studentResponses[0].results.rawScore;
           report += `\n${this.getStudentName(studentId)} got ${Math.abs(scoreDiff)} ${scoreDiff >= 0 ? 'more' : 'less'} correct in the recent completed assessment than the oldest`;
         }

         return report;
       }

       generateFeedbackReport(studentId: string): string {
         const latestResponse = this.responses
           .filter(r => r.student.id === studentId && r.completed)
           .sort((a, b) => new Date(b.completed!).getTime() - new Date(a.completed!).getTime())[0];

         if (!latestResponse) return 'No completed assessments found for this student.';

         const assessment = this.assessments.find(a => a.id === latestResponse.assessmentId);
         let report = `${this.getStudentName(studentId)} recently completed ${assessment?.name} assessment on ${this.formatDate(latestResponse.completed!)}\n`;
         report += `He got ${latestResponse.results.rawScore} questions right out of ${this.questions.length}. Feedback for wrong answers given below:\n\n`;

         const wrongAnswers = latestResponse.responses.filter(r => {
           const question = this.questions.find(q => q.id === r.questionId);
           return question && question.config.key !== r.response;
         });

         wrongAnswers.forEach(response => {
           const question = this.questions.find(q => q.id === response.questionId);
           if (question) {
             const selectedOption = question.config.options.find(o => o.id === response.response);
             const correctOption = question.config.options.find(o => o.id === question.config.key);
             report += `Question: ${question.stem}\n`;
             report += `Your answer: ${selectedOption?.label} with value ${selectedOption?.value}\n`;
             report += `Right answer: ${correctOption?.label} with value ${correctOption?.value}\n`;
             report += `Hint: ${question.config.hint}\n\n`;
           }
         });

         if (wrongAnswers.length === 0) {
           report += 'No incorrect answers found.';
         }

         return report;
       }
     }

     function main() {
       const args = process.argv.slice(2);
       const studentId = args[0];
       const reportType = args[1];

       if (!studentId || !reportType) {
         console.error('Please provide Student ID and Report Type (1 for Diagnostic, 2 for Progress, 3 for Feedback)');
         process.exit(1);
       }

       const generator = new AssessmentReportGenerator();
       let report: string;

       switch (reportType) {
         case '1':
           report = generator.generateDiagnosticReport(studentId);
           break;
         case '2':
           report = generator.generateProgressReport(studentId);
           break;
         case '3':
           report = generator.generateFeedbackReport(studentId);
           break;
         default:
           report = 'Invalid report type selected.';
       }

       console.log(report);
     }

     main();
