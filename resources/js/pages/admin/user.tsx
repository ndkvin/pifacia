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
} from "@/components/ui/dialog"
import { ColumnDef } from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import React, { useState } from 'react';
import { router } from '@inertiajs/react'
import { toast } from "sonner"
import { ArrowDown, ArrowUp, Eye, EyeOff } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
export type User = {
    id: string
    name: string
    email: string
    password?: string,
    role_id: string
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Users',
        href: '/dashboard/users',
    },
];

export function getColumns(
    handleEdit: (user: User) => void,
    handleDelete: (user: User) => void
): ColumnDef<User>[] {
    return [
        {
            accessorKey: "id",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    #
                    {column.getIsSorted() === "asc" ? (
                        <ArrowUp className="ml-2 h-4 w-4" />
                    ) : (
                        <ArrowDown className="ml-2 h-4 w-4" />
                    )}
                </Button>
            ),
        },
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
            id: "actions",
            cell: ({ row }) => {
                const user = row.original

                return (
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => handleEdit(user)}>
                            Edit
                        </Button>
                        <Button variant="destructive" onClick={() => handleDelete(user)}>
                            Delete
                        </Button>
                    </div>
                )
            },
        },
    ]
}

export default function Users({ users, roles }: { users: User[], roles: any[] }) {
    // Password visibility toggle state
    const [showCreatePassword, setShowCreatePassword] = useState(false);
    const [showEditPassword, setShowEditPassword] = useState(false);

    // Create user state
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [newUserValues, setNewUserValues] = useState({
        name: "",
        email: "",
        password: "",
        role_id: ""
    });

    // Edit user state
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [editValues, setEditValues] = useState({
        id: "",
        name: "",
        email: "",
        password: "",
        role_id: ""
    });

    // Delete user state
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);

    // Create user handler
    function createUser(e: React.FormEvent) {
        e.preventDefault();

        router.post('/dashboard/user', newUserValues, {
            onSuccess: () => {
                toast.success("User successfully created");
            },
            onError: (errors) => {
                Object.values(errors).forEach((err: any) => {
                    toast.error(err);
                });
            },
            onFinish: () => {
                setNewUserValues({
                    name: "",
                    email: "",
                    password: "",
                    role_id: ""
                });
                setCreateDialogOpen(false);
            }
        });
    }

    // Edit user handlers
    const handleEdit = (user: User) => {
        setCurrentUser(user);
        setEditValues({
            id: user.id,
            name: user.name,
            email: user.email,
            password: "",
            role_id: user.role_id
        });
        setEditDialogOpen(true);
    };

    function updateUser(e: React.FormEvent) {
        e.preventDefault();

        if (!currentUser) return;

        // Create payload (omit password if it's empty)
        const payload = {
            ...editValues,
            ...(editValues.password === "" && { password: undefined })
        };

        router.put(`/dashboard/user/${currentUser.id}`, payload, {
            onSuccess: () => {
                toast.success("User successfully updated");
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

    // Delete user handlers
    const handleDelete = (user: User) => {
        setUserToDelete(user);
        setDeleteDialogOpen(true);
    };

    function deleteUser(e: React.FormEvent) {
        e.preventDefault();

        if (!userToDelete) return;

        router.delete(`/dashboard/user/${userToDelete.id}`, {
            onSuccess: () => {
                toast.success("User successfully deleted");
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

    // Form input handlers
    const handleCreateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setNewUserValues(prev => ({
            ...prev,
            [id.replace('create-', '')]: value
        }));
    };

    const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setEditValues(prev => ({
            ...prev,
            [id.replace('edit-', '')]: value
        }));
    };

    // Get table columns with handlers
    const columns = getColumns(handleEdit, handleDelete);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <div className='mx-10 mt-4'>
                <DataTable columns={columns} data={users}>
                    {/* Create User Dialog */}
                    <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline">Create User</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Create User</DialogTitle>
                                <DialogDescription>
                                    Create a new user. Fill in all fields and click save when you're done.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="create-name" className="text-right">
                                        Name
                                    </Label>
                                    <Input
                                        id="create-name"
                                        placeholder="Enter full name"
                                        value={newUserValues.name}
                                        className="col-span-3"
                                        onChange={handleCreateInputChange}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="create-email" className="text-right">
                                        Email
                                    </Label>
                                    <Input
                                        id="create-email"
                                        type="email"
                                        placeholder="user@example.com"
                                        value={newUserValues.email}
                                        className="col-span-3"
                                        onChange={handleCreateInputChange}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="create-password" className="text-right">
                                        Password
                                    </Label>
                                    <div className="relative col-span-3">
                                        <Input
                                            id="create-password"
                                            type={showCreatePassword ? "text" : "password"}
                                            placeholder="Enter password"
                                            value={newUserValues.password}
                                            className="pr-10"
                                            onChange={handleCreateInputChange}
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 -translate-y-1/2"
                                            onClick={() => setShowCreatePassword(!showCreatePassword)}
                                        >
                                            {showCreatePassword ? (
                                                <EyeOff className="h-4 w-4 text-gray-500" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-gray-500" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="create-email" className="text-right">
                                        Role
                                    </Label>
                                    <Select onValueChange={(value) =>
                                        setNewUserValues((prev) => ({
                                            ...prev,
                                            role_id: value,
                                        }))
                                    }>
                                        <SelectTrigger className="w-70">
                                            <SelectValue placeholder="Select a role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Role</SelectLabel>
                                                {roles.map((role) => (
                                                    <SelectItem key={role.id} value={role.id}>
                                                        {role.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" onClick={createUser}>Create User</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </DataTable>

                {/* Edit User Dialog */}
                <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Edit User</DialogTitle>
                            <DialogDescription>
                                Make changes to the user information below. Leave password blank to keep it unchanged.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-id" className="text-right">
                                    ID
                                </Label>
                                <Input
                                    id="edit-id"
                                    value={editValues.id}
                                    className="col-span-3"
                                    disabled
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-name" className="text-right">
                                    Name
                                </Label>
                                <Input
                                    id="edit-name"
                                    value={editValues.name}
                                    className="col-span-3"
                                    onChange={handleEditInputChange}
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-email" className="text-right">
                                    Email
                                </Label>
                                <Input
                                    id="edit-email"
                                    type="email"
                                    value={editValues.email}
                                    className="col-span-3"
                                    onChange={handleEditInputChange}
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-password" className="text-right">
                                    Password
                                </Label>
                                <div className="relative col-span-3">
                                    <Input
                                        id="edit-password"
                                        type={showEditPassword ? "text" : "password"}
                                        placeholder="Leave blank to keep unchanged"
                                        value={editValues.password}
                                        className="pr-10"
                                        onChange={handleEditInputChange}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 -translate-y-1/2"
                                        onClick={() => setShowEditPassword(!showEditPassword)}
                                    >
                                        {showEditPassword ? (
                                            <EyeOff className="h-4 w-4 text-gray-500" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-gray-500" />
                                        )}
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="create-email" className="text-right">
                                    Role
                                </Label>
                                <Select value={editValues.role_id} onValueChange={(value) =>
                                    setEditValues((prev) => ({
                                        ...prev,
                                        role_id: value,
                                    }))
                                }>
                                    <SelectTrigger className="w-70">
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Role</SelectLabel>
                                            {roles.map((role) => (
                                                <SelectItem key={role.id} value={role.id}>
                                                    {role.name}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" onClick={updateUser}>
                                Save changes
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Delete User Dialog */}
                <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Confirm Delete</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete this user? This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                            {userToDelete && (
                                <div>
                                    <p>
                                        You are about to delete user: <strong>{userToDelete.name}</strong>
                                    </p>
                                    <p className="mt-2">
                                        <strong>ID:</strong> {userToDelete.id}<br />
                                        <strong>Email:</strong> {userToDelete.email}
                                    </p>
                                </div>
                            )}
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={deleteUser}>
                                Delete User
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}