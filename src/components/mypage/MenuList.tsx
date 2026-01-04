type MenuListProps = {
  items: {
    label: string;
    onClick?: () => void;
  }[];
  className?: string;
};

export const MenuList = ({ items }: MenuListProps) => {
  if (items.length === 0) return null;

  return (
    <section>
      <div className="">
        {items.map(({ label, onClick }) => (
          <button
            key={label}
            type="button"
            onClick={onClick}
            className="text-body-1-medium w-full cursor-pointer py-3 text-left text-gray-900"
          >
            {label}
          </button>
        ))}
      </div>
    </section>
  );
};
