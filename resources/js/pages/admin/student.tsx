import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ColumnDef } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { toast } from "sonner";
import { ArrowDown, ArrowUp } from 'lucide-react';

export type Student = {
    id: string;
    name: string;
    email: string;
    nim: string;
    name_fakultas: string; // Updated for faculty name
    jurusan: string;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export function getColumns(
    handleEdit: (student: any) => void,
    handleDelete: (student: any) => void
): ColumnDef<any>[] {
    return [
        {
            accessorKey: "name",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Name
                    {column.getIsSorted() === "asc" ? (
                        <ArrowUp className="ml-2 h-4 w-4" />
                    ) : (
                        <ArrowDown className="ml-2 h-4 w-4" />
                    )}
                </Button>
            ),
        },
        {
            accessorKey: "email",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Email
                    {column.getIsSorted() === "asc" ? (
                        <ArrowUp className="ml-2 h-4 w-4" />
                    ) : (
                        <ArrowDown className="ml-2 h-4 w-4" />
                    )}
                </Button>
            ),
        },
        {
            accessorKey: "nim",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    NIM
                    {column.getIsSorted() === "asc" ? (
                        <ArrowUp className="ml-2 h-4 w-4" />
                    ) : (
                        <ArrowDown className="ml-2 h-4 w-4" />
                    )}
                </Button>
            ),
            cell: ({ row }) => {
                // Decode the profile_data
                const profileData = JSON.parse(row.original.profile_data);
                return <span>{profileData.nim}</span>; // Display NIM
            }
        },
        {
            accessorKey: "is_active", // Updated column header for Fakultas
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Is Active
                    {column.getIsSorted() === "asc" ? (
                        <ArrowUp className="ml-2 h-4 w-4" />
                    ) : (
                        <ArrowDown className="ml-2 h-4 w-4" />
                    )}
                </Button>
            ),
        },
        {
            accessorKey: "fakultas", // Updated column header for Fakultas
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Fakultas
                    {column.getIsSorted() === "asc" ? (
                        <ArrowUp className="ml-2 h-4 w-4" />
                    ) : (
                        <ArrowDown className="ml-2 h-4 w-4" />
                    )}
                </Button>
            ),
            cell: ({ row }) => {
                // Decode the profile_data
                const profileData = JSON.parse(row.original.profile_data);
                return <span>{profileData.fakultas}</span>; // Display Fakultas
            }
        },
        {
            accessorKey: "name_jurusan", // Updated column header for Jurusan
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Jurusan
                    {column.getIsSorted() === "asc" ? (
                        <ArrowUp className="ml-2 h-4 w-4" />
                    ) : (
                        <ArrowDown className="ml-2 h-4 w-4" />
                    )}
                </Button>
            ),
            cell: ({ row }) => {
                // Decode the profile_data
                const profileData = JSON.parse(row.original.profile_data);
                return <span>{profileData.name_jurusan}</span>; // Display Jurusan
            }
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const student = row.original;

                return (
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => handleEdit(student)}>
                            Edit
                        </Button>
                        <Button variant="destructive" onClick={() => handleDelete(student)}>
                            Delete
                        </Button>

                    </div>
                );
            },
        },
    ];
}

export default function Dashboard({ students }: any) {
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [newStudentValues, setNewStudentValues] = useState({
        name: "",
        email: "",
        nim: "",
        name_fakultas: "", // Updated for faculty name
        jurusan: "",
        is_active: false
    });

    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
    const [editValues, setEditValues] = useState({
        id: "",
        name: "",
        email: "",
        nim: "",
        name_fakultas: "", // Updated for faculty name
        jurusan: "",
        is_active: false
    });

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

    function createStudent(e: React.FormEvent) {
        e.preventDefault();

        router.post('/dashboard/student', newStudentValues, {
            onSuccess: () => {
                toast.success("Student successfully created");
            },
            onError: (errors) => {
                Object.values(errors).forEach((err: any) => {
                    toast.error(err);
                });
            },
            onFinish: () => {
                setNewStudentValues({
                    name: "",
                    email: "",
                    nim: "",
                    name_fakultas: "", // Reset faculty name
                    jurusan: "",
                    is_active: false
                });
                setCreateDialogOpen(false);
            }
        });
    }
    console.log(editValues);
    const handleEdit = (student: any) => {
        const profileData = JSON.parse(student.profile_data);

        setCurrentStudent(student);
        setEditValues({
            id: student.id,
            name: student.name,
            email: student.email,
            nim: profileData.nim, // Extract nim from decoded profile_data
            name_fakultas: profileData.fakultas, // Extract fakultas from decoded profile_data
            jurusan: profileData.name_jurusan,
            is_active: student.is_active// Extract jurusan from decoded profile_data
        });
        setEditDialogOpen(true);
    };

    function updateStudent(e: React.FormEvent) {
        e.preventDefault();

        if (!currentStudent) return;

        router.put(`/dashboard/student/${currentStudent.id}`, editValues, {
            onSuccess: () => {
                toast.success("Student successfully updated");
            },
            onError: (errors) => {
                Object.values(errors).forEach((err: any) => {
                    toast.error(err);
                });
            },
            onFinish: () => {
                setEditDialogOpen(false);
            }
        });
    }

    const handleDelete = (student: Student) => {
        setStudentToDelete(student);
        setDeleteDialogOpen(true);
    };

    function deleteStudent(e: React.FormEvent) {
        e.preventDefault();

        if (!studentToDelete) return;

        router.delete(`/dashboard/student/${studentToDelete.id}`, {
            onSuccess: () => {
                toast.success("Student successfully deleted");
            },
            onError: (errors) => {
                Object.values(errors).forEach((err: any) => {
                    toast.error(err);
                });
            },
            onFinish: () => {
                setDeleteDialogOpen(false);
            }
        });
    }

    const columns = getColumns(handleEdit, handleDelete);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="mx-10 mt-4">
                <div className="mt-4">
                    <a
                        href="/dashboard/export-students"
                        target="_blank" 
                        rel="noopener noreferrer" 
                    >
                        <Button variant="outline">
                            Export
                        </Button>
                    </a>
                </div>
                <DataTable columns={columns} data={students}>
                    {/* Create Student Dialog */}
                    <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline">Create</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Create Student</DialogTitle>
                                <DialogDescription>
                                    Create a new student record. Click save when you're done.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="create-name" className="text-right">
                                        name
                                    </Label>
                                    <Input
                                        id="create-name"
                                        placeholder="Enter name"
                                        value={newStudentValues.name}
                                        className="col-span-3"
                                        onChange={(e) => setNewStudentValues({ ...newStudentValues, name: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="create-email" className="text-right">
                                        Email
                                    </Label>
                                    <Input
                                        id="create-email"
                                        placeholder="Enter email"
                                        value={newStudentValues.email}
                                        className="col-span-3"
                                        onChange={(e) => setNewStudentValues({ ...newStudentValues, email: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="create-nim" className="text-right">
                                        NIM
                                    </Label>
                                    <Input
                                        id="create-nim"
                                        placeholder="Enter NIM"
                                        value={newStudentValues.nim}
                                        className="col-span-3"
                                        onChange={(e) => setNewStudentValues({ ...newStudentValues, nim: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="create-email" className="text-right">
                                        Is Active
                                    </Label>
                                    <Select onValueChange={(value) =>
                                        setNewStudentValues((prev) => ({
                                            ...prev,
                                            is_active: value === "1",
                                        }))
                                    }>
                                        <SelectTrigger className="w-70">
                                            <SelectValue placeholder="Select a status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Is Active</SelectLabel>
                                                <SelectItem key={1} value={"1"}>
                                                    True
                                                </SelectItem>
                                                <SelectItem key={2} value={"0"}>
                                                    False
                                                </SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="create-name_fakultas" className="text-right">
                                        name Fakultas
                                    </Label>
                                    <Input
                                        id="create-name_fakultas"
                                        placeholder="Enter faculty name"
                                        value={newStudentValues.name_fakultas}
                                        className="col-span-3"
                                        onChange={(e) => setNewStudentValues({ ...newStudentValues, name_fakultas: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="create-jurusan" className="text-right">
                                        Jurusan
                                    </Label>
                                    <Input
                                        id="create-jurusan"
                                        placeholder="Enter department"
                                        value={newStudentValues.jurusan}
                                        className="col-span-3"
                                        onChange={(e) => setNewStudentValues({ ...newStudentValues, jurusan: e.target.value })}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" onClick={createStudent}>Save changes</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Edit Student Dialog */}
                    <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Edit Student</DialogTitle>
                                <DialogDescription>
                                    Make changes to the student record.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="edit-name" className="text-right">
                                        name
                                    </Label>
                                    <Input
                                        id="edit-name"
                                        placeholder="Enter name"
                                        value={editValues.name}
                                        className="col-span-3"
                                        onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="edit-email" className="text-right">
                                        Email
                                    </Label>
                                    <Input
                                        id="edit-email"
                                        placeholder="Enter email"
                                        value={editValues.email}
                                        className="col-span-3"
                                        onChange={(e) => setEditValues({ ...editValues, email: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="edit-nim" className="text-right">
                                        NIM
                                    </Label>
                                    <Input
                                        id="edit-nim"
                                        placeholder="Enter NIM"
                                        value={editValues.nim}
                                        className="col-span-3"
                                        onChange={(e) => setEditValues({ ...editValues, nim: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="create-email" className="text-right">
                                        Role
                                    </Label>
                                    <Select value={editValues.is_active ? "1" : "0"} onValueChange={(value) =>
                                        setEditValues((prev) => ({
                                            ...prev,
                                            is_active: value === "1",
                                        }))
                                    }>
                                        <SelectTrigger className="w-70">
                                            <SelectValue placeholder="Select a status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Is Active</SelectLabel>
                                                <SelectItem key={1} value={"1"}>
                                                    True
                                                </SelectItem>
                                                <SelectItem key={2} value={"0"}>
                                                    False
                                                </SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="edit-name_fakultas" className="text-right">
                                        name Fakultas
                                    </Label>
                                    <Input
                                        id="edit-name_fakultas"
                                        placeholder="Enter faculty name"
                                        value={editValues.name_fakultas}
                                        className="col-span-3"
                                        onChange={(e) => setEditValues({ ...editValues, name_fakultas: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="edit-jurusan" className="text-right">
                                        Jurusan
                                    </Label>
                                    <Input
                                        id="edit-jurusan"
                                        placeholder="Enter department"
                                        value={editValues.jurusan}
                                        className="col-span-3"
                                        onChange={(e) => setEditValues({ ...editValues, jurusan: e.target.value })}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" onClick={updateStudent}>Save changes</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Delete Student Dialog */}
                    <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Confirm Delete</DialogTitle>
                                <DialogDescription>
                                    Are you sure you want to delete this student?
                                </DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                                {studentToDelete && (
                                    <p>
                                        You are about to delete the student: <strong>{studentToDelete.name}</strong> (ID: {studentToDelete.id})
                                    </p>
                                )}
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button variant="destructive" onClick={deleteStudent}>
                                    Delete
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </DataTable>
            </div>
        </AppLayout>
    );
}
