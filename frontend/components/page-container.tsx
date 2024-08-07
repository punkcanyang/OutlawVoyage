import { cn } from "@/lib/utils";

export interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  backgroundImage?: string;
}

export const PageContainer = ({ children, className, backgroundImage }: PageContainerProps) => {
  return (
    <>
      {backgroundImage && (
        <div
          className="fixed inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}
      <div
        className={cn(
          "h-full relative z-10 flex flex-col py-12 px-4 gap-4",
          className
        )}
      >
        {children}
      </div>
    </>
  );
}
