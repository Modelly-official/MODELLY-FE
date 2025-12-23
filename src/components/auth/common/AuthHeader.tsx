import LeftArrowIcon from '@/public/icons/common/left-arrow.svg';

interface AuthHeaderProps {
  onBack: () => void;
}

/**
 * 뒤로가기 버튼이 있는 인증 페이지 공통 헤더
 */
export const AuthHeader: React.FC<AuthHeaderProps> = ({ onBack }) => (
  <div className="mx-4 flex h-14 items-center">
    <button type="button" onClick={onBack} className="h-6 w-6 cursor-pointer">
      <LeftArrowIcon />
    </button>
  </div>
);
