"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentReportGenerator = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const moment_1 = __importDefault(require("moment"));
class AssessmentReportGenerator {
    constructor() {
        const dataDir = path.resolve(__dirname, '..', 'data');
        this.students = JSON.parse(fs.readFileSync(path.join(dataDir, 'students.json'), 'utf-8'));
        this.assessments = JSON.parse(fs.readFileSync(path.join(dataDir, 'assessments.json'), 'utf-8'));
        this.questions = JSON.parse(fs.readFileSync(path.join(dataDir, 'questions.json'), 'utf-8'));
        this.responses = JSON.parse(fs.readFileSync(path.join(dataDir, 'student-responses.json'), 'utf-8'));
    }
    getStudentName(studentId) {
        const student = this.students.find(s => s.id === studentId);
        return student ? `${student.firstName} ${student.lastName}` : 'Unknown Student';
    }
    formatDate(dateStr) {
        if (!dateStr) {
            return 'Date not available';
        }
        const date = (0, moment_1.default)(dateStr, 'DD/MM/YYYY HH:mm:ss', true);
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
    generateDiagnosticReport(studentId) {
        const latestResponse = this.responses
            .filter(r => r.student.id === studentId && r.completed)
            .sort((a, b) => new Date(b.completed).getTime() - new Date(a.completed).getTime())[0];
        if (!latestResponse)
            return 'No completed assessments found for this student.';
        const assessment = this.assessments.find(a => a.id === latestResponse.assessmentId);
        const totalQuestions = this.questions.length;
        const strands = [...new Set(this.questions.map(q => q.strand))];
        let report = `${this.getStudentName(studentId)} recently completed ${assessment === null || assessment === void 0 ? void 0 : assessment.name} assessment on ${this.formatDate(latestResponse.completed)}\n`;
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
    generateProgressReport(studentId) {
        const studentResponses = this.responses
            .filter(r => r.student.id === studentId && r.completed)
            .sort((a, b) => new Date(a.completed).getTime() - new Date(b.completed).getTime());
        if (studentResponses.length === 0)
            return 'No completed assessments found for this student.';
        const assessment = this.assessments.find(a => a.id === studentResponses[0].assessmentId);
        let report = `${this.getStudentName(studentId)} has completed ${assessment === null || assessment === void 0 ? void 0 : assessment.name} assessment ${studentResponses.length} times in total. Date and raw score given below:\n\n`;
        studentResponses.forEach(response => {
            report += `Date: ${this.formatDate(response.completed)}, Raw Score: ${response.results.rawScore} out of ${this.questions.length}\n`;
        });
        if (studentResponses.length > 1) {
            const scoreDiff = studentResponses[studentResponses.length - 1].results.rawScore - studentResponses[0].results.rawScore;
            report += `\n${this.getStudentName(studentId)} got ${Math.abs(scoreDiff)} ${scoreDiff >= 0 ? 'more' : 'less'} correct in the recent completed assessment than the oldest`;
        }
        return report;
    }
    generateFeedbackReport(studentId) {
        const latestResponse = this.responses
            .filter(r => r.student.id === studentId && r.completed)
            .sort((a, b) => new Date(b.completed).getTime() - new Date(a.completed).getTime())[0];
        if (!latestResponse)
            return 'No completed assessments found for this student.';
        const assessment = this.assessments.find(a => a.id === latestResponse.assessmentId);
        let report = `${this.getStudentName(studentId)} recently completed ${assessment === null || assessment === void 0 ? void 0 : assessment.name} assessment on ${this.formatDate(latestResponse.completed)}\n`;
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
                report += `Your answer: ${selectedOption === null || selectedOption === void 0 ? void 0 : selectedOption.label} with value ${selectedOption === null || selectedOption === void 0 ? void 0 : selectedOption.value}\n`;
                report += `Right answer: ${correctOption === null || correctOption === void 0 ? void 0 : correctOption.label} with value ${correctOption === null || correctOption === void 0 ? void 0 : correctOption.value}\n`;
                report += `Hint: ${question.config.hint}\n\n`;
            }
        });
        if (wrongAnswers.length === 0) {
            report += 'No incorrect answers found.';
        }
        return report;
    }
}
exports.AssessmentReportGenerator = AssessmentReportGenerator;
function main() {
    const args = process.argv.slice(2);
    const studentId = args[0];
    const reportType = args[1];
    if (!studentId || !reportType) {
        console.error('Please provide Student ID and Report Type (1 for Diagnostic, 2 for Progress, 3 for Feedback)');
        process.exit(1);
    }
    const generator = new AssessmentReportGenerator();
    let report;
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
