<?php

namespace App\Exports;

use App\Models\Student;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class StudentsExport implements FromCollection, WithHeadings, WithMapping
{
    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        return Student::all();
    }

    public function headings(): array
    {
        return [
            'ID',
            'Name',
            'Email',
            'NIM',
            'Jurusan',
            'Fakultas',
            'Is Active',
        ];
    }

    public function map($student): array
    {
        $profileData = is_string($student->profile_data) 
            ? json_decode($student->profile_data, true) 
            : $student->profile_data;

        return [
            $student->id,
            $student->name,
            $student->email,
            $profileData['nim'] ?? '-',
            $profileData['name_jurusan'] ?? '-',
            $profileData['fakultas'] ?? '-',
            $student->is_active ? 'Active' : 'Inactive',
        ];
    }
}
