interface SectionSeparatorProps {
  className?: string;
}

export function SectionSeparator({ className = '' }: SectionSeparatorProps) {
  return (
    <div className={`my-8 flex items-center ${className}`}>
      <div className="flex-grow border-t border-slate-200"></div>
      <div className="mx-4 text-sm text-slate-500">•</div>
      <div className="flex-grow border-t border-slate-200"></div>
    </div>
  );
}
