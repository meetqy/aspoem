import { UserCard } from "@/components/user-card";

export default async function Home() {
  return (
    <div>
      Welcome to the Home Page
      <div className="max-w-xl">
        <UserCard />
      </div>
    </div>
  );
}
