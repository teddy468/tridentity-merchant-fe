declare interface RefundRequest {
  id: number;
  order_id: string;
  amount: number;
  transaction_date: string;
  meta: RefundRequestMeta;
  status: string;
  recipient: RefundRequestReception;
  user?: {email?: string}
}

declare interface RefundRequestMeta {
  description: string;
  attachments: string[];
}

declare interface RefundRequestReception {
  address: string;
  name: string;
  phone: string;
  avatar?: string;
}

declare interface RefundRequestDetail {
  id: number;
  order_id: string;
  amount: number;
  transaction_date: string;
  create_time: string;
  update_time: string;
  meta: RefundRequestMeta;
  recipient: RefundRequestReception;
  status: number;
}
