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

export type Lecture = {
    id: string;
    name: string;
    email: string;
    is_active: boolean;
    profile: {
        nip: string;
        home_base: string;
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

function getColumns(handleEdit: (lecture: Lecture) => void, handleDelete: (lecture: Lecture) => void): ColumnDef<Lecture>[] {
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
            accessorKey: "is_active",
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
            accessorKey: "nip",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    NIP
                    {column.getIsSorted() === "asc" ? (
                        <ArrowUp className="ml-2 h-4 w-4" />
                    ) : (
                        <ArrowDown className="ml-2 h-4 w-4" />
                    )}
                </Button>
            ),
            cell: ({ row }) => {
                // Decode the profile_data
                const profileData = JSON.parse(row.original.profile);
                return <span>{profileData.nip}</span>; // Display NIM
            }
        },
        {
            accessorKey: "home_base",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Home Base
                    {column.getIsSorted() === "asc" ? (
                        <ArrowUp className="ml-2 h-4 w-4" />
                    ) : (
                        <ArrowDown className="ml-2 h-4 w-4" />
                    )}
                </Button>
            ),
            cell: ({ row }) => {
                // Decode the profile_data
                const profileData = JSON.parse(row.original.profile);
                return <span>{profileData.home_base}</span>; // Display NIM
            }
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const lecture = row.original;

                return (
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => handleEdit(lecture)}>
                            Edit
                        </Button>
                        <Button variant="destructive" onClick={() => handleDelete(lecture)}>
                            Delete
                        </Button>
                    </div>
                );
            },
        },
    ];
}

interface DashboardProps {
    lectures: Lecture[];
}

export default function Dashboard({ lectures = [] }: DashboardProps) {
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [newLectureValues, setNewLectureValues] = useState({
        name: "",
        email: "",
        is_active: false,
        profile: {
            nip: "",
            home_base: ""
        }
    });

    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [currentLecture, setCurrentLecture] = useState<Lecture | null>(null);
    const [editValues, setEditValues] = useState({
        id: "",
        name: "",
        email: "",
        is_active: false,
        profile: {
            nip: "",
            home_base: ""
        }
    });

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [lectureToDelete, setLectureToDelete] = useState<Lecture | null>(null);

    function createLecture(e: React.FormEvent) {
        e.preventDefault();

        router.post('/dashboard/lecturer', newLectureValues, {
            onSuccess: () => {
                toast.success("Lecture successfully created");
            },
            onError: (errors) => {
                Object.values(errors).forEach((err: any) => {
                    toast.error(err);
                });
            },
            onFinish: () => {
                setNewLectureValues({
                    name: "",
                    email: "",
                    is_active: false,
                    profile: {
                        nip: "",
                        home_base: ""
                    }
                });
                setCreateDialogOpen(false);
            }
        });
    }

    const handleEdit = (lecture: any) => {
        setCurrentLecture(lecture);
        const profile = JSON.parse(lecture.profile)
        setEditValues({
            id: lecture.id,
            name: lecture.name,
            email: lecture.email,
            is_active: lecture.is_active,
            profile: {
                nip: profile.nip,
                home_base: profile.home_base
            }
        });
        setEditDialogOpen(true);
    };

    function updateLecture(e: React.FormEvent) {
        e.preventDefault();

        if (!currentLecture) return;

        router.put(`/dashboard/lecturer/${currentLecture.id}`, editValues, {
            onSuccess: () => {
                toast.success("Lecture successfully updated");
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

    const handleDelete = (lecture: Lecture) => {
        setLectureToDelete(lecture);
        setDeleteDialogOpen(true);
    };

    function deleteLecture(e: React.FormEvent) {
        e.preventDefault();

        if (!lectureToDelete) return;

        router.delete(`/dashboard/lecturer/${lectureToDelete.id}`, {
            onSuccess: () => {
                toast.success("Lecture successfully deleted");
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
                        href="/dashboard/export-lecturer"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Button variant="outline">
                            Export
                        </Button>
                    </a>
                </div>
                <DataTable columns={columns} data={lectures}>
                    {/* Create Lecture Dialog */}
                    <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline">Create</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Create Lecture</DialogTitle>
                                <DialogDescription>
                                    Create a new lecture record. Click save when you're done.
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
                                        value={newLectureValues.name}
                                        className="col-span-3"
                                        onChange={(e) => setNewLectureValues({ ...newLectureValues, name: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="create-email" className="text-right">
                                        Email
                                    </Label>
                                    <Input
                                        id="create-email"
                                        placeholder="Enter email"
                                        value={newLectureValues.email}
                                        className="col-span-3"
                                        onChange={(e) => setNewLectureValues({ ...newLectureValues, email: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="create-nip" className="text-right">
                                        NIP
                                    </Label>
                                    <Input
                                        id="create-nip"
                                        placeholder="Enter NIP"
                                        value={newLectureValues.profile.nip}
                                        className="col-span-3"
                                        onChange={(e) => setNewLectureValues({ ...newLectureValues, profile: { ...newLectureValues.profile, nip: e.target.value } })}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="create-home_base" className="text-right">
                                        Home Base
                                    </Label>
                                    <Input
                                        id="create-home_base"
                                        placeholder="Enter Home Base"
                                        value={newLectureValues.profile.home_base}
                                        className="col-span-3"
                                        onChange={(e) => setNewLectureValues({ ...newLectureValues, profile: { ...newLectureValues.profile, home_base: e.target.value } })}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="create-is_active" className="text-right">
                                        Is Active
                                    </Label>
                                    <Select onValueChange={(value) =>
                                        setNewLectureValues((prev) => ({
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
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" onClick={createLecture}>Save changes</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Edit Lecture Dialog */}
                    <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Edit Lecture</DialogTitle>
                                <DialogDescription>
                                    Make changes to the lecture record.
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
                                    <Label htmlFor="edit-nip" className="text-right">
                                        NIP
                                    </Label>
                                    <Input
                                        id="edit-nip"
                                        placeholder="Enter NIP"
                                        value={editValues.profile.nip}
                                        className="col-span-3"
                                        onChange={(e) => setEditValues({ ...editValues, profile: { ...editValues.profile, nip: e.target.value } })}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="edit-home_base" className="text-right">
                                        Home Base
                                    </Label>
                                    <Input
                                        id="edit-home_base"
                                        placeholder="Enter Home Base"
                                        value={editValues.profile.home_base}
                                        className="col-span-3"
                                        onChange={(e) => setEditValues({ ...editValues, profile: { ...editValues.profile, home_base: e.target.value } })}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="edit-is_active" className="text-right">
                                        Is Active
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
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" onClick={updateLecture}>Save changes</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Delete Lecture Dialog */}
                    <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Confirm Delete</DialogTitle>
                                <DialogDescription>
                                    Are you sure you want to delete this lecture?
                                </DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                                {lectureToDelete && (
                                    <p>
                                        You are about to delete the lecture: <strong>{lectureToDelete.name}</strong> (ID: {lectureToDelete.id})
                                    </p>
                                )}
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button variant="destructive" onClick={deleteLecture}>
                                    Delete
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </DataTable>
            </div>
        </AppLayout >
    );
}
