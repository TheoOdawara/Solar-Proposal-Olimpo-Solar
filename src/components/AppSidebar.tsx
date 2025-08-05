"use client";

import { cn } from "@/lib/utils";
import { NavLink, useLocation } from "react-router-dom";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Home, FileText, History, BarChart3, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAdminAccess } from "@/hooks/useAdminAccess";

interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar className={props.className} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <motion.div
      className={cn(
        "h-full px-4 py-4 hidden md:flex md:flex-col bg-background border-r w-[300px] flex-shrink-0",
        className
      )}
      animate={{
        width: animate ? (open ? "300px" : "60px") : "300px",
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar();
  return (
    <>
      <div
        className={cn(
          "h-10 px-4 py-4 flex flex-row md:hidden items-center justify-between bg-background border-b w-full"
        )}
        {...props}
      >
        <div className="flex justify-end z-20 w-full">
          <Menu
            className="text-foreground cursor-pointer"
            onClick={() => setOpen(!open)}
          />
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className={cn(
                "fixed h-full w-full inset-0 bg-background p-10 z-[100] flex flex-col justify-between",
                className
              )}
            >
              <div
                className="absolute right-10 top-10 z-50 text-foreground cursor-pointer"
                onClick={() => setOpen(!open)}
              >
                <X />
              </div>
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export const SidebarLink = ({
  link,
  className,
  isActive,
  onClick,
  ...props
}: {
  link: Links;
  className?: string;
  isActive?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}) => {
  const { open, animate } = useSidebar();
  
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={cn(
          "flex items-center justify-start gap-2 group/sidebar py-2 px-2 rounded-md transition-colors w-full text-left",
          isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
          className
        )}
      >
        {link.icon}
        <motion.span
          animate={{
            display: animate ? (open ? "inline-block" : "none") : "inline-block",
            opacity: animate ? (open ? 1 : 0) : 1,
          }}
          className="text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
        >
          {link.label}
        </motion.span>
      </button>
    );
  }
  
  return (
    <NavLink
      to={link.href}
      className={cn(
        "flex items-center justify-start gap-2 group/sidebar py-2 px-2 rounded-md transition-colors",
        isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
        className
      )}
      {...props}
    >
      {link.icon}
      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
      >
        {link.label}
      </motion.span>
    </NavLink>
  );
};

export const Logo = () => {
  const { open } = useSidebar();
  
  if (open) {
    return (
      <div className="flex items-center space-x-3 py-2">
        <img 
          src="/lovable-uploads/568489ba-4d5c-47e2-a032-5a3030b5507b.png" 
          alt="Olimpo Solar" 
          className="h-8 w-auto"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h2 className="text-lg font-semibold text-primary">Olimpo Solar</h2>
          <p className="text-xs text-muted-foreground">Sistema de Propostas</p>
        </motion.div>
      </div>
    );
  }
  
  return (
    <div className="flex items-center justify-center py-2">
      <img 
        src="/lovable-uploads/568489ba-4d5c-47e2-a032-5a3030b5507b.png" 
        alt="Olimpo Solar" 
        className="h-8 w-auto"
      />
    </div>
  );
};

export function AppSidebar() {
  const { user, signOut } = useAuth();
  const { hasAdminAccess } = useAdminAccess();
  const location = useLocation();
  const currentPath = location.pathname;
  const [open, setOpen] = useState(false);

  const items = [
    { label: "Dashboard", href: "/dashboard", icon: <Home className="h-5 w-5 flex-shrink-0" /> },
    { label: "Gerar Proposta", href: "/", icon: <FileText className="h-5 w-5 flex-shrink-0" /> },
    { label: "Histórico", href: "/historico", icon: <History className="h-5 w-5 flex-shrink-0" /> },
  ];

  const allItems = hasAdminAccess 
    ? [...items, { label: "Métricas", href: "/metrics", icon: <BarChart3 className="h-5 w-5 flex-shrink-0" /> }]
    : items;

  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody className="justify-between gap-10">
        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <Logo />
          <div className="mt-8 flex flex-col gap-2">
            {allItems.map((item, idx) => (
              <SidebarLink 
                key={idx} 
                link={item} 
                isActive={isActive(item.href)}
              />
            ))}
          </div>
        </div>
        <div className="border-t pt-4">
          {user?.email && (
            <div className="px-2 py-2 text-xs text-muted-foreground truncate mb-2">
              {user.email}
            </div>
          )}
          <SidebarLink
            link={{
              label: "Sair",
              href: "#",
              icon: <LogOut className="h-5 w-5 flex-shrink-0" />,
            }}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={(e) => {
              e.preventDefault();
              signOut();
            }}
          />
        </div>
      </SidebarBody>
    </Sidebar>
  );
}