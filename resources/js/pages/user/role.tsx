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
import { ArrowDown, ArrowUp } from 'lucide-react';

export type Role = {
  id: string
  name: string
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
];

export function getColumns(
  handleEdit: (role: Role) => void,
  handleDelete: (role: Role) => void
): ColumnDef<Role>[] {
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
          Role Name
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
        const role = row.original

        return (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleEdit(role)}>
              Edit
            </Button>
            <Button variant="destructive" onClick={() => handleDelete(role)}>
              Delete
            </Button>
          </div>
        )
      },
    },
  ]
}

export default function Dashboard({ roles }: any) {
  // Create role state
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newRoleValues, setNewRoleValues] = useState({
    name: ""
  });

  // Edit role state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<Role | null>(null);
  const [editValues, setEditValues] = useState({
    id: "",
    name: ""
  });

  // Delete role state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);

  // Create role handler
  function createRole(e: React.FormEvent) {
    e.preventDefault();
    
    router.post('/dashboard/role', newRoleValues, {
      onSuccess: () => {
        toast.success("Role successfully created");
      },
      onError: (errors) => {
        Object.values(errors).forEach((err: any) => {
          toast.error(err);
        });
      },
      onFinish: () => {
        setNewRoleValues({
          name: ""
        });
        setCreateDialogOpen(false);
      }
    });
  }

  // Edit role handlers
  const handleEdit = (role: Role) => {
    setCurrentRole(role);
    setEditValues({
      id: role.id,
      name: role.name
    });
    setEditDialogOpen(true);
  };

  function updateRole(e: React.FormEvent) {
    e.preventDefault();
    
    if (!currentRole) return;
    
    router.put(`/dashboard/role/${currentRole.id}`, editValues, {
      onSuccess: () => {
        toast.success("Role successfully updated");
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

  // Delete role handlers
  const handleDelete = (role: Role) => {
    setRoleToDelete(role);
    setDeleteDialogOpen(true);
  };

  function deleteRole(e: React.FormEvent) {
    e.preventDefault();
    
    if (!roleToDelete) return;
    
    router.delete(`/dashboard/role/${roleToDelete.id}`, {
      onSuccess: () => {
        toast.success("Role successfully deleted");
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

  // Get table columns with handlers
  const columns = getColumns(handleEdit, handleDelete);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
      <div className='mx-10 mt-4'>
        <DataTable columns={columns} data={roles}>
          {/* Create Role Dialog */}
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Create</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create Role</DialogTitle>
                <DialogDescription>
                  Create new role. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="create-name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="create-name"
                    placeholder="Enter name"
                    value={newRoleValues.name}
                    className="col-span-3"
                    onChange={(e) => setNewRoleValues({ ...newRoleValues, name: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" onClick={createRole}>Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </DataTable>

        {/* Edit Role Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Role</DialogTitle>
              <DialogDescription>
                Make changes to the role information below.
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
                  Role Name
                </Label>
                <Input
                  id="edit-name"
                  value={editValues.name}
                  onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" onClick={updateRole}>
                Save changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Role Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this role? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              {roleToDelete && (
                <p>
                  You are about to delete role: <strong>{roleToDelete.name}</strong> (ID: {roleToDelete.id})
                </p>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={deleteRole}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}