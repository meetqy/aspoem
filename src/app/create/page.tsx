"use client";

import { api } from "~/trpc/react";
import Form from "../_components/form";

export default function CreatePage() {
  const mutation = api.prompt.create.useMutation({
    onSuccess: (data) => {
      console.log(data);
      alert(data);
      window.location.reload();
    },
  });
  const { data: tags } = api.tag.find.useQuery();

  return (
    <Form
      submit={(data) => {
        mutation.mutate(data);
      }}
      tags={tags ?? []}
    />
  );
}
