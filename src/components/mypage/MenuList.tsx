import Link from 'next/link';

type MenuListItem = {
  label: string;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
};

type MenuListProps = {
  items: MenuListItem[];
  className?: string;
};

export const MenuList = ({ items }: MenuListProps) => {
  if (items.length === 0) return null;

  const baseStyle = 'text-body-1-medium w-full py-3 text-left text-gray-900 block';
  const enabledStyle = 'cursor-pointer';
  const disabledStyle = 'opacity-50 cursor-not-allowed';

  return (
    <section>
      <div>
        {items.map(({ label, href, onClick, disabled }) => {
          const itemStyle = `${baseStyle} ${disabled ? disabledStyle : enabledStyle}`;

          if (href && !disabled) {
            return (
              <Link key={label} href={href} className={itemStyle}>
                {label}
              </Link>
            );
          }

          return (
            <button
              key={label}
              type="button"
              disabled={disabled}
              aria-disabled={disabled}
              onClick={disabled ? undefined : onClick}
              className={itemStyle}
            >
              {label}
            </button>
          );
        })}
      </div>
    </section>
  );
};
