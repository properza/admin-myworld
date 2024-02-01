export interface RewardDetail {
	description: string;
	end_date: string;
	is_delete: boolean;
	merchandise_id: string;
	name: string;
	picture: string;
	point: number;
	price: number;
	redeem_per_customer: number;
	start_date: string;
	title1: string;
	title2: string;
}

export interface RewardMetadata {
	currentPage: number;
	perPage: number;
	totalPage: number;
	totalRow: number;
}
