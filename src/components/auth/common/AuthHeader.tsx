import LeftArrowIcon from '@/public/icons/signup/leftarrow.svg';

interface AuthHeaderProps {
  onBack: () => void;
}

/**
 * 뒤로가기 버튼이 있는 인증 페이지 공통 헤더
 */
export const AuthHeader: React.FC<AuthHeaderProps> = ({ onBack }) => (
  <div className="mt-15 mx-4">
    <button type="button" onClick={onBack} className="w-6 h-6 flex items-center justify-center cursor-pointer">
      <LeftArrowIcon />
    </button>
  </div>
);
