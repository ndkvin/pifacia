<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use App\Exports\StudentsExport;
use Maatwebsite\Excel\Facades\Excel;

class ExportStudentsJob implements ShouldQueue
{
    use Queueable;

    protected $filename;

    /**
     * Create a new job instance.
     */
    public function __construct($filename)
    {
        $this->filename = $filename;
    }

    /**
     * Execute the job.
     */
    public function handle()
    {
        // Use Excel facade to download the data in the background
        Excel::store(new StudentsExport, 'exports/' . $this->filename);
    }
}
