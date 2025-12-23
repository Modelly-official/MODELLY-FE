interface SignupTitleProps {
  line1: string;
  line2?: string;
}

export const SignupTitle: React.FC<SignupTitleProps> = ({ line1, line2 }) => {
  return (
    <div className="mt-8 ml-4">
      <p className="text-head-3-semibold mb-0 tracking-tight text-black">{line1}</p>
      {line2 && <p className="text-head-3-semibold mb-0 tracking-tight text-black">{line2}</p>}
    </div>
  );
};
