import Link from 'next/link';

type MenuListItem = {
  label: string;
  href?: string;
  onClick?: () => void;
};

type MenuListProps = {
  items: MenuListItem[];
  className?: string;
};

export const MenuList = ({ items }: MenuListProps) => {
  if (items.length === 0) return null;

  const itemStyle = 'text-body-1-medium w-full cursor-pointer py-3 text-left text-gray-900 block';

  return (
    <section>
      <div>
        {items.map(({ label, href, onClick }) => {
          if (href) {
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
              onClick={onClick}
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
