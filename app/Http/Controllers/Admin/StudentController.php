<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $students = \App\Models\Student::all();

        return inertia('admin/student', [
            'students' => \App\Models\Student::all(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255',
            'nim' => 'required|string|max:255',
            'name_fakultas' => 'required|string|max:255',
            'jurusan' => 'required|string|max:255',
            'is_active' => 'required|boolean',
        ]);

        \App\Models\Student::create([
            'name' => $request->name,
            'email' => $request->email,
            'profile_data' => json_encode([
                'nim' => $request->nim,
                'name_jurusan' => $request->jurusan,
                'fakultas' => $request->name_fakultas,
            ]),
            'is_active' => $request->is_active,
        ]);

        return redirect()->route('dashboard.student.index')->with('success', 'Student created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {  

        // dd($request->all());
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255',
            'nim' => 'required|string|max:255',
            'name_fakultas' => 'required|string|max:255',
            'jurusan' => 'required|string|max:255',
            'is_active' => 'required|boolean',
        ]);

        $student = \App\Models\Student::findOrFail($id);

        $student->update([
            'name' => $request->name,
            'email' => $request->email,
            'profile_data' => json_encode([
                'nim' => $request->nim,
                'name_jurusan' => $request->jurusan,
                'fakultas' => $request->name_fakultas,
            ]),
            'is_active' => $request->is_active,
        ]);

        return redirect()->route('dashboard.student.index')->with('success', 'Student updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $student = \App\Models\Student::findOrFail($id);
        $student->delete();

        return redirect()->route('dashboard.student.index')->with('success', 'Student deleted successfully.');
    }
}
