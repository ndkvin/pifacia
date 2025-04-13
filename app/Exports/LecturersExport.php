<?php

namespace App\Exports;

use App\Models\Lecturer;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;


class LecturersExport implements FromCollection, WithHeadings, WithMapping
{
    public function collection()
    {
        return Lecturer::all();  // Fetch all lecturers
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function headings(): array
    {
        return [
            'ID',
            'Name',
            'Email',
            'NIP',
            'Home Base',
            'Is Active',
        ];
    }

    public function map($lecturer): array
    {
        // Decode the profile data if it’s stored as JSON
        $profileData = is_string($lecturer->profile)
            ? json_decode($lecturer->profile, true)
            : $lecturer->profile;

        return [
            $lecturer->id,
            $lecturer->name,
            $lecturer->email,
            $profileData['nip'] ?? '-',
            $profileData['home_base'] ?? '-',
            $lecturer->is_active ? 'Active' : 'Inactive',
        ];
    }
}
