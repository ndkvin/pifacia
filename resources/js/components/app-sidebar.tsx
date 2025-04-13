import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { User, LayoutGrid, KeyRound } from 'lucide-react';
import AppLogo from './app-logo';

const userNav: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Roles',
        href: '/dashboard/role',
        icon: KeyRound,
    },
];

const adminNav: NavItem[] = [
    {
        title: 'User',
        href: '/dashboard/user',
        icon: User,
        
    },
];

export function AppSidebar() {
    const auth: any = usePage().props.auth;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={userNav} role={'All User'} />
                {auth.user.role_id === 1 && (
                    <NavMain items={adminNav} role={'Administrator'} />
                )}
            </SidebarContent>
            
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
