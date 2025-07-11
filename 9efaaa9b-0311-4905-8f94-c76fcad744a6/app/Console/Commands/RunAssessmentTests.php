<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class RunAssessmentTests extends Command
{
    protected $signature = 'report:test';
    protected $description = 'Run tests for the assessment report generator';

    public function handle()
    {
        $testPath = base_path('resources/assessment-report');
        $command = sprintf('cd %s && npm run test', escapeshellarg($testPath));
        $output = shell_exec($command);
        $this->info($output);
        return 0;
    }
}
