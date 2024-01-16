import { Badge } from "~/components/ui/badge";

export default function Page() {
  return (
    <div className="container m-auto grid max-w-screen-md grid-cols-1 gap-4">
      {Array.from({ length: 100 }).map((_, i) => (
        <div
          className="flex h-36 cursor-pointer flex-col justify-between rounded-md border border-border p-4 transition-all hover:bg-muted hover:shadow-lg"
          key={i}
        >
          <div className="flex w-full items-center justify-between text-3xl font-medium">
            Jamie Peak
            <div className="flex space-x-2">
              <Badge variant={"secondary"} className="text-xs">
                <b className="mr-1 text-blue-700">12321</b>
                作品
              </Badge>
              <Badge variant={"secondary"} className="text-xs">
                <b className="mr-1">12321</b>作品
              </Badge>
            </div>
          </div>

          <p className="line-clamp-2 text-muted-foreground">
            Hi, let’s have a meeting tomorrow to discuss the project. I’ve been
            reviewing the project details and have some ideas I’d like to share.
            It’s crucial that we align on our next steps to ensure the project’s
            success.
          </p>
        </div>
      ))}
    </div>
  );
}
