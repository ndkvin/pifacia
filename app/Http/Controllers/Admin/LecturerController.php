<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LecturerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // dd(\App\Models\Lecturer::all());
        return inertia('admin/lecturer', [
            'lectures' => \App\Models\Lecturer::all(),
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
            'is_active' => 'required|boolean',
            'profile' => 'required|array',
            'profile.nip' => 'required|string|max:255',
            'profile.home_base' => 'required|string|max:255',
        ]);

        \App\Models\Lecturer::create([
            'name' => $request->name,
            'email' => $request->email,
            'profile' => json_encode([
                'nip' => $request->profile['nip'],
                'home_base' => $request->profile['home_base'],
            ]),
            'is_active' => $request->is_active,
        ]);

        return redirect()->route('dashboard.lecturer.index')->with('success', 'Lecturer created successfully.');
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
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255',
            'is_active' => 'required|boolean',
            'profile' => 'required|array',
            'profile.nip' => 'required|string|max:255',
            'profile.home_base' => 'required|string|max:255',
        ]);

        $lecturer = \App\Models\Lecturer::findOrFail($id);
        $lecturer->update([
            'name' => $request->name,
            'email' => $request->email,
            'profile' => json_encode([
                'nip' => $request->profile['nip'],
                'home_base' => $request->profile['home_base'],
            ]),
            'is_active' => $request->is_active,
        ]);

        return redirect()->route('dashboard.lecturer.index')->with('success', 'Lecturer updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $lecturer = \App\Models\Lecturer::findOrFail($id);
        $lecturer->delete();

        return redirect()->route('dashboard.lecturer.index')->with('success', 'Lecturer deleted successfully.');
    }
}
