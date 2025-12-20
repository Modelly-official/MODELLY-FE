// API 데이터 변환 유틸리티

// 성별을 API 형식으로 변환
export function convertGenderToApi(gender: string): 'MALE' | 'FEMALE' {
  return gender === '남자' ? 'MALE' : 'FEMALE';
}

// 카테고리를 API 형식으로 변환
export function convertCategoryToApi(category: string): 'HAIR' | 'NAIL' | 'TATTOO' | 'EYELASH' {
  const categoryMap: Record<string, 'HAIR' | 'NAIL' | 'TATTOO' | 'EYELASH'> = {
    헤어: 'HAIR',
    네일: 'NAIL',
    타투: 'TATTOO',
    속눈썹: 'EYELASH',
  };
  return categoryMap[category] || 'HAIR';
}
