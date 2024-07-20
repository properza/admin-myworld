export interface Merchandise {
  merchandise_id: string;
  picture: string;
  name: string;
  title1: string;
  title2: string;
  description: string;
  start_date: string;
  end_date: string;
  point: number;
  price: number;
  redeem_per_customer?: number;
}
