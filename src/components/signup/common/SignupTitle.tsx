interface SignupTitleProps {
  line1: string;
  line2?: string;
}

export const SignupTitle: React.FC<SignupTitleProps> = ({ line1, line2 }) => {
  return (
    <div className="mt-12 ml-4">
      <p className="text-black text-head-3-semibold tracking-tight mb-0">{line1}</p>
      {line2 && <p className="text-black text-head-3-semibold tracking-tight mb-0">{line2}</p>}
    </div>
  );
};
