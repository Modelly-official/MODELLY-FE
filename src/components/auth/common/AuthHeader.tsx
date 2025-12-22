import LeftArrowIcon from '@/public/icons/common/left-arrow.svg';

interface AuthHeaderProps {
  onBack: () => void;
}

/**
 * 뒤로가기 버튼이 있는 인증 페이지 공통 헤더
 */
export const AuthHeader: React.FC<AuthHeaderProps> = ({ onBack }) => (
  <div className="mx-4 mt-15">
    <button type="button" onClick={onBack} className="flex h-6 w-6 cursor-pointer items-center justify-center">
      <LeftArrowIcon />
    </button>
  </div>
);
