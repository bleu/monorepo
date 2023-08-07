import { useParams } from "next/navigation";

export default function Page() {
  const { network, id } = useParams();

  return (
    <div className="flex h-full w-full flex-col justify-center rounded-3xl">
      hello from pool {id} in network {network}
    </div>
  );
}
