import { cn } from "@/lib/cn";

type SiteContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export function SiteContainer({ children, className }: SiteContainerProps) {
  return (
    <div className={cn("mx-auto max-w-7xl px-6", className)}>{children}</div>
  );
}
