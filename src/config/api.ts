export const API_CONFIG = {
  USE_MOCK: process.env.NEXT_PUBLIC_USE_MOCK === 'true',
  MOCK_ENDPOINTS: {
    recruitments: true,
    recruitmentDetail: true,
    designers: true,
    designerRecruitments: true,
  },
} as const;

export type MockEndpoint = keyof typeof API_CONFIG.MOCK_ENDPOINTS;

export const isMockEnabled = (endpoint: MockEndpoint): boolean => {
  return API_CONFIG.USE_MOCK || API_CONFIG.MOCK_ENDPOINTS[endpoint];
};
