import { useParams } from "next/navigation";

export default function Page() {
  const { network, id, roundId } = useParams();

  return (
    <div className="flex h-full w-full flex-col justify-center rounded-3xl">
      hello from pool {id} in network {network} for round {roundId}
    </div>
  );
}
