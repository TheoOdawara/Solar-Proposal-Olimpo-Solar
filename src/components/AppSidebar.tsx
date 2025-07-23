import { Home, FileText, History, BarChart3, LogOut } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAdminAccess } from "@/hooks/useAdminAccess";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Gerar Proposta", url: "/", icon: FileText },
  { title: "Histórico", url: "/historico", icon: History },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const { user, signOut } = useAuth();
  const { hasAdminAccess } = useAdminAccess();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-secondary/10 text-primary font-medium border-r-2 border-secondary" : "hover:bg-muted/50 text-foreground";

  const allItems = hasAdminAccess 
    ? [...items, { title: "Métricas", url: "/metrics", icon: BarChart3 }]
    : items;

  return (
    <Sidebar
      className="border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      collapsible="icon"
    >
      <SidebarHeader className="border-b px-4 py-3">
        <div className="flex items-center space-x-3">
          <img 
            src="/lovable-uploads/568489ba-4d5c-47e2-a032-5a3030b5507b.png" 
            alt="Olimpo Solar" 
            className="h-8 w-auto"
          />
          {state === "expanded" && (
            <div>
              <h2 className="text-lg font-semibold text-primary">Olimpo Solar</h2>
              <p className="text-xs text-muted-foreground">Sistema de Propostas</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className={state === "collapsed" ? "sr-only" : "text-primary font-medium"}>
            Navegação
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {allItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end 
                      className={getNavCls}
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {state === "expanded" && <span className="ml-3">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t px-2 py-4">
        <div className="space-y-2">
          {state === "expanded" && user?.email && (
            <div className="px-3 py-2 text-xs text-muted-foreground truncate">
              {user.email}
            </div>
          )}
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Button
                onClick={signOut}
                variant="ghost"
                className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="h-4 w-4 flex-shrink-0" />
                {state === "expanded" && <span className="ml-3">Sair</span>}
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}