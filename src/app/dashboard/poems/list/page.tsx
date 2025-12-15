"use client";

import { Trash, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import {
  ActionBar,
  ActionBarClose,
  ActionBarGroup,
  ActionBarSelection,
  ActionBarSeparator,
} from "@/components/ui/action-bar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDataTable } from "@/hooks/use-data-table";
import { api } from "@/trpc/react";
import { columns } from "./_components/columns";

export default function Page() {
  const search = useSearchParams();
  const pagination = {
    page: Number(search.get("page")) || 1,
    pageSize: Number(search.get("pageSize")) || 20,
  };

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [filters, setFilters] = useState<Record<string, string[]>>({
    dynastyIds: [],
  });

  const { data, refetch } = api.protectedPoem.list.useQuery({
    page: pagination.page,
    pageSize: pagination.pageSize,
    dynastyIds: filters.dynastyIds,
  });
  const { data: dynastyData } = api.protectedDynasty.getList.useQuery();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <filters>
  useEffect(() => {
    refetch();
  }, [refetch, filters]);

  const { table } = useDataTable({
    data: data?.items || [],
    columns,
    pageCount: data?.pageCount || 0,
    initialState: {
      pagination: {
        pageIndex: pagination.page - 1,
        pageSize: pagination.pageSize,
      },
    },
    getRowId: (row) => row.id,
    enableRowSelection: true,
    queryKeys: {
      page: "page",
      perPage: "pageSize",
    },
  });

  // Get selected rows
  const selectedRows = table.getSelectedRowModel().rows;
  const openActionBar = selectedRows.length > 0;

  const handleDeleteConfirm = async () => {};

  return (
    <section className="data-table-container">
      <DataTable
        table={table}
        classNames={{ table: "h-[calc(100vh-16rem)] overflow-y-auto" }}
        actionBar={
          <ActionBar open={openActionBar}>
            <ActionBarSelection>
              <span className="font-medium">{selectedRows.length}</span>
              <span>selected</span>
              <ActionBarSeparator />
              <ActionBarClose onClick={() => table.resetRowSelection()}>
                <X />
              </ActionBarClose>
            </ActionBarSelection>
            <ActionBarGroup>
              <Button
                variant="destructive"
                size={"sm"}
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash />
                Delete
              </Button>
            </ActionBarGroup>
          </ActionBar>
        }
      >
        <DataTableToolbar table={table}>
          <Select
            onValueChange={(e) => {
              setFilters((prev) => ({
                ...prev,
                dynastyIds: e ? [e] : [],
              }));
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select dynasty" />
            </SelectTrigger>
            <SelectContent>
              {dynastyData?.items.map((dynasty) => (
                <SelectItem key={dynasty.id} value={dynasty.id}>
                  {dynasty.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </DataTableToolbar>
      </DataTable>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {selectedRows.length} image
              {selectedRows.length !== 1 ? "s" : ""}. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
