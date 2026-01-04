import { ReactNode } from 'react';

export type Menu = {
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
};

export const MyPageMenu = ({ actions }: { actions: Menu[] }) => {
  if (actions.length === 0) return null;

  return (
    <section className="rounded-2xl bg-gray-100 py-3">
      <div className="grid grid-cols-3">
        {actions.map(({ label, icon, onClick }, index) => (
          <div key={label} className="relative px-2.5">
            {index > 0 && (
              <span className="absolute top-1/2 left-0 h-[50px] w-px -translate-y-1/2 bg-gray-400" aria-hidden />
            )}
            <button
              type="button"
              onClick={onClick}
              className="flex w-full flex-col items-center justify-center gap-2 px-[21.67px] py-[9px] text-gray-900"
            >
              {icon && <span className="flex items-center justify-center text-gray-900">{icon}</span>}
              <span className="text-body-2-medium">{label}</span>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};
