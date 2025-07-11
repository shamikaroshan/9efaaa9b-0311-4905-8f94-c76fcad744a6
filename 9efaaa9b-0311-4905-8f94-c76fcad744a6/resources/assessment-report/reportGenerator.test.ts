import { AssessmentReportGenerator } from './index';

describe('AssessmentReportGenerator', () => {
  let generator: AssessmentReportGenerator;

  beforeEach(() => {
    generator = new AssessmentReportGenerator();
  });

  test('generateDiagnosticReport produces correct output for student1', () => {
    const report = generator.generateDiagnosticReport('student1');
    expect(report).toContain('Tony Stark recently completed Numeracy assessment');
    expect(report).toContain('Numeracy and Algebra: 5 out of 5 correct');
    expect(report).toContain('Measurement and Geometry: 7 out of 7 correct');
    expect(report).toContain('Statistics and Probability: 3 out of 4 correct');
  });

  test('generateProgressReport shows improvement for student1', () => {
    const report = generator.generateProgressReport('student1');
    expect(report).toContain('Tony Stark has completed Numeracy assessment');
    expect(report).toContain('Raw Score: 6 out of 16');
    expect(report).toContain('Raw Score: 10 out of 16');
    expect(report).toContain('Raw Score: 15 out of 16');
    expect(report).toContain('Tony Stark got 9 more correct');
  });

  test('generateFeedbackReport shows incorrect answers for student1', () => {
    const report = generator.generateFeedbackReport('student1');
    expect(report).toContain('Tony Stark recently completed Numeracy assessment');
    expect(report).toContain('What is the \'median\' of the following group of numbers 5, 21, 7, 18, 9?');
    expect(report).toContain('Your answer: A with value 7');
    expect(report).toContain('Right answer: B with value 9');
  });
});
