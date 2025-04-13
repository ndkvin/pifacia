import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { DataTable } from '@/components/data-table';
import { Payment, columns } from "@/pages/roles/columns"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import React from 'react';
import { router } from '@inertiajs/react'
import { toast } from "sonner"

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
];

function getData(): Payment[] {
  return [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "728ed52f",
      amount: 200,
      status: "processing",
      email: "m@example.com",
    },
    {
      id: "728ed52f",
      amount: 300,
      status: "processing",
      email: "m@example.com",
    },
    {
      id: "728ed52f",
      amount: 400,
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "728ed52f",
      amount: 200,
      status: "processing",
      email: "m@example.com",
    },
    {
      id: "728ed52f",
      amount: 300,
      status: "processing",
      email: "m@example.com",
    },
    {
      id: "728ed52f",
      amount: 400,
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "728ed52f",
      amount: 200,
      status: "processing",
      email: "m@example.com",
    },
    {
      id: "728ed52f",
      amount: 300,
      status: "processing",
      email: "m@example.com",
    },
    {
      id: "728ed52f",
      amount: 400,
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "728ed52f",
      amount: 200,
      status: "processing",
      email: "m@example.com",
    },
    {
      id: "728ed52f",
      amount: 300,
      status: "processing",
      email: "m@example.com",
    },
    {
      id: "728ed52f",
      amount: 400,
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "728ed52f",
      amount: 200,
      status: "processing",
      email: "m@example.com",
    },
    {
      id: "728ed52f",
      amount: 300,
      status: "processing",
      email: "m@example.com",
    },
    {
      id: "728ed52f",
      amount: 400,
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "728ed52f",
      amount: 200,
      status: "processing",
      email: "m@example.com",
    },
    {
      id: "728ed52f",
      amount: 300,
      status: "processing",
      email: "m@example.com",
    },
    {
      id: "728ed52f",
      amount: 400,
      status: "pending",
      email: "m@example.com",
    }, {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "728ed52f",
      amount: 200,
      status: "processing",
      email: "m@example.com",
    },
    {
      id: "728ed52f",
      amount: 300,
      status: "processing",
      email: "m@example.com",
    },
    {
      id: "728ed52f",
      amount: 400,
      status: "pending",
      email: "m@example.com",
    },

  ]
}



export default function Dashboard({ roles }: any) {
  const data = getData();
  const [values, setValues] = React.useState({
    "name": ""
  })

  function createRole(e: any) {
    e.preventDefault()
    console.log(values)
    router.post('/dashboard/role', values, {
      onSuccess: (page) => {
        toast("Role created successfully")

      },
      onError: (errors) => {
        toast(errors.message)
      },
    })
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
      <div className='mx-10 mt-4'>
        <DataTable columns={columns} data={data}>
          <Dialog>
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
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="Enter name"
                    value={values.name}
                    className="col-span-3"
                    onChange={(e) => setValues({ ...values, name: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={createRole}>Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </DataTable>
      </div>
    </AppLayout>
  );
}
