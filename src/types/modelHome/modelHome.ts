export type HomeCategory = 'ALL' | 'HAIR' | 'NAIL' | 'TATTOO' | 'EYELASH';

export type ReservationSummary = {
  id: number;
  designerName: string;
  shop: string;
  recruitmentTitle: string;
  date: string;
  time: string;
  dday: string;
  tags: string[];
};
