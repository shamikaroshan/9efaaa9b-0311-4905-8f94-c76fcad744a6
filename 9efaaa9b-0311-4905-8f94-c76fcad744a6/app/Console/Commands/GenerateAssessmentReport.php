<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class GenerateAssessmentReport extends Command
{
    protected $signature = 'report:generate {studentId} {reportType : Report type (1 for Diagnostic, 2 for Progress, 3 for Feedback)}';
    protected $description = 'Generate an assessment report for a student';

    public function handle()
    {
        $studentId = $this->argument('studentId');
        $reportType = $this->argument('reportType');


        if (!in_array($reportType, ['1', '2', '3'])) {
            $this->error('Invalid report type. Use 1 for Diagnostic, 2 for Progress, or 3 for Feedback.');
            return 1;
        }


        $scriptPath = base_path('resources/assessment-report/dist/index.js');


        $command = sprintf(
            'node %s %s %s',
            escapeshellarg($scriptPath),
            escapeshellarg($studentId),
            escapeshellarg($reportType)
        );


        $output = shell_exec($command);


        $this->info($output);

        return 0;
    }
}
