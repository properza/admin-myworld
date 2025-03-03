import { useOutletContext } from "@remix-run/react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";
import { SetboxesDataWithItemNo } from "~/models/setbox.server";
import { OrderWithItemNo } from "~/models/order.server";
import { cn } from "~/tailwind";

interface CustomerSetboxDetail {
    itemNo: number;
    redeem_code: string;
    approve_status: string;
    expired_date: string;
    is_used: string;
    point: number;
    created_at: string;
    coupon_name: string;
    paymentStatus: string;
    restaurant_name: string;
    restaurant_branch_name: string;
  }

  const columnHelper = createColumnHelper<CustomerSetboxDetail>();
  
  const columns = [
    columnHelper.accessor("itemNo", {
      header: () => "No.",
      cell: (info) => info.getValue(),
      size: 44,
    }),
    columnHelper.accessor("redeem_code", {
      header: () => "หมายเลขการแลกซื้อ",
      cell: (info) => info.getValue(),
      size: 136,
    }),
    columnHelper.accessor("coupon_name", {
      header: () => "ชื่อ Box Set",
      cell: (info) => info.getValue(),
      size: 128,
    }),
    columnHelper.accessor("restaurant_name", {
      header: () => "ชื่อร้าน",
      cell: (info) => info.getValue(),
      size: 128,
    }),
    columnHelper.accessor("restaurant_branch_name", {
      header: () => "พิกัด / โซน",
      cell: (info) => info.getValue(),
      size: 128,
    }),
    columnHelper.accessor("point", {
      header: () => "จำนวน Point ที่ใช้แลก",
      cell: (info) =>
        (info.getValue() || 0).toLocaleString("th-TH", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
      size: 128,
    }),
  ];

  type SetboxesDetail = Omit<SetboxesDataWithItemNo, "order"> & {
    order: OrderWithItemNo[];
  };