import { useTotalSignedMessages } from "../hooks/useContract";

function Viewer({ address }: { address: string }) {
  const totalRecords = useTotalSignedMessages(address);
  return <div>Total records: {totalRecords?.toString() || "fetching..."}</div>;
}

export default Viewer;
